import type { Metadata } from 'next'
import { Schibsted_Grotesk } from 'next/font/google'
import { site, serverURL } from '@/site.config'
import '@/ui/styles.css'

/*
 * Les deux fontes de la DA. Rôle display puis rôle texte.
 * C'est la seule ligne à changer, avec theme.css, pour un nouveau site.
 */
const display = Schibsted_Grotesk({ subsets: ['latin'], variable: '--font-a', display: 'swap' })
const body = Schibsted_Grotesk({ subsets: ['latin'], variable: '--font-b', display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL(serverURL),
  title: { default: `${site.name}, ${site.tagline}`, template: `%s · ${site.name}` },
  description: site.tagline,
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  )
}
