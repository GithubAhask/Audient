'use client'

import { useState, useRef, KeyboardEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { SendHorizontal } from 'lucide-react'

interface ChatInputProps {
  onAsk: (question: string, currentTimestamp?: number) => void
  isLoading: boolean
}

function parseTimestampInput(value: string): number | undefined {
  const match = value.trim().match(/^(\d+):(\d{2})$/)
  if (!match) return undefined
  return parseInt(match[1]) * 60 + parseInt(match[2])
}

export default function ChatInput({ onAsk, isLoading }: ChatInputProps) {
  const [question, setQuestion] = useState('')
  const [timestampInput, setTimestampInput] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = () => {
    const trimmed = question.trim()
    if (!trimmed || isLoading) return
    const ts = parseTimestampInput(timestampInput)
    onAsk(trimmed, ts)
    setQuestion('')
    textareaRef.current?.focus()
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="space-y-2">
      {/* Timestamp row */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-zinc-400 whitespace-nowrap">Current position</span>
        <Input
          value={timestampInput}
          onChange={e => setTimestampInput(e.target.value)}
          placeholder="e.g. 32:15"
          className="w-28 h-7 text-xs bg-white"
          disabled={isLoading}
        />
        <span className="text-xs text-zinc-300">(optional — helps avoid spoilers)</span>
      </div>

      {/* Question row */}
      <div className="flex gap-2 items-end">
        <Textarea
          ref={textareaRef}
          value={question}
          onChange={e => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question about this episode..."
          rows={2}
          className="flex-1 resize-none bg-white text-sm"
          disabled={isLoading}
        />
        <Button
          onClick={handleSubmit}
          disabled={!question.trim() || isLoading}
          size="icon"
          className="h-[4.5rem] w-10 flex-shrink-0"
        >
          <SendHorizontal className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-xs text-zinc-300">Enter to send · Shift+Enter for new line</p>
    </div>
  )
}
