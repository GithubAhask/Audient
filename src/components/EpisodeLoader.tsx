'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'

interface EpisodeLoaderProps {
  onLoad: (url: string) => void
  isLoading: boolean
  statusMessage: string
  error: string
}

export default function EpisodeLoader({ onLoad, isLoading, statusMessage, error }: EpisodeLoaderProps) {
  const [url, setUrl] = useState('')
  const [validationError, setValidationError] = useState('')

  const validate = (val: string) => {
    if (!val.includes('youtube.com') && !val.includes('youtu.be')) {
      return 'Please enter a YouTube URL'
    }
    return ''
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const err = validate(url.trim())
    if (err) {
      setValidationError(err)
      return
    }
    setValidationError('')
    onLoad(url.trim())
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-zinc-500 mb-3">
          Paste a YouTube podcast URL to get started. Ask questions while you listen.
        </p>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="url"
            value={url}
            onChange={e => {
              setUrl(e.target.value)
              if (validationError) setValidationError('')
            }}
            placeholder="https://youtube.com/watch?v=..."
            disabled={isLoading}
            className="flex-1 bg-white"
          />
          <Button type="submit" disabled={isLoading || !url.trim()}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Load'}
          </Button>
        </form>
        {(validationError || error) && (
          <p className="text-xs text-red-500 mt-2">{validationError || error}</p>
        )}
      </div>

      {isLoading && statusMessage && (
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <Loader2 className="h-3 w-3 animate-spin" />
          <span>{statusMessage}</span>
        </div>
      )}
    </div>
  )
}
