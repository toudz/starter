# Starter de site

Modèle GitHub pour lancer un nouveau site en quelques minutes.

Next 15, Payload 3, Postgres Neon, Tailwind v4, Vercel Blob, Resend.

## Démarrer

```bash
pnpm install
cp .env.example .env     # remplir DATABASE_URL et PAYLOAD_SECRET
pnpm db:migrate
pnpm dev
```

`http://localhost:3000` pour le site, `/design` pour le socle, `/admin` pour Payload.

## Adapter à un nouveau site

Deux fichiers, rien d'autre :

1. `src/ui/theme.css` : la direction artistique. Copier une des trois de `src/ui/themes/`,
   ou en écrire une. Onze couleurs, deux fontes, trois rayons.
2. `src/site.config.ts` : nom, domaine, emails.

Puis les deux fontes dans `src/app/(frontend)/layout.tsx`.

## Le garde-fou

`pnpm check:design` refuse dans les pages toute valeur arbitraire, couleur en dur,
point de rupture, style en ligne, élément brut et espacement hors échelle.
Il tourne avant chaque build. Voir `CLAUDE.md` pour la liste complète.
