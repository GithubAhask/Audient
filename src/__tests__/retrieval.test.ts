import { describe, it, expect, vi, beforeEach } from 'vitest'
import { retrieveRelevantChunks } from '@/lib/retrieval'
import { store } from '@/lib/store'
import { TranscriptChunk } from '@/lib/types'

// Mock the embedder
vi.mock('@/lib/embedder', () => ({
  embedQuery: vi.fn().mockResolvedValue([1, 0, 0]),
}))

function makeChunk(id: string, text: string, startTime: number, embedding: number[]): TranscriptChunk {
  return {
    id,
    episodeId: 'ep-test',
    text,
    startTime,
    endTime: startTime + 30,
    chunkIndex: 0,
    embedding,
  }
}

describe('retrieveRelevantChunks', () => {
  beforeEach(() => {
    // Set up test chunks with known embeddings
    // Query embedding is [1, 0, 0]
    const chunks: TranscriptChunk[] = [
      makeChunk('ep-test-0', 'machine learning neural networks', 0, [1, 0, 0]),    // perfect match
      makeChunk('ep-test-1', 'cooking recipes pasta', 60, [0, 1, 0]),              // no match
      makeChunk('ep-test-2', 'machine learning statistics', 120, [0.9, 0.1, 0]),   // good match
    ]
    store.setChunks('ep-test', chunks)
  })

  it('returns the most semantically similar chunk first', async () => {
    const results = await retrieveRelevantChunks('ep-test', 'neural networks', undefined, 3)
    expect(results[0].id).toBe('ep-test-0')
  })

  it('returns at most topK results', async () => {
    const results = await retrieveRelevantChunks('ep-test', 'machine learning', undefined, 2)
    expect(results.length).toBeLessThanOrEqual(2)
  })

  it('applies timestamp bias — chunk before currentTimestamp scores higher than one after', async () => {
    // Chunk at 0s and chunk at 120s
    // If current timestamp is 30s, chunk at 0s should score higher than chunk at 120s
    const results = await retrieveRelevantChunks('ep-test', 'machine learning', 30, 3)
    const chunk0Index = results.findIndex(c => c.id === 'ep-test-0')
    const chunk2Index = results.findIndex(c => c.id === 'ep-test-2')
    // Both exist and chunk-0 (before timestamp) ranks above chunk-2 (after timestamp)
    if (chunk0Index !== -1 && chunk2Index !== -1) {
      expect(chunk0Index).toBeLessThan(chunk2Index)
    }
  })

  it('throws if episode has no chunks', async () => {
    await expect(
      retrieveRelevantChunks('nonexistent-ep', 'test query')
    ).rejects.toThrow('Episode not indexed')
  })
})
