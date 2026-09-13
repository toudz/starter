/**
 * Filtres anti robot pour les formulaires publics.
 *
 * Deux signaux, aucun captcha : un champ piège invisible qu'un humain ne
 * remplit jamais, et le temps passé sur le formulaire. Un robot poste en
 * moins d'une seconde.
 */
export const HONEYPOT = 'website'
const MIN_FILL_MS = 1500

export type FormGuard = { [HONEYPOT]?: string; startedAt?: number }

/** Renvoie la raison du refus, ou null si le formulaire semble humain. */
export function spamReason(body: FormGuard): string | null {
  if (body[HONEYPOT]) return 'champ piège rempli'
  if (typeof body.startedAt === 'number' && Date.now() - body.startedAt < MIN_FILL_MS) {
    return 'formulaire posté trop vite'
  }
  return null
}

export function isEmail(value: unknown): value is string {
  return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(value.trim())
}

/** Coupe et borne une chaîne venue du client. Toujours l'utiliser avant d'écrire en base. */
export function clean(value: unknown, max = 2000): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}
