import type { MetadataRoute } from 'next'
import { serverURL } from '@/site.config'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/api/', '/compte'] }],
    sitemap: `${serverURL}/sitemap.xml`,
  }
}
