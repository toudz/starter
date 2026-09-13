import { NextResponse, type NextRequest } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { clean, isEmail, spamReason } from '@/lib/antiSpam'
import { detailList, layout, send } from '@/lib/mailer'
import { rejectIfTooMany } from '@/lib/rateLimit'
import { site } from '@/site.config'

export async function POST(req: NextRequest) {
  const limited = rejectIfTooMany(req, 'contact', 5, 600)
  if (limited) return limited

  const body = await req.json().catch(() => ({}))

  const spam = spamReason(body)
  if (spam) {
    // Réponse identique à un envoi réussi : un robot ne doit rien apprendre.
    console.warn('[contact] refusé :', spam)
    return NextResponse.json({ ok: true })
  }

  const name = clean(body.name, 120)
  const email = clean(body.email, 200).toLowerCase()
  const phone = clean(body.phone, 40)
  const message = clean(body.message, 4000)

  if (!name || !isEmail(email) || message.length < 10) {
    return NextResponse.json(
      { error: 'Nom, adresse valide et message d’au moins dix caractères.' },
      { status: 400 },
    )
  }

  const payload = await getPayload({ config })
  await payload.create({
    collection: 'leads',
    data: { name, email, phone, message, status: 'nouveau', source: clean(body.source, 200) },
    overrideAccess: true,
  })

  await send({
    to: site.email.notify,
    replyTo: email,
    subject: `Nouveau message de ${name}`,
    html: layout({
      title: 'Nouveau message',
      body: detailList([
        ['Nom', name],
        ['Email', email],
        ['Téléphone', phone || 'non renseigné'],
        ['Message', message],
      ]),
    }),
  })

  await send({
    to: email,
    subject: `Votre message est bien arrivé`,
    html: layout({
      title: 'Votre message est bien arrivé',
      intro: `Merci ${name}. Nous revenons vers vous sous deux jours ouvrés.`,
      body: detailList([['Votre message', message]]),
    }),
  })

  return NextResponse.json({ ok: true })
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
