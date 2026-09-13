import type { Metadata } from 'next'
import { Page, Prose, Section, Stack } from '@/ui'
import { ContactForm } from './ContactForm'

export const metadata: Metadata = { title: 'Contact' }

export default function Contact() {
  return (
    <Page>
      <Section space="lg">
        <Prose>
          <Stack gap="lg">
            <h1 className="text-3xl">Nous écrire</h1>
            <p className="text-ink-2">Réponse sous deux jours ouvrés.</p>
            <ContactForm />
          </Stack>
        </Prose>
      </Section>
    </Page>
  )
}
