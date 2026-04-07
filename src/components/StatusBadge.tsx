import { EpisodeStatus } from '@/lib/types'

const STATUS_CONFIG: Record<EpisodeStatus, { label: string; className: string }> = {
  idle: { label: 'Idle', className: 'bg-zinc-100 text-zinc-500' },
  fetching: { label: 'Fetching', className: 'bg-blue-50 text-blue-600' },
  transcribing: { label: 'Transcribing', className: 'bg-blue-50 text-blue-600' },
  indexing: { label: 'Indexing', className: 'bg-amber-50 text-amber-600' },
  ready: { label: 'Ready', className: 'bg-green-50 text-green-600' },
  error: { label: 'Error', className: 'bg-red-50 text-red-600' },
}

export default function StatusBadge({ status }: { status: EpisodeStatus }) {
  const config = STATUS_CONFIG[status]
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  )
}
