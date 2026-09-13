import { ImageResponse } from 'next/og'
import { site } from '@/site.config'

export const alt = site.name
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/** Image de partage. Les couleurs sont figées : next/og ne lit pas le CSS du site. */
export default async function OpengraphImage() {
  const b = site.emailBrand
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: b.surface,
          color: b.ink,
          padding: 80,
        }}
      >
        <div style={{ fontSize: 30, color: b.ink3 }}>{site.domain}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ fontSize: 76, fontWeight: 600, letterSpacing: -2 }}>{site.name}</div>
          <div style={{ fontSize: 36, color: b.ink2 }}>{site.tagline}</div>
        </div>
        <div style={{ height: 10, width: 200, background: b.accent }} />
      </div>
    ),
    size,
  )
}
