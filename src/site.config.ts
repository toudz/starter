/**
 * Identité du site. Avec src/ui/theme.css, c'est le seul endroit
 * à toucher quand on part d'un nouveau site.
 */
export const site = {
  name: 'Maison Vertu',
  tagline: 'Rénovation à Lyon',
  domain: 'maison-vertu.fr',
  locale: 'fr-FR',
  email: {
    from: 'Maison Vertu <bonjour@maison-vertu.fr>',
    notify: 'anthony.camilleri@protonmail.com',
  },
} as const

export const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
