import type { Metadata } from 'next'
import { Schibsted_Grotesk } from 'next/font/google'
import { jsonLdHtml, organization, webSite } from '@/lib/jsonLd'
import { serverURL, site } from '@/site.config'
import { SiteFooter, SiteHeader } from '@/ui'
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
  description: site.description,
  openGraph: {
    type: 'website',
    locale: site.locale,
    siteName: site.name,
    url: serverURL,
  },
  alternates: { canonical: serverURL },
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${display.variable} ${body.variable}`}>
      <body className="flex min-h-screen flex-col">
        <SiteHeader action={{ href: '/contact', label: 'Nous écrire' }} />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdHtml([organization(), webSite()]) }}
        />
      </body>
    </html>
  )
}
