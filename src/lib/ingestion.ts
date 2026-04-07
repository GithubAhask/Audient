import { Episode } from './types'
import { extractVideoId, fetchTranscript, fetchVideoMetadata } from './youtube'
import { chunkTranscript } from './chunker'
import { embedChunks } from './embedder'
import { store } from './store'

export async function ingestEpisode(youtubeUrl: string): Promise<Episode> {
  const videoId = await extractVideoId(youtubeUrl)

  const existing = store.getEpisode(videoId)
  if (existing?.status === 'ready') return existing

  const episode: Episode = {
    id: videoId,
    youtubeUrl,
    title: '',
    channelName: '',
    durationSeconds: 0,
    thumbnailUrl: '',
    status: 'fetching',
    createdAt: Date.now(),
  }
  store.setEpisode(episode)

  try {
    // Metadata may already be set by the POST route — only fetch if missing
    const current = store.getEpisode(videoId)
    if (!current?.title) {
      store.updateEpisodeStatus(videoId, 'fetching')
      const metadata = await fetchVideoMetadata(videoId)
      store.setEpisode({ ...(store.getEpisode(videoId) ?? episode), ...metadata, status: 'transcribing' })
    } else {
      store.updateEpisodeStatus(videoId, 'transcribing')
    }

    store.updateEpisodeStatus(videoId, 'transcribing')
    const segments = await fetchTranscript(videoId)

    store.updateEpisodeStatus(videoId, 'indexing')
    const chunks = chunkTranscript(videoId, segments)

    const embeddedChunks = await embedChunks(chunks)
    store.setChunks(videoId, embeddedChunks)

    const readyEpisode = store.getEpisode(videoId)!
    store.setEpisode({ ...readyEpisode, status: 'ready' })
    return store.getEpisode(videoId)!
  } catch (err) {
    store.updateEpisodeStatus(videoId, 'error', String(err))
    throw err
  }
}
