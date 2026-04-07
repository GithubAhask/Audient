import { TranscriptChunk } from './types'

const VOYAGE_API_URL = 'https://api.voyageai.com/v1/embeddings'
const EMBEDDING_MODEL = 'voyage-3-lite'  // 512 dims, fast + cheap. Upgrade to voyage-3 for higher quality.
const BATCH_SIZE = 128

async function voyageEmbed(inputs: string[]): Promise<number[][]> {
  const res = await fetch(VOYAGE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.VOYAGE_API_KEY}`,
    },
    body: JSON.stringify({ input: inputs, model: EMBEDDING_MODEL }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Voyage AI embedding error (${res.status}): ${err}`)
  }

  const data = await res.json()
  return data.data.map((item: { embedding: number[] }) => item.embedding)
}

export async function embedChunks(chunks: TranscriptChunk[]): Promise<TranscriptChunk[]> {
  const results: TranscriptChunk[] = []
  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE)
    const embeddings = await voyageEmbed(batch.map(c => c.text))
    const embedded = batch.map((chunk, idx) => ({
      ...chunk,
      embedding: embeddings[idx],
    }))
    results.push(...embedded)
  }
  return results
}

export async function embedQuery(query: string): Promise<number[]> {
  const embeddings = await voyageEmbed([query])
  return embeddings[0]
}
