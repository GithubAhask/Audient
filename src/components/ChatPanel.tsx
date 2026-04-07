'use client'

import { useRef, useEffect } from 'react'
import { ChatMessage } from '@/app/page'
import MessageBubble from './MessageBubble'
import ChatInput from './ChatInput'

interface ChatPanelProps {
  messages: ChatMessage[]
  isLoading: boolean
  episodeYoutubeUrl: string
  onAsk: (question: string, currentTimestamp?: number) => void
}

export default function ChatPanel({ messages, isLoading, episodeYoutubeUrl, onAsk }: ChatPanelProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  return (
    <div className="flex flex-col h-full min-h-0 mt-4">
      {/* Scroll area */}
      <div className="flex-1 overflow-y-auto space-y-3 pb-2 min-h-0">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-sm text-zinc-400">Ask a question about this episode</p>
          </div>
        ) : (
          messages.map((msg, i) => (
            <MessageBubble
              key={i}
              message={msg}
              episodeYoutubeUrl={episodeYoutubeUrl}
            />
          ))
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-zinc-200 rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1 items-center">
                <span className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input fixed at bottom */}
      <div className="pt-3 border-t border-zinc-100">
        <ChatInput onAsk={onAsk} isLoading={isLoading} />
      </div>
    </div>
  )
}
