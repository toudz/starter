import { NextResponse, type NextRequest } from 'next/server'
import { getSession } from '@/lib/session'

export async function GET(req: NextRequest) {
  return NextResponse.json({ session: getSession(req) })
}

export const dynamic = 'force-dynamic'
