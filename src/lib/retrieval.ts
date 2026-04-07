import { TranscriptChunk } from './types'
import { embedQuery } from './embedder'
import { store } from './store'

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, normA = 0, normB = 0
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB))
}

function keywordScore(query: string, text: string): number {
  const queryTerms = query.toLowerCase().split(/\s+/)
  const textLower = text.toLowerCase()
  let matches = 0
  for (const term of queryTerms) {
    if (term.length > 3 && textLower.includes(term)) matches++
  }
  return matches / Math.max(queryTerms.length, 1)
}

function timestampBias(chunk: TranscriptChunk, currentTimestamp?: number): number {
  if (currentTimestamp === undefined) return 1.0
  if (chunk.startTime <= currentTimestamp) return 1.0
  const minutesPast = (chunk.startTime - currentTimestamp) / 60
  return Math.exp(-0.14 * minutesPast)
}

export async function retrieveRelevantChunks(
  episodeId: string,
  query: string,
  currentTimestamp?: number,
  topK = 5
): Promise<TranscriptChunk[]> {
  const chunks = store.getChunks(episodeId)
  if (chunks.length === 0) throw new Error('Episode not indexed')

  const queryEmbedding = await embedQuery(query)

  const scored = chunks.map(chunk => {
    if (!chunk.embedding) return { chunk, score: 0 }
    const semantic = cosineSimilarity(queryEmbedding, chunk.embedding)
    const keyword = keywordScore(query, chunk.text)
    const bias = timestampBias(chunk, currentTimestamp)
    const combined = (semantic * 0.7 + keyword * 0.3) * bias
    return { chunk, score: combined }
  })

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map(s => s.chunk)
}
