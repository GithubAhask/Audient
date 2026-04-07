import { NextRequest, NextResponse } from 'next/server'
import { ingestEpisode } from '@/lib/ingestion'
import { extractVideoId, fetchVideoMetadata } from '@/lib/youtube'
import { store } from '@/lib/store'
import { Episode } from '@/lib/types'
import { IngestRequest } from '@/lib/types'

export async function POST(req: NextRequest) {
  try {
    const body: IngestRequest = await req.json()
    if (!body.youtubeUrl) {
      return NextResponse.json({ error: 'youtubeUrl is required' }, { status: 400 })
    }

    const videoId = await extractVideoId(body.youtubeUrl)

    // Return existing ready episode immediately
    const existing = store.getEpisode(videoId)
    if (existing?.status === 'ready') {
      return NextResponse.json({ episode: existing })
    }

    // Seed a fetching record so the frontend can start polling right away
    if (!existing) {
      let title = '', channelName = '', thumbnailUrl = ''
      try {
        const meta = await fetchVideoMetadata(videoId)
        title = meta.title
        channelName = meta.channelName
        thumbnailUrl = meta.thumbnailUrl
      } catch { /* metadata fetch failed — continue without it */ }

      const seed: Episode = {
        id: videoId,
        youtubeUrl: body.youtubeUrl,
        title,
        channelName,
        durationSeconds: 0,
        thumbnailUrl,
        status: 'fetching',
        createdAt: Date.now(),
      }
      store.setEpisode(seed)
    }

    // Fire off the full ingest in the background — don't await it
    ingestEpisode(body.youtubeUrl).catch(err => {
      store.updateEpisodeStatus(videoId, 'error', String(err))
    })

    // Return immediately so the frontend starts polling via GET /api/episodes/:id
    return NextResponse.json({ episode: store.getEpisode(videoId) })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
