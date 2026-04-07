import { NextRequest, NextResponse } from 'next/server'
import { store } from '@/lib/store'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const episode = store.getEpisode(params.id)
  if (!episode) {
    return NextResponse.json({ error: 'Episode not found' }, { status: 404 })
  }
  return NextResponse.json({ episode })
}
