'use client'

interface TimestampBadgeProps {
  seconds: number
  episodeYoutubeUrl: string
  label: string
}

function getYoutubeTimestampUrl(youtubeUrl: string, seconds: number): string {
  try {
    const url = new URL(youtubeUrl)
    url.searchParams.set('t', String(Math.floor(seconds)))
    return url.toString()
  } catch {
    return youtubeUrl
  }
}

export default function TimestampBadge({ seconds, episodeYoutubeUrl, label }: TimestampBadgeProps) {
  const href = getYoutubeTimestampUrl(episodeYoutubeUrl, seconds)

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-mono bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900 transition-colors cursor-pointer mx-0.5 no-underline"
      title={`Open YouTube at ${label}`}
    >
      {label}
    </a>
  )
}
