import { site, serverURL } from '@/site.config'

/**
 * Données structurées. Injectées telles quelles dans un script, donc la
 * sérialisation échappe le caractère qui pourrait fermer la balise.
 */
export function jsonLdHtml(data: object): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

export function organization() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    url: serverURL,
    description: site.description,
  }
}

export function webSite() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.name,
    url: serverURL,
    inLanguage: site.locale,
  }
}
