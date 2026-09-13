import { NextResponse, type NextRequest } from 'next/server'
import { isEmail } from '@/lib/antiSpam'
import { generateCode, storeCode, wasRequestedRecently } from '@/lib/magicCodes'
import { codeBlock, layout, send } from '@/lib/mailer'
import { rejectIfTooMany } from '@/lib/rateLimit'

export async function POST(req: NextRequest) {
  const limited = rejectIfTooMany(req, 'auth-request', 8, 600)
  if (limited) return limited

  const body = await req.json().catch(() => ({}))
  const email = String(body.email ?? '').trim().toLowerCase()
  if (!isEmail(email)) return NextResponse.json({ error: 'Adresse invalide.' }, { status: 400 })

  // Réponse identique quoi qu'il arrive : ne jamais révéler qui a un compte.
  const ok = NextResponse.json({ ok: true })

  if (await wasRequestedRecently(email)) return ok

  const code = generateCode()
  await storeCode(email, code)
  await send({
    to: email,
    subject: `Votre code de connexion : ${code}`,
    html: layout({
      title: 'Votre code de connexion',
      intro: `Ce code expire dans dix minutes. Il ne fonctionne qu'une fois.`,
      body: codeBlock(code),
    }),
  })
  if (process.env.NODE_ENV !== 'production') console.log(`[auth] code ${code} pour ${email}`)
  return ok
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
