import { describe, it, expect } from 'vitest'
import { chunkTranscript } from '@/lib/chunker'
import { RawTranscriptSegment } from '@/lib/youtube'

function makeSegments(count: number, textPerSeg = 'hello world foo bar baz'): RawTranscriptSegment[] {
  return Array.from({ length: count }, (_, i) => ({
    text: textPerSeg,
    offset: i * 5000, // 5 seconds apart
    duration: 4500,
  }))
}

describe('chunkTranscript', () => {
  it('returns non-empty chunks for non-empty input', () => {
    const segments = makeSegments(50)
    const chunks = chunkTranscript('ep1', segments)
    expect(chunks.length).toBeGreaterThan(0)
  })

  it('assigns correct episodeId to all chunks', () => {
    const segments = makeSegments(20)
    const chunks = chunkTranscript('episode-abc', segments)
    for (const chunk of chunks) {
      expect(chunk.episodeId).toBe('episode-abc')
    }
  })

  it('timestamps are monotonically increasing', () => {
    const segments = makeSegments(100)
    const chunks = chunkTranscript('ep1', segments)
    for (let i = 1; i < chunks.length; i++) {
      expect(chunks[i].startTime).toBeGreaterThanOrEqual(chunks[i - 1].startTime)
    }
  })

  it('chunk IDs are unique', () => {
    const segments = makeSegments(100)
    const chunks = chunkTranscript('ep1', segments)
    const ids = chunks.map(c => c.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(ids.length)
  })

  it('each chunk has non-empty text', () => {
    const segments = makeSegments(30)
    const chunks = chunkTranscript('ep1', segments)
    for (const chunk of chunks) {
      expect(chunk.text.trim()).toBeTruthy()
    }
  })

  it('start time is always less than or equal to end time', () => {
    const segments = makeSegments(50)
    const chunks = chunkTranscript('ep1', segments)
    for (const chunk of chunks) {
      expect(chunk.startTime).toBeLessThanOrEqual(chunk.endTime)
    }
  })

  it('returns single chunk for very short input', () => {
    const segments = makeSegments(3, 'short text')
    const chunks = chunkTranscript('ep1', segments)
    expect(chunks.length).toBeGreaterThanOrEqual(1)
  })
})
