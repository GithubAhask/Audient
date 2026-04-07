import { Episode, TranscriptChunk, Conversation, Message } from './types'

// Attach Maps to globalThis so they survive Next.js hot module reloads in dev
const g = globalThis as Record<string, unknown>
if (!g.__audientEpisodes) g.__audientEpisodes = new Map<string, Episode>()
if (!g.__audientChunks) g.__audientChunks = new Map<string, TranscriptChunk[]>()
if (!g.__audientConversations) g.__audientConversations = new Map<string, Conversation>()
if (!g.__audientMessages) g.__audientMessages = new Map<string, Message[]>()

const episodes = g.__audientEpisodes as Map<string, Episode>
const chunks = g.__audientChunks as Map<string, TranscriptChunk[]>
const conversations = g.__audientConversations as Map<string, Conversation>
const messages = g.__audientMessages as Map<string, Message[]>

export const store = {
  setEpisode: (episode: Episode) => episodes.set(episode.id, episode),
  getEpisode: (id: string) => episodes.get(id),
  updateEpisodeStatus: (id: string, status: Episode['status'], errorMessage?: string) => {
    const ep = episodes.get(id)
    if (ep) episodes.set(id, { ...ep, status, errorMessage })
  },
  setChunks: (episodeId: string, c: TranscriptChunk[]) => chunks.set(episodeId, c),
  getChunks: (episodeId: string) => chunks.get(episodeId) ?? [],
  setConversation: (conv: Conversation) => conversations.set(conv.id, conv),
  getConversation: (id: string) => conversations.get(id),
  addMessage: (msg: Message) => {
    const existing = messages.get(msg.conversationId) ?? []
    messages.set(msg.conversationId, [...existing, msg])
  },
  getMessages: (conversationId: string) => messages.get(conversationId) ?? [],
}
