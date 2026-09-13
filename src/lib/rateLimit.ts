/**
 * Limitation de débit par IP ou par compte.
 *
 * Le compteur vit dans la mémoire de l'instance : sur une plateforme sans
 * serveur, une salve répartie sur plusieurs instances passe donc plusieurs
 * fois le seuil. Ça ne remplace pas un pare-feu, mais ça transforme
 * « dix mille requêtes en une minute » en « quelques dizaines ».
 */
import { NextResponse, type NextRequest } from 'next/server'

type Window = { start: number; hits: number }

const counters = new Map<string, Window>()
const MAX_KEYS = 5000

export function ipOf(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    '0.0.0.0'
  )
}

export function tooManyHits(
  req: NextRequest,
  key: string,
  max: number,
  windowSec: number,
  identity?: string,
): boolean {
  const now = Date.now()
  const id = `${key}:${identity ?? ipOf(req)}`

  if (counters.size > MAX_KEYS) {
    for (const [k, v] of counters) if (now - v.start > windowSec * 1000) counters.delete(k)
    if (counters.size > MAX_KEYS) counters.clear()
  }

  const w = counters.get(id)
  if (!w || now - w.start > windowSec * 1000) {
    counters.set(id, { start: now, hits: 1 })
    return false
  }
  w.hits += 1
  return w.hits > max
}

/** La réponse à renvoyer telle quelle, ou null si l'appel peut passer. */
export function rejectIfTooMany(
  req: NextRequest,
  key: string,
  max: number,
  windowSec: number,
  identity?: string,
): NextResponse | null {
  if (!tooManyHits(req, key, max, windowSec, identity)) return null
  return NextResponse.json(
    { error: 'Trop de requêtes. Réessayez dans un instant.' },
    { status: 429, headers: { 'Retry-After': String(windowSec) } },
  )
}
