import type { CollectionConfig } from 'payload'

/** Demandes venues des formulaires publics. Écriture serveur uniquement. */
export const Leads: CollectionConfig = {
  slug: 'leads',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'status', 'createdAt'],
    group: 'Contacts',
  },
  access: {
    read: ({ req }) => req.user?.role === 'admin',
    create: () => false,
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true, index: true },
    { name: 'phone', type: 'text' },
    { name: 'message', type: 'textarea', required: true },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'nouveau',
      options: [
        { label: 'Nouveau', value: 'nouveau' },
        { label: 'Contacté', value: 'contacte' },
        { label: 'Gagné', value: 'gagne' },
        { label: 'Perdu', value: 'perdu' },
      ],
    },
    { name: 'source', type: 'text', admin: { description: 'Page d’origine.' } },
  ],
}
