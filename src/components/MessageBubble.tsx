'use client'

import ReactMarkdown from 'react-markdown'
import { ChatMessage } from '@/app/page'
import TimestampBadge from './TimestampBadge'

interface MessageBubbleProps {
  message: ChatMessage
  episodeYoutubeUrl: string
}

function parseTimestamps(text: string, youtubeUrl: string): React.ReactNode[] {
  const parts = text.split(/(\[\d+:\d{2}\])/g)
  return parts.map((part, i) => {
    const match = part.match(/\[(\d+):(\d{2})\]/)
    if (match) {
      const minutes = parseInt(match[1])
      const seconds = parseInt(match[2])
      const totalSeconds = minutes * 60 + seconds
      return (
        <TimestampBadge
          key={i}
          seconds={totalSeconds}
          episodeYoutubeUrl={youtubeUrl}
          label={part}
        />
      )
    }
    return part
  })
}

export default function MessageBubble({ message, episodeYoutubeUrl }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="bg-zinc-900 text-white rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[80%]">
          <p className="text-sm">{message.content}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-start">
      <div className="bg-white border border-zinc-200 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[90%] shadow-sm">
        <div className="text-sm text-zinc-800 prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0">
          <ReactMarkdown
            components={{
              p: ({ children }) => (
                <p>
                  {typeof children === 'string'
                    ? parseTimestamps(children, episodeYoutubeUrl)
                    : children}
                </p>
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  )
}
