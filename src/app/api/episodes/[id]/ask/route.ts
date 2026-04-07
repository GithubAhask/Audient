import { NextRequest, NextResponse } from 'next/server'
import { store } from '@/lib/store'
import { retrieveRelevantChunks } from '@/lib/retrieval'
import { buildSystemPrompt } from '@/lib/prompts'
import { generateAnswer } from '@/lib/claude'
import { AskRequest, AskResponse } from '@/lib/types'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const episode = store.getEpisode(params.id)
    if (!episode) {
      return NextResponse.json({ error: 'SESSION_EXPIRED' }, { status: 400 })
    }
    if (episode.status !== 'ready') {
      return NextResponse.json({ error: `Episode is still processing (status: ${episode.status})` }, { status: 400 })
    }

    const body: AskRequest = await req.json()
    const { question, currentTimestamp, conversationHistory = [] } = body

    if (!question?.trim()) {
      return NextResponse.json({ error: 'question is required' }, { status: 400 })
    }

    const relevantChunks = await retrieveRelevantChunks(
      params.id,
      question,
      currentTimestamp,
      5
    )

    const systemPrompt = buildSystemPrompt(relevantChunks, currentTimestamp)
    const answer = await generateAnswer(systemPrompt, conversationHistory, question)

    const response: AskResponse = {
      answer,
      citedChunks: relevantChunks.map(c => ({
        id: c.id,
        startTime: c.startTime,
        endTime: c.endTime,
        text: c.text,
      })),
    }

    return NextResponse.json(response)
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
