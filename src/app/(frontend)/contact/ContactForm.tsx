'use client'

import { useRef, useState } from 'react'
import { HONEYPOT } from '@/lib/antiSpam'
import { Alert, Button, Field, Input, Row, Stack, Textarea } from '@/ui'

export function ContactForm() {
  const startedAt = useRef(Date.now())
  const [state, setState] = useState<'idle' | 'busy' | 'sent'>('idle')
  const [error, setError] = useState<string | null>(null)

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setState('busy')
    setError(null)
    const form = new FormData(e.currentTarget)
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.get('name'),
        email: form.get('email'),
        phone: form.get('phone'),
        message: form.get('message'),
        [HONEYPOT]: form.get(HONEYPOT),
        startedAt: startedAt.current,
        source: window.location.pathname,
      }),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setError(data.error ?? 'L’envoi a échoué. Réessayez dans un instant.')
      setState('idle')
      return
    }
    setState('sent')
  }

  if (state === 'sent') {
    return (
      <Alert tone="ok" title="Message envoyé.">
        Vous recevez une copie par email. Nous revenons vers vous sous deux jours ouvrés.
      </Alert>
    )
  }

  return (
    <form onSubmit={submit}>
      <Stack gap="md">
        <Field label="Votre nom" htmlFor="name">
          <Input id="name" name="name" autoComplete="name" required />
        </Field>
        <Field label="Votre email" htmlFor="email">
          <Input id="email" name="email" type="email" autoComplete="email" required />
        </Field>
        <Field label="Téléphone" htmlFor="phone" hint="Facultatif.">
          <Input id="phone" name="phone" type="tel" autoComplete="tel" />
        </Field>
        <Field label="Votre message" htmlFor="message">
          <Textarea id="message" name="message" required minLength={10} />
        </Field>

        <div hidden aria-hidden="true">
          <Input id={HONEYPOT} name={HONEYPOT} tabIndex={-1} autoComplete="off" />
        </div>

        {error && <Alert tone="danger" title={error} />}

        <Row>
          <Button type="submit" disabled={state === 'busy'}>
            {state === 'busy' ? 'Envoi...' : 'Envoyer'}
          </Button>
        </Row>
      </Stack>
    </form>
  )
}
