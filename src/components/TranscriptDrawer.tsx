'use client'

import { useState } from 'react'
import { TranscriptChunk } from '@/lib/types'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface TranscriptDrawerProps {
  episodeId: string
}

function formatTimestamp(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function TranscriptDrawer({ episodeId }: TranscriptDrawerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [chunks, setChunks] = useState<TranscriptChunk[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const loadTranscript = async () => {
    if (chunks.length > 0) {
      setIsOpen(!isOpen)
      return
    }
    setIsLoading(true)
    try {
      const res = await fetch(`/api/episodes/${episodeId}/transcript`)
      const { chunks: data } = await res.json()
      setChunks(data)
      setIsOpen(true)
    } catch (err) {
      console.error('Failed to load transcript', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="border-t border-zinc-100 mt-2">
      <button
        onClick={loadTranscript}
        className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-600 py-2 transition-colors"
        disabled={isLoading}
      >
        {isOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        {isLoading ? 'Loading transcript...' : isOpen ? 'Hide transcript' : 'View transcript'}
      </button>

      {isOpen && (
        <div className="max-h-64 overflow-y-auto space-y-2 pb-2">
          {chunks.map(chunk => (
            <div key={chunk.id} className="flex gap-2 text-xs">
              <span className="flex-shrink-0 font-mono text-zinc-400 w-10">
                {formatTimestamp(chunk.startTime)}
              </span>
              <p className="text-zinc-600 leading-relaxed">{chunk.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
