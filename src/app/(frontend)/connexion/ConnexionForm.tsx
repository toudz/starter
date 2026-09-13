'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Alert, Button, Field, Input, Row, Stack } from '@/ui'

export function ConnexionForm() {
  const router = useRouter()
  const [step, setStep] = useState<'email' | 'code'>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function requestCode(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    const res = await fetch('/api/auth/request-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    setBusy(false)
    if (!res.ok) {
      setError('Adresse invalide.')
      return
    }
    setStep('code')
  }

  async function verify(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    const res = await fetch('/api/auth/verify-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code }),
    })
    setBusy(false)
    if (!res.ok) {
      setError('Code incorrect ou expiré.')
      return
    }
    router.push('/compte')
    router.refresh()
  }

  if (step === 'email') {
    return (
      <form onSubmit={requestCode}>
        <Stack gap="md">
          <Field label="Votre adresse email" htmlFor="email">
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@exemple.fr"
            />
          </Field>
          {error && <Alert tone="danger" title={error} />}
          <Row>
            <Button type="submit" disabled={busy}>
              {busy ? 'Envoi...' : 'Recevoir un code'}
            </Button>
          </Row>
        </Stack>
      </form>
    )
  }

  return (
    <form onSubmit={verify}>
      <Stack gap="md">
        <Field
          label="Code reçu par email"
          htmlFor="code"
          hint={`Envoyé à ${email}. Valable dix minutes.`}
        >
          <Input
            id="code"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            required
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            placeholder="123456"
          />
        </Field>
        {error && <Alert tone="danger" title={error} />}
        <Row>
          <Button type="submit" disabled={busy || code.length !== 6}>
            {busy ? 'Vérification...' : 'Se connecter'}
          </Button>
          <Button variant="ghost" onClick={() => setStep('email')}>
            Changer d&apos;adresse
          </Button>
        </Row>
      </Stack>
    </form>
  )
}
