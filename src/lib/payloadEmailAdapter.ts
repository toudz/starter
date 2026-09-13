import type { EmailAdapter, SendEmailOptions } from 'payload'
import { send } from './mailer'
import { site } from '@/site.config'

/**
 * Branche l'auth Payload (mot de passe oublié, vérification de compte) sur
 * notre transport. Sans cet adaptateur, Payload se contente d'écrire l'email
 * dans les logs sans jamais l'envoyer.
 */
type Address = { address: string; name?: string }

function recipients(to: SendEmailOptions['to']): string {
  if (!to) return ''
  const one = (e: string | Address) => (typeof e === 'string' ? e : e.address)
  return Array.isArray(to) ? to.map(one).join(', ') : one(to as string | Address)
}

export const emailAdapter: EmailAdapter = () => ({
  name: 'site-mailer',
  defaultFromAddress: site.email.from.replace(/^.*</, '').replace(/>$/, ''),
  defaultFromName: site.name,
  sendEmail: async (message: SendEmailOptions) => {
    await send({
      to: recipients(message.to),
      subject: message.subject ?? '',
      html: typeof message.html === 'string' ? message.html : '',
      text: typeof message.text === 'string' ? message.text : undefined,
    })
  },
})
