import { NextRequest, NextResponse } from 'next/server'
import { store } from '@/lib/store'
import { Conversation } from '@/lib/types'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: NextRequest) {
  const { episodeId } = await req.json()
  if (!episodeId) {
    return NextResponse.json({ error: 'episodeId required' }, { status: 400 })
  }
  const conversation: Conversation = {
    id: uuidv4(),
    episodeId,
    createdAt: Date.now(),
  }
  store.setConversation(conversation)
  return NextResponse.json({ conversation })
}
