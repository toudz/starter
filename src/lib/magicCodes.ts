/**
 * Codes de connexion à six chiffres, à usage unique.
 *
 * Le code sort de crypto.randomInt, pas de Math.random : 900 000 possibilités
 * imprévisibles. Il est détruit à la PREMIÈRE tentative, même fausse, donc une
 * seule chance par code. Il expire au bout de dix minutes.
 */
import crypto from 'node:crypto'
import { getPayload } from 'payload'
import config from '@payload-config'

const TTL_MS = 10 * 60 * 1000

export function generateCode(): string {
  return String(crypto.randomInt(100000, 1000000))
}

const db = async () => getPayload({ config })

/** Empêche de bombarder la boîte mail de quelqu'un en martelant la route. */
export async function wasRequestedRecently(email: string, windowSec = 45): Promise<boolean> {
  const payload = await db()
  const found = await payload.find({
    collection: 'magic-codes',
    where: { email: { equals: email.toLowerCase() } },
    limit: 1,
    overrideAccess: true,
  })
  const doc = found.docs[0]
  if (!doc?.createdAt) return false
  return Date.now() - new Date(doc.createdAt).getTime() < windowSec * 1000
}

export async function storeCode(email: string, code: string): Promise<void> {
  const payload = await db()
  const lower = email.toLowerCase()
  await payload.delete({
    collection: 'magic-codes',
    where: { email: { equals: lower } },
    overrideAccess: true,
  })
  await payload.create({
    collection: 'magic-codes',
    data: { email: lower, code, expiresAt: new Date(Date.now() + TTL_MS).toISOString() },
    overrideAccess: true,
  })
}

export async function verifyAndConsume(email: string, code: string): Promise<boolean> {
  const payload = await db()
  const lower = email.toLowerCase()
  const found = await payload.find({
    collection: 'magic-codes',
    where: { email: { equals: lower } },
    limit: 1,
    overrideAccess: true,
  })
  const doc = found.docs[0]
  if (!doc) return false

  // Détruit avant de comparer : une tentative, une seule.
  await payload.delete({ collection: 'magic-codes', id: doc.id, overrideAccess: true })

  if (new Date(String(doc.expiresAt)).getTime() < Date.now()) return false

  const stored = Buffer.from(String(doc.code))
  const given = Buffer.from(code)
  if (stored.length !== given.length) return false
  return crypto.timingSafeEqual(stored, given)
}

/** Le rôle du compte, et le compte créé au premier passage s'il n'existe pas. */
export async function roleForEmail(email: string): Promise<string | null> {
  const payload = await db()
  const lower = email.toLowerCase()
  const found = await payload.find({
    collection: 'users',
    where: { email: { equals: lower } },
    limit: 1,
    overrideAccess: true,
  })
  if (found.docs[0]) return (found.docs[0].role as string) ?? null

  await payload.create({
    collection: 'users',
    data: { email: lower, password: crypto.randomBytes(24).toString('base64url'), role: 'client' },
    overrideAccess: true,
  })
  return 'client'
}
