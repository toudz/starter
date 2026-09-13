'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/ui'

export function LogoutButton() {
  const router = useRouter()
  const [busy, setBusy] = useState(false)

  async function logout() {
    setBusy(true)
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
    router.refresh()
  }

  return (
    <Button variant="secondary" onClick={logout} disabled={busy}>
      {busy ? 'Déconnexion...' : 'Se déconnecter'}
    </Button>
  )
}
