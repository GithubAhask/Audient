import { NextRequest, NextResponse } from 'next/server'
import { store } from '@/lib/store'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const chunks = store.getChunks(params.id)
  return NextResponse.json({ chunks })
}
