import { NextResponse, type NextRequest } from 'next/server'
import { isEmail } from '@/lib/antiSpam'
import { roleForEmail, verifyAndConsume } from '@/lib/magicCodes'
import { rejectIfTooMany } from '@/lib/rateLimit'
import { SESSION_COOKIE, createSessionToken, sessionCookieOptions } from '@/lib/session'

export async function POST(req: NextRequest) {
  const limited = rejectIfTooMany(req, 'auth-verify', 12, 600)
  if (limited) return limited

  const body = await req.json().catch(() => ({}))
  const email = String(body.email ?? '').trim().toLowerCase()
  const code = String(body.code ?? '').trim()

  if (!isEmail(email) || !/^\d{6}$/.test(code)) {
    return NextResponse.json({ error: 'Code incorrect ou expiré.' }, { status: 400 })
  }
  if (!(await verifyAndConsume(email, code))) {
    return NextResponse.json({ error: 'Code incorrect ou expiré.' }, { status: 400 })
  }

  const role = await roleForEmail(email)
  const res = NextResponse.json({ ok: true, email, role })
  res.cookies.set(SESSION_COOKIE, createSessionToken({ email, role }), sessionCookieOptions)
  return res
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
