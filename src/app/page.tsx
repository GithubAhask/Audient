'use client'

import { useState, useCallback } from 'react'
import { Episode, AskResponse } from '@/lib/types'
import EpisodeLoader from '@/components/EpisodeLoader'
import EpisodeCard from '@/components/EpisodeCard'
import ChatPanel from '@/components/ChatPanel'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  citedChunks?: AskResponse['citedChunks']
}

export default function Home() {
  const [episode, setEpisode] = useState<Episode | null>(null)
  const [isIngesting, setIsIngesting] = useState(false)
  const [ingestStatus, setIngestStatus] = useState<string>('')
  const [ingestError, setIngestError] = useState<string>('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isAsking, setIsAsking] = useState(false)

  const handleLoadEpisode = useCallback(async (url: string) => {
    setIsIngesting(true)
    setIngestError('')
    setIngestStatus('Fetching episode...')
    setEpisode(null)
    setMessages([])

    try {
      // POST to ingest
      const res = await fetch('/api/episodes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ youtubeUrl: url }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to load episode')
      }

      const { episode: ep } = await res.json()
      setEpisode(ep)

      // If not ready yet, poll
      if (ep.status !== 'ready') {
        await pollEpisodeStatus(ep.id)
      } else {
        setIngestStatus('')
      }
    } catch (err) {
      setIngestError(String(err))
    } finally {
      setIsIngesting(false)
    }
  }, [])

  const pollEpisodeStatus = async (id: string) => {
    const statusLabels: Record<string, string> = {
      fetching: 'Fetching metadata...',
      transcribing: 'Loading transcript...',
      indexing: 'Indexing episode...',
      ready: 'Ready!',
      error: 'Error processing episode',
    }

    let attempts = 0
    const maxAttempts = 60 // 60 seconds max

    while (attempts < maxAttempts) {
      await new Promise(r => setTimeout(r, 1000))
      const res = await fetch(`/api/episodes/${id}`)
      const { episode: ep } = await res.json()

      setEpisode(ep)
      setIngestStatus(statusLabels[ep.status] ?? 'Processing...')

      if (ep.status === 'ready') {
        setIngestStatus('')
        return
      }
      if (ep.status === 'error') {
        throw new Error(ep.errorMessage || 'Episode processing failed')
      }
      attempts++
    }
    throw new Error('Episode processing timed out')
  }

  const handleAsk = useCallback(
    async (question: string, currentTimestamp?: number) => {
      if (!episode) return

      const userMsg: ChatMessage = { role: 'user', content: question }
      setMessages(prev => [...prev, userMsg])
      setIsAsking(true)

      try {
        const history = messages.map(m => ({ role: m.role, content: m.content }))

        const res = await fetch(`/api/episodes/${episode.id}/ask`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question,
            currentTimestamp,
            conversationHistory: history,
          }),
        })

        if (!res.ok) {
          const data = await res.json()
          if (data.error === 'SESSION_EXPIRED') {
            throw new Error('The server restarted and lost the episode data. Please reload the episode by clicking "Load different episode" and pasting the URL again.')
          }
          throw new Error(data.error || 'Failed to get answer')
        }

        const data: { answer: string; citedChunks: AskResponse['citedChunks'] } = await res.json()
        const assistantMsg: ChatMessage = {
          role: 'assistant',
          content: data.answer,
          citedChunks: data.citedChunks,
        }
        setMessages(prev => [...prev, assistantMsg])
      } catch (err) {
        const errorMsg: ChatMessage = {
          role: 'assistant',
          content: `Sorry, I couldn't process that question. ${String(err)}`,
        }
        setMessages(prev => [...prev, errorMsg])
      } finally {
        setIsAsking(false)
      }
    },
    [episode, messages]
  )

  const handleReset = useCallback(() => {
    setEpisode(null)
    setMessages([])
    setIngestError('')
    setIngestStatus('')
  }, [])

  return (
    <main className="min-h-screen bg-zinc-50 flex flex-col">
      <div className="w-full max-w-2xl mx-auto flex flex-col min-h-screen">
        {/* Header */}
        <div className="px-4 pt-6 pb-2">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-semibold text-zinc-900 tracking-tight">Audient</h1>
            {episode && (
              <button
                onClick={handleReset}
                className="text-xs text-zinc-400 hover:text-zinc-600 transition-colors"
              >
                Load different episode
              </button>
            )}
          </div>

          {!episode ? (
            <EpisodeLoader
              onLoad={handleLoadEpisode}
              isLoading={isIngesting}
              statusMessage={ingestStatus}
              error={ingestError}
            />
          ) : (
            <EpisodeCard episode={episode} statusMessage={ingestStatus} />
          )}
        </div>

        {/* Chat area — only shown when episode is ready */}
        {episode?.status === 'ready' && (
          <div className="flex-1 flex flex-col min-h-0 px-4 pb-4">
            <ChatPanel
              messages={messages}
              isLoading={isAsking}
              episodeYoutubeUrl={episode.youtubeUrl}
              onAsk={handleAsk}
            />
          </div>
        )}
      </div>
    </main>
  )
}
