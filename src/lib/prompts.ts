import { TranscriptChunk } from './types'

export function formatTimestamp(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function buildSystemPrompt(
  chunks: TranscriptChunk[],
  currentTimestamp?: number
): string {
  const contextBlock = chunks
    .map(c => `[${formatTimestamp(c.startTime)}] ${c.text}`)
    .join('\n\n')

  const positionNote =
    currentTimestamp !== undefined
      ? `The listener is currently at ${formatTimestamp(currentTimestamp)} in the episode. Do not reveal content that occurs after this point unless the user explicitly asks.`
      : `The listener hasn't set a position. You may reference any part of the episode.`

  return `You are Audient, an AI assistant that answers questions about podcast episodes.
You have access to relevant excerpts from the episode transcript below.

Rules:
- Ground every factual claim in the transcript. Cite timestamps like [12:34].
- If the transcript doesn't contain the answer, say clearly: "This episode doesn't cover that topic in the sections I can see."
- Be concise. Prefer direct answers over lengthy summaries.
- Do not make up facts not present in the transcript.
- ${positionNote}

Episode transcript excerpts:
${contextBlock}`
}
