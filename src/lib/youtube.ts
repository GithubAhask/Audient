import { YoutubeTranscript } from 'youtube-transcript'

export interface RawTranscriptSegment {
  text: string
  offset: number
  duration: number
}

export async function extractVideoId(url: string): Promise<string> {
  const patterns = [
    /(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:embed\/)([a-zA-Z0-9_-]{11})/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  throw new Error('Invalid YouTube URL — could not extract video ID')
}

export async function fetchTranscript(videoId: string): Promise<RawTranscriptSegment[]> {
  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoId)
    return transcript.map(seg => ({
      text: seg.text.trim(),
      offset: seg.offset,
      duration: seg.duration,
    }))
  } catch (err) {
    throw new Error(
      `Could not retrieve transcript. The video may have captions disabled. Error: ${err}`
    )
  }
}

export async function fetchVideoMetadata(videoId: string): Promise<{
  title: string
  channelName: string
  durationSeconds: number
  thumbnailUrl: string
}> {
  const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
  const res = await fetch(oembedUrl)
  if (!res.ok) throw new Error('Could not fetch video metadata')
  const data = await res.json()
  return {
    title: data.title,
    channelName: data.author_name,
    durationSeconds: 0,
    thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
  }
}
