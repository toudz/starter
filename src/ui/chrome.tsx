import Link from 'next/link'
import { site } from '@/site.config'
import { ButtonLink } from './button'
import { Page, Row } from './primitives'

/** En tête du site. Une seule action principale, jamais deux. */
export function SiteHeader({ action }: { action?: { href: string; label: string } }) {
  return (
    <header className="border-b border-line">
      <Page>
        <Row gap="md" className="py-4">
          <Link href="/" className="mr-auto font-display text-base font-semibold text-ink">
            {site.name}
          </Link>
          {site.nav.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-ink-2 hover:text-ink">
              {item.label}
            </Link>
          ))}
          {action && (
            <ButtonLink href={action.href} size="sm">
              {action.label}
            </ButtonLink>
          )}
        </Row>
      </Page>
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line">
      <Page>
        <Row gap="md" className="py-6">
          <span className="mr-auto text-xs text-ink-3">
            {site.name} · {site.legal}
          </span>
          <Link href="/connexion" className="text-xs text-ink-3 hover:text-ink">
            Connexion
          </Link>
        </Row>
      </Page>
    </footer>
  )
}
