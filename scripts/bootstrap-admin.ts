/**
 * Crée le premier compte admin.
 *
 *   pnpm tsx scripts/bootstrap-admin.ts anthony@exemple.fr
 *
 * Le mot de passe est tiré au hasard et affiché une seule fois.
 * DATABASE_URL et PAYLOAD_SECRET doivent être présents dans l'environnement.
 */
import { randomBytes } from 'node:crypto'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const email = process.argv[2]
if (!email) {
  console.error('\n  usage : pnpm tsx scripts/bootstrap-admin.ts <email>\n')
  process.exit(1)
}

const password = randomBytes(12).toString('base64url')

const payload = await getPayload({ config })

const existing = await payload.find({
  collection: 'users',
  where: { email: { equals: email } },
  limit: 1,
})

if (existing.docs.length) {
  console.log(`\n  ${email} existe déjà, rien à faire\n`)
  process.exit(0)
}

await payload.create({
  collection: 'users',
  data: { email, password, role: 'admin', name: 'Admin' },
})

console.log(`\n  compte admin créé`)
console.log(`  email    ${email}`)
console.log(`  mot de passe  ${password}`)
console.log(`\n  À changer à la première connexion sur /admin\n`)
process.exit(0)
