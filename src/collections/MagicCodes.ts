import type { CollectionConfig } from 'payload'

/** Codes de connexion à usage unique. Jamais lisibles depuis l'API. */
export const MagicCodes: CollectionConfig = {
  slug: 'magic-codes',
  admin: { hidden: true },
  access: { read: () => false, create: () => false, update: () => false, delete: () => false },
  fields: [
    { name: 'email', type: 'email', required: true, index: true },
    { name: 'code', type: 'text', required: true },
    { name: 'expiresAt', type: 'date', required: true },
  ],
}
