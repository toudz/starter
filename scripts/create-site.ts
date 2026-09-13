/**
 * Crée un site complet : dépôt GitHub, base Neon, projet Vercel, domaine,
 * emails Resend, DNS, premier déploiement.
 *
 *   pnpm create-site <slug> <domaine>
 *   pnpm create-site atelier-ferrand atelier-ferrand.fr
 *
 * Jetons attendus dans l'environnement, une fois pour toutes :
 *   GITHUB_TOKEN      scope repo
 *   NEON_API_KEY      console.neon.tech, Account settings, API keys
 *   VERCEL_TOKEN      vercel.com/account/tokens
 *   VERCEL_TEAM_ID    facultatif, si le projet vit dans une équipe
 *   RESEND_API_KEY    resend.com, API keys
 *
 * Le script n'écrase jamais rien : si une ressource existe déjà, il le dit
 * et passe à la suivante.
 */
import { randomBytes } from 'node:crypto'

const TEMPLATE_OWNER = 'toudz'
const TEMPLATE_REPO = 'starter'
const OWNER = 'toudz'
const NEON_REGION = 'aws-eu-central-1'

const [slug, domain] = process.argv.slice(2)

if (!slug || !domain) {
  fail('usage : pnpm create-site <slug> <domaine>\nexemple : pnpm create-site atelier-ferrand atelier-ferrand.fr')
}
if (!/^[a-z0-9][a-z0-9-]*$/.test(slug)) fail(`slug invalide : ${slug}`)
if (!/^[a-z0-9.-]+\.[a-z]{2,}$/.test(domain)) fail(`domaine invalide : ${domain}`)

const TOKENS = {
  github: process.env.GITHUB_TOKEN,
  neon: process.env.NEON_API_KEY,
  vercel: process.env.VERCEL_TOKEN,
  resend: process.env.RESEND_API_KEY,
}
const missing = Object.entries(TOKENS)
  .filter(([, v]) => !v)
  .map(([k]) => k)
if (missing.length) fail(`jetons manquants : ${missing.join(', ')}`)

const TEAM = process.env.VERCEL_TEAM_ID ? `?teamId=${process.env.VERCEL_TEAM_ID}` : ''
const manual: string[] = []

function fail(msg: string): never {
  console.error(`\n  ${msg}\n`)
  process.exit(1)
}
function step(msg: string) {
  console.log(`  ${msg}`)
}
function secret() {
  return randomBytes(32).toString('hex')
}

async function api(url: string, init: RequestInit & { token: string }) {
  const { token, ...rest } = init
  const res = await fetch(url, {
    ...rest,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(rest.headers || {}),
    },
  })
  const text = await res.text()
  const body = text ? JSON.parse(text) : {}
  if (!res.ok) {
    const err = new Error(`${res.status} ${url}\n${text.slice(0, 400)}`)
    ;(err as Error & { status: number }).status = res.status
    throw err
  }
  return body
}

/* ── 1. Dépôt GitHub, à partir du modèle ─────────────────────────── */
async function createRepo() {
  try {
    await api(
      `https://api.github.com/repos/${TEMPLATE_OWNER}/${TEMPLATE_REPO}/generate`,
      {
        token: TOKENS.github!,
        method: 'POST',
        headers: { Accept: 'application/vnd.github+json' },
        body: JSON.stringify({
          owner: OWNER,
          name: slug,
          description: domain,
          private: true,
          include_all_branches: false,
        }),
      },
    )
    step(`dépôt github.com/${OWNER}/${slug} créé`)
  } catch (e) {
    if ((e as { status?: number }).status === 422) step(`dépôt ${OWNER}/${slug} déjà présent`)
    else throw e
  }
  return `${OWNER}/${slug}`
}

/* ── 2. Base Neon ────────────────────────────────────────────────── */
async function createDatabase(): Promise<string> {
  const existing = await api(`https://console.neon.tech/api/v2/projects`, {
    token: TOKENS.neon!,
  })
  const found = existing.projects?.find((p: { name: string }) => p.name === slug)
  if (found) {
    const conns = await api(
      `https://console.neon.tech/api/v2/projects/${found.id}/connection_uri?database_name=neondb&role_name=neondb_owner&pooled=true`,
      { token: TOKENS.neon! },
    )
    step(`base Neon « ${slug} » déjà présente`)
    return conns.uri
  }
  const created = await api(`https://console.neon.tech/api/v2/projects`, {
    token: TOKENS.neon!,
    method: 'POST',
    body: JSON.stringify({ project: { name: slug, region_id: NEON_REGION, pg_version: 17 } }),
  })
  step(`base Neon « ${slug} » créée`)
  const uri =
    created.connection_uris?.[0]?.connection_uri ??
    created.connection_uris?.[0]?.connection_parameters?.connection_uri
  if (!uri) fail('Neon n’a pas renvoyé d’URI de connexion')
  return uri
}

/* ── 3. Projet Vercel lié au dépôt ───────────────────────────────── */
async function createProject(repo: string) {
  try {
    const p = await api(`https://api.vercel.com/v10/projects${TEAM}`, {
      token: TOKENS.vercel!,
      method: 'POST',
      body: JSON.stringify({
        name: slug,
        framework: 'nextjs',
        gitRepository: { type: 'github', repo },
      }),
    })
    step(`projet Vercel « ${slug} » créé`)
    return p.id as string
  } catch (e) {
    if ((e as { status?: number }).status === 409) {
      const p = await api(`https://api.vercel.com/v9/projects/${slug}${TEAM}`, {
        token: TOKENS.vercel!,
      })
      step(`projet Vercel « ${slug} » déjà présent`)
      return p.id as string
    }
    throw e
  }
}

/* ── 4. Variables d'environnement ────────────────────────────────── */
async function setEnv(projectId: string, vars: Record<string, string>) {
  const payload = Object.entries(vars).map(([key, value]) => ({
    key,
    value,
    type: key.startsWith('NEXT_PUBLIC_') ? 'plain' : 'encrypted',
    target: ['production', 'preview', 'development'],
  }))
  const qs = new URLSearchParams({ upsert: 'true' })
  if (process.env.VERCEL_TEAM_ID) qs.set('teamId', process.env.VERCEL_TEAM_ID)
  await api(`https://api.vercel.com/v10/projects/${projectId}/env?${qs.toString()}`, {
    token: TOKENS.vercel!,
    method: 'POST',
    body: JSON.stringify(payload),
  })
  step(`${payload.length} variables posées sur le projet`)
}

/* ── 5. Domaine sur le projet ────────────────────────────────────── */
async function addDomain(projectId: string) {
  for (const name of [domain, `www.${domain}`]) {
    try {
      await api(`https://api.vercel.com/v10/projects/${projectId}/domains${TEAM}`, {
        token: TOKENS.vercel!,
        method: 'POST',
        body: JSON.stringify({ name }),
      })
      step(`domaine ${name} branché`)
    } catch (e) {
      if ((e as { status?: number }).status === 409) step(`domaine ${name} déjà branché`)
      else throw e
    }
  }
}

/* ── 6. Domaine d'envoi Resend, puis DNS chez Vercel ─────────────── */
async function setupEmail() {
  let records: { record: string; name: string; type: string; value: string; priority?: number }[] = []
  try {
    const d = await api('https://api.resend.com/domains', {
      token: TOKENS.resend!,
      method: 'POST',
      body: JSON.stringify({ name: domain, region: 'eu-west-1' }),
    })
    records = d.records || []
    step(`domaine d’envoi ${domain} déclaré chez Resend`)
  } catch {
    step(`domaine ${domain} déjà déclaré chez Resend, DNS à vérifier à la main`)
    manual.push(`Vérifier les enregistrements Resend sur resend.com/domains`)
    return
  }

  for (const r of records) {
    try {
      await api(`https://api.vercel.com/v2/domains/${domain}/records${TEAM}`, {
        token: TOKENS.vercel!,
        method: 'POST',
        body: JSON.stringify({
          name: r.name.replace(`.${domain}`, '').replace(domain, '') || '@',
          type: r.type,
          value: r.value,
          ...(r.priority ? { mxPriority: r.priority } : {}),
        }),
      })
    } catch {
      manual.push(`DNS à poser à la main : ${r.type} ${r.name} ${r.value}`)
    }
  }
  if (!manual.length) step(`${records.length} enregistrements DNS posés chez Vercel`)
}

/* ── 7. Stockage des médias ──────────────────────────────────────── */
async function createBlobStore(projectId: string) {
  try {
    const store = await api(`https://api.vercel.com/v1/storage/stores/blob${TEAM}`, {
      token: TOKENS.vercel!,
      method: 'POST',
      body: JSON.stringify({ name: slug }),
    })
    const storeId = store.store?.id ?? store.id
    await api(`https://api.vercel.com/v1/storage/stores/${storeId}/connections${TEAM}`, {
      token: TOKENS.vercel!,
      method: 'POST',
      body: JSON.stringify({ projectId, envVarEnvironments: ['production', 'preview', 'development'] }),
    })
    step('stockage Blob créé et relié au projet')
  } catch {
    manual.push(
      `Créer le store Blob : Vercel, projet ${slug}, onglet Storage, Create Blob store. ` +
        `BLOB_READ_WRITE_TOKEN sera injecté automatiquement.`,
    )
  }
}

/* ── 8. Déploiement ──────────────────────────────────────────────── */
async function deploy(repo: string) {
  await api(`https://api.vercel.com/v13/deployments${TEAM}`, {
    token: TOKENS.vercel!,
    method: 'POST',
    body: JSON.stringify({
      name: slug,
      target: 'production',
      gitSource: { type: 'github', repo: repo.split('/')[1], org: repo.split('/')[0], ref: 'main' },
    }),
  })
  step('déploiement lancé')
}

/* ── Enchaînement ────────────────────────────────────────────────── */
async function main() {
  console.log(`\n  ${slug} sur ${domain}\n`)

  const repo = await createRepo()
  const databaseUrl = await createDatabase()
  const projectId = await createProject(repo)

  await setEnv(projectId, {
    DATABASE_URL: databaseUrl,
    PAYLOAD_SECRET: secret(),
    CRON_SECRET: secret(),
    RESEND_API_KEY: TOKENS.resend!,
    NEXT_PUBLIC_SERVER_URL: `https://${domain}`,
  })

  await addDomain(projectId)
  await createBlobStore(projectId)
  await setupEmail()
  await deploy(repo)

  console.log(`\n  https://${domain}`)
  console.log(`  https://${domain}/admin`)
  console.log(`  https://github.com/${repo}\n`)

  console.log('  Il reste à faire, une fois le déploiement vert :')
  console.log(`    git clone https://github.com/${repo} && cd ${slug}`)
  console.log('    pnpm install && pnpm db:migrate')
  console.log('    pnpm tsx scripts/bootstrap-admin.ts <email>')
  console.log('    puis la DA dans src/ui/theme.css et src/site.config.ts')

  if (manual.length) {
    console.log('\n  À la main :')
    for (const m of manual) console.log(`    ${m}`)
  }
  console.log('')
}

main().catch((e) => fail(String(e)))
