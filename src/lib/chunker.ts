import { TranscriptChunk } from './types'
import { RawTranscriptSegment } from './youtube'

const TARGET_CHUNK_TOKENS = 250
const OVERLAP_SEGMENTS = 2
const APPROX_TOKENS_PER_WORD = 1.3

function estimateTokens(text: string): number {
  return Math.ceil(text.split(/\s+/).length * APPROX_TOKENS_PER_WORD)
}

export function chunkTranscript(
  episodeId: string,
  segments: RawTranscriptSegment[]
): TranscriptChunk[] {
  const chunks: TranscriptChunk[] = []
  let buffer: RawTranscriptSegment[] = []
  let tokenCount = 0
  let chunkIndex = 0

  const flush = (overlap: RawTranscriptSegment[]) => {
    if (buffer.length === 0) return
    const text = buffer.map(s => s.text).join(' ')
    const startTime = buffer[0].offset / 1000
    const lastSeg = buffer[buffer.length - 1]
    const endTime = (lastSeg.offset + lastSeg.duration) / 1000
    chunks.push({
      id: `${episodeId}-${chunkIndex}`,
      episodeId,
      text,
      startTime,
      endTime,
      chunkIndex,
    })
    chunkIndex++
    buffer = overlap
    tokenCount = overlap.reduce((sum, s) => sum + estimateTokens(s.text), 0)
  }

  for (const seg of segments) {
    const segTokens = estimateTokens(seg.text)
    if (tokenCount + segTokens > TARGET_CHUNK_TOKENS && buffer.length > 0) {
      const overlap = buffer.slice(-OVERLAP_SEGMENTS)
      flush(overlap)
    }
    buffer.push(seg)
    tokenCount += segTokens
  }

  if (buffer.length > 0) flush([])
  return chunks
}
