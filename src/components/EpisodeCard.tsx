import { Episode } from '@/lib/types'
import StatusBadge from './StatusBadge'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'

interface EpisodeCardProps {
  episode: Episode
  statusMessage?: string
}

export default function EpisodeCard({ episode, statusMessage }: EpisodeCardProps) {
  return (
    <div className="flex gap-3 p-3 bg-white rounded-xl border border-zinc-200 shadow-sm">
      {episode.thumbnailUrl && (
        <div className="flex-shrink-0 relative w-20 h-14 rounded-lg overflow-hidden bg-zinc-100">
          <Image
            src={episode.thumbnailUrl}
            alt={episode.title}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-zinc-900 line-clamp-2 leading-snug">
          {episode.title || 'Loading...'}
        </p>
        {episode.channelName && (
          <p className="text-xs text-zinc-500 mt-0.5 truncate">{episode.channelName}</p>
        )}
        <div className="flex items-center gap-2 mt-1.5">
          <StatusBadge status={episode.status} />
          {statusMessage && (
            <span className="flex items-center gap-1 text-xs text-zinc-400">
              <Loader2 className="h-2.5 w-2.5 animate-spin" />
              {statusMessage}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
