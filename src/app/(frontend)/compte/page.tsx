import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { SESSION_COOKIE, verifySessionToken } from '@/lib/session'
import { Badge, Card, Page, Row, Section, Stack } from '@/ui'
import { LogoutButton } from './LogoutButton'

export const metadata: Metadata = { title: 'Mon compte' }
export const dynamic = 'force-dynamic'

export default async function Compte() {
  const store = await cookies()
  const session = verifySessionToken(store.get(SESSION_COOKIE)?.value)
  if (!session) redirect('/connexion')

  return (
    <Page>
      <Section space="lg">
        <Stack gap="lg">
          <h1 className="text-3xl">Mon compte</h1>
          <Card>
            <Stack gap="sm">
              <Row gap="sm">
                <span className="text-sm text-ink-3">Connecté en tant que</span>
                <Badge tone="accent">{session.role ?? 'visiteur'}</Badge>
              </Row>
              <p className="text-lg">{session.email}</p>
            </Stack>
          </Card>
          <Row>
            <LogoutButton />
          </Row>
        </Stack>
      </Section>
    </Page>
  )
}
