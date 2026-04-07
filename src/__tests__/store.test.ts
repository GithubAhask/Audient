import { describe, it, expect, beforeEach } from 'vitest'
import { store } from '@/lib/store'
import { Episode, TranscriptChunk, Conversation, Message } from '@/lib/types'

describe('store', () => {
  it('sets and gets an episode', () => {
    const ep: Episode = {
      id: 'test-ep-1',
      youtubeUrl: 'https://youtube.com/watch?v=test',
      title: 'Test Episode',
      channelName: 'Test Channel',
      durationSeconds: 3600,
      thumbnailUrl: 'https://example.com/thumb.jpg',
      status: 'ready',
      createdAt: Date.now(),
    }
    store.setEpisode(ep)
    expect(store.getEpisode('test-ep-1')).toEqual(ep)
  })

  it('updates episode status', () => {
    const ep: Episode = {
      id: 'test-ep-2',
      youtubeUrl: 'https://youtube.com/watch?v=test2',
      title: 'Test',
      channelName: 'Channel',
      durationSeconds: 0,
      thumbnailUrl: '',
      status: 'fetching',
      createdAt: Date.now(),
    }
    store.setEpisode(ep)
    store.updateEpisodeStatus('test-ep-2', 'ready')
    expect(store.getEpisode('test-ep-2')?.status).toBe('ready')
  })

  it('returns undefined for unknown episode', () => {
    expect(store.getEpisode('not-a-real-id')).toBeUndefined()
  })

  it('sets and gets chunks', () => {
    const chunks: TranscriptChunk[] = [
      { id: 'c1', episodeId: 'ep-chunks', text: 'hello', startTime: 0, endTime: 10, chunkIndex: 0 },
    ]
    store.setChunks('ep-chunks', chunks)
    expect(store.getChunks('ep-chunks')).toHaveLength(1)
  })

  it('returns empty array for unknown episode chunks', () => {
    expect(store.getChunks('no-such-ep')).toEqual([])
  })

  it('accumulates messages per conversation', () => {
    const msg1: Message = {
      id: 'm1', conversationId: 'conv1', role: 'user',
      content: 'hello', createdAt: Date.now(),
    }
    const msg2: Message = {
      id: 'm2', conversationId: 'conv1', role: 'assistant',
      content: 'hi there', createdAt: Date.now(),
    }
    store.addMessage(msg1)
    store.addMessage(msg2)
    const msgs = store.getMessages('conv1')
    expect(msgs).toHaveLength(2)
    expect(msgs[0].role).toBe('user')
    expect(msgs[1].role).toBe('assistant')
  })
})
