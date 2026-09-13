/**
 * Sessions signées en cookie httpOnly. La seule source d'identité côté serveur.
 *
 * Le client ne peut ni lire le jeton (httpOnly) ni le forger (il n'a pas la
 * clé). Aucune route ne doit jamais croire un email envoyé par le client.
 */
import crypto from 'node:crypto'
import type { NextRequest } from 'next/server'

export const SESSION_COOKIE = 'session'
const MAX_AGE = 60 * 60 * 24 * 30

export type Session = { email: string; role: string | null }

const secret = () => process.env.PAYLOAD_SECRET || ''

const b64url = (buf: Buffer) => buf.toString('base64url')
const fromB64url = (s: string) => Buffer.from(s, 'base64url')
const sign = (data: string) => b64url(crypto.createHmac('sha256', secret()).update(data).digest())

export function createSessionToken(session: Session): string {
  const payload = { e: session.email, r: session.role ?? null, exp: Date.now() + MAX_AGE * 1000 }
  const body = b64url(Buffer.from(JSON.stringify(payload)))
  return `${body}.${sign(body)}`
}

export function verifySessionToken(token: string | undefined | null): Session | null {
  if (!token || !secret()) return null
  const dot = token.indexOf('.')
  if (dot < 1) return null
  const body = token.slice(0, dot)
  const a = Buffer.from(token.slice(dot + 1))
  const b = Buffer.from(sign(body))
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null
  try {
    const payload = JSON.parse(fromB64url(body).toString('utf8'))
    if (typeof payload.exp !== 'number' || payload.exp < Date.now()) return null
    if (typeof payload.e !== 'string' || !payload.e) return null
    return { email: payload.e.toLowerCase(), role: payload.r ?? null }
  } catch {
    return null
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: MAX_AGE,
}

export function getSession(req: NextRequest): Session | null {
  return verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value)
}

export const isAdmin = (s: Session | null) => s?.role === 'admin'
