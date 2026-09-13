/**
 * Identité du site. Avec src/ui/theme.css, c'est le seul endroit
 * à toucher quand on part d'un nouveau site.
 */
export const site = {
  name: 'Maison Vertu',
  tagline: 'Rénovation à Lyon',
  description:
    'Rénovation complète menée par un seul interlocuteur. Devis ferme sous dix jours, chantier suivi chaque semaine.',
  domain: 'maison-vertu.fr',
  locale: 'fr-FR',

  email: {
    /** Expéditeur. Le domaine doit être vérifié chez Resend. */
    from: 'Maison Vertu <bonjour@maison-vertu.fr>',
    /** Destinataire des notifications internes. */
    notify: 'anthony.camilleri@protonmail.com',
  },

  /** Navigation principale. Trois entrées maximum, sinon l'écran se charge. */
  nav: [
    { href: '/design', label: 'Socle' },
    { href: '/contact', label: 'Contact' },
  ],

  /** Mentions de pied de page. */
  legal: '12 quai Saint-Antoine, 69002 Lyon',

  /**
   * Couleurs des emails. Les clients mail ignorent les variables CSS,
   * donc ces valeurs sont figées et recopiées à la main depuis la DA.
   */
  emailBrand: {
    bg: '#fbfbfc',
    surface: '#ffffff',
    line: '#e2e4e9',
    ink: '#15171c',
    ink2: '#4b5058',
    ink3: '#7c828c',
    accent: '#254a75',
    accentInk: '#ffffff',
    radius: '0px',
  },
} as const

export const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
