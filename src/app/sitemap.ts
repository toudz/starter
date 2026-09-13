import type { MetadataRoute } from 'next'
import { serverURL } from '@/site.config'

/** Les pages publiques. À compléter quand le site en gagne. */
const PATHS = ['', '/contact']

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return PATHS.map((path) => ({
    url: `${serverURL}${path}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.7,
  }))
}
