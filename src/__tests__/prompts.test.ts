import { describe, it, expect } from 'vitest'
import { formatTimestamp, buildSystemPrompt } from '@/lib/prompts'
import { TranscriptChunk } from '@/lib/types'

function makeChunk(overrides: Partial<TranscriptChunk> = {}): TranscriptChunk {
  return {
    id: 'ep1-0',
    episodeId: 'ep1',
    text: 'This is a test chunk about machine learning.',
    startTime: 90,
    endTime: 120,
    chunkIndex: 0,
    ...overrides,
  }
}

describe('formatTimestamp', () => {
  it('formats 0 seconds as 0:00', () => {
    expect(formatTimestamp(0)).toBe('0:00')
  })

  it('formats 90 seconds as 1:30', () => {
    expect(formatTimestamp(90)).toBe('1:30')
  })

  it('formats 3661 seconds as 61:01', () => {
    expect(formatTimestamp(3661)).toBe('61:01')
  })

  it('pads single-digit seconds with zero', () => {
    expect(formatTimestamp(65)).toBe('1:05')
  })
})

describe('buildSystemPrompt', () => {
  it('includes chunk text in prompt', () => {
    const chunk = makeChunk({ text: 'Neural networks are powerful.' })
    const prompt = buildSystemPrompt([chunk])
    expect(prompt).toContain('Neural networks are powerful.')
  })

  it('includes formatted timestamp in prompt', () => {
    const chunk = makeChunk({ startTime: 90 }) // 1:30
    const prompt = buildSystemPrompt([chunk])
    expect(prompt).toContain('[1:30]')
  })

  it('includes position note when currentTimestamp provided', () => {
    const chunk = makeChunk()
    const prompt = buildSystemPrompt([chunk], 300) // 5:00
    expect(prompt).toContain('5:00')
    expect(prompt).toContain('Do not reveal content that occurs after this point')
  })

  it('omits position note when no currentTimestamp', () => {
    const chunk = makeChunk()
    const prompt = buildSystemPrompt([chunk])
    expect(prompt).toContain("hasn't set a position")
  })

  it('includes all chunks when multiple provided', () => {
    const chunks = [
      makeChunk({ id: 'ep1-0', text: 'First chunk content' }),
      makeChunk({ id: 'ep1-1', text: 'Second chunk content', chunkIndex: 1 }),
    ]
    const prompt = buildSystemPrompt(chunks)
    expect(prompt).toContain('First chunk content')
    expect(prompt).toContain('Second chunk content')
  })
})
