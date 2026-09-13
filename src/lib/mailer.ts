/**
 * Envoi d'emails via Resend, avec une mise en page commune.
 *
 * Les clients mail ne comprennent ni les variables CSS ni les feuilles
 * externes : tout est en style en ligne, et les couleurs sont figées
 * dans site.config.
 */
import { Resend } from 'resend'
import { site } from '@/site.config'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export type Mail = {
  to: string
  subject: string
  html: string
  text?: string
  replyTo?: string
}

/** Renvoie false si l'envoi n'a pas pu se faire. N'explose jamais l'appelant. */
export async function send({ to, subject, html, text, replyTo }: Mail): Promise<boolean> {
  if (!resend) {
    console.warn('[mailer] RESEND_API_KEY absente, email non envoyé :', subject)
    return false
  }
  try {
    const { error } = await resend.emails.send({
      from: site.email.from,
      to,
      subject,
      html,
      text: text ?? stripTags(html),
      ...(replyTo ? { replyTo } : {}),
    })
    if (error) {
      console.error('[mailer]', error)
      return false
    }
    return true
  } catch (e) {
    console.error('[mailer]', e)
    return false
  }
}

function stripTags(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** Mise en page commune à tous les emails du site. */
export function layout({
  title,
  intro,
  body,
  cta,
}: {
  title: string
  intro?: string
  body?: string
  cta?: { label: string; href: string }
}): string {
  const b = site.emailBrand
  return `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:24px;background:${b.bg};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:${b.ink};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;margin:0 auto;background:${b.surface};border:1px solid ${b.line};border-radius:${b.radius};">
    <tr><td style="padding:32px;">
      <div style="font-size:13px;color:${b.ink3};letter-spacing:0.02em;">${escapeHtml(site.name)}</div>
      <h1 style="margin:16px 0 0;font-size:22px;line-height:1.25;font-weight:600;color:${b.ink};">${escapeHtml(title)}</h1>
      ${intro ? `<p style="margin:16px 0 0;font-size:15px;line-height:1.55;color:${b.ink2};">${escapeHtml(intro)}</p>` : ''}
      ${body ?? ''}
      ${
        cta
          ? `<div style="margin:24px 0 0;"><a href="${cta.href}" style="display:inline-block;background:${b.accent};color:${b.accentInk};text-decoration:none;font-weight:600;font-size:15px;padding:12px 24px;border-radius:${b.radius};">${escapeHtml(cta.label)}</a></div>`
          : ''
      }
    </td></tr>
  </table>
  <div style="max-width:520px;margin:16px auto 0;font-size:12px;color:${b.ink3};text-align:center;">
    ${escapeHtml(site.name)} · ${escapeHtml(site.domain)}
  </div>
</body></html>`
}

/** Bloc de code à six chiffres, lisible dans tous les clients mail. */
export function codeBlock(code: string): string {
  const b = site.emailBrand
  return `<div style="margin:24px 0 0;padding:16px;background:${b.bg};border:1px solid ${b.line};border-radius:${b.radius};text-align:center;font-size:30px;font-weight:600;letter-spacing:0.18em;color:${b.ink};font-family:ui-monospace,SFMono-Regular,Menlo,monospace;">${escapeHtml(code)}</div>`
}

/** Liste de paires libellé / valeur, pour les notifications internes. */
export function detailList(rows: [string, string][]): string {
  const b = site.emailBrand
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0 0;font-size:14px;">
    ${rows
      .map(
        ([k, v]) =>
          `<tr><td style="padding:8px 0;border-bottom:1px solid ${b.line};color:${b.ink3};width:40%;vertical-align:top;">${escapeHtml(k)}</td><td style="padding:8px 0;border-bottom:1px solid ${b.line};color:${b.ink};">${escapeHtml(v)}</td></tr>`,
      )
      .join('')}
  </table>`
}
