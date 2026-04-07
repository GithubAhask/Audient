export type EpisodeStatus = 'idle' | 'fetching' | 'transcribing' | 'indexing' | 'ready' | 'error'

export interface Episode {
  id: string
  youtubeUrl: string
  title: string
  channelName: string
  durationSeconds: number
  thumbnailUrl: string
  status: EpisodeStatus
  errorMessage?: string
  createdAt: number
}

export interface TranscriptChunk {
  id: string
  episodeId: string
  text: string
  startTime: number
  endTime: number
  chunkIndex: number
  embedding?: number[]
}

export interface Conversation {
  id: string
  episodeId: string
  createdAt: number
}

export interface Message {
  id: string
  conversationId: string
  role: 'user' | 'assistant'
  content: string
  timestampContext?: number
  citedChunkIds?: string[]
  createdAt: number
}

export interface IngestRequest {
  youtubeUrl: string
}

export interface IngestResponse {
  episode: Episode
}

export interface AskRequest {
  question: string
  currentTimestamp?: number
  conversationHistory: { role: 'user' | 'assistant'; content: string }[]
}

export interface AskResponse {
  answer: string
  citedChunks: Pick<TranscriptChunk, 'id' | 'startTime' | 'endTime' | 'text'>[]
}
