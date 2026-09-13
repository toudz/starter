import type { Metadata } from 'next'
import { Page, Prose, Section, Stack } from '@/ui'
import { ConnexionForm } from './ConnexionForm'

export const metadata: Metadata = { title: 'Connexion' }

export default function Connexion() {
  return (
    <Page>
      <Section space="lg">
        <Prose>
          <Stack gap="lg">
            <h1 className="text-3xl">Connexion</h1>
            <p className="text-ink-2">
              Pas de mot de passe. Vous recevez un code à six chiffres par email.
            </p>
            <ConnexionForm />
          </Stack>
        </Prose>
      </Section>
    </Page>
  )
}
