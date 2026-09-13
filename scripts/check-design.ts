/**
 * Garde-fou du socle. Casse le build à la première entorse.
 *
 * Ne vérifie QUE les pages et composants de site (src/app/(frontend), src/components).
 * src/ui est le socle : il a le droit d'écrire ce que les pages n'ont pas le droit d'écrire.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOT = process.cwd()
const SCAN = ['src/app/(frontend)', 'src/components']
const ALLOWED_SPACE = new Set(['0', '1', '2', '3', '4', '6', '8', '12', '16', '24'])

type Finding = { file: string; line: number; rule: string; found: string; fix: string }

const SPACE_PREFIX = [
  'gap-x', 'gap-y', 'space-x', 'space-y', 'gap',
  'px', 'py', 'pt', 'pr', 'pb', 'pl', 'ps', 'pe', 'p',
  'mx', 'my', 'mt', 'mr', 'mb', 'ml', 'ms', 'me', 'm',
].join('|')

const RULES: {
  name: string
  re: RegExp
  fix: string
  skip?: (m: RegExpExecArray) => boolean
}[] = [
  {
    name: 'valeur arbitraire interdite',
    re: /\b[a-z][a-z0-9-]*-\[[^\]\n]+\]/g,
    fix: 'utiliser un jeton de l’échelle, ou ajouter le besoin au socle dans src/ui',
  },
  {
    name: 'couleur en dur interdite',
    re: /#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(/g,
    fix: 'utiliser un jeton : text-ink, bg-surface, border-line, bg-accent',
  },
  {
    name: 'point de rupture interdit dans une page',
    re: /\b(sm|md|lg|xl|2xl):[a-z]/g,
    fix: 'le responsive vit dans les primitives : <Grid>, <Row>, <Section>',
  },
  {
    name: 'style en ligne interdit',
    re: /style=\{\{/g,
    fix: 'passer par une primitive ou un composant du socle',
  },
  {
    name: 'élément brut interdit',
    re: /<(button|input|select|textarea)\b/g,
    fix: 'utiliser <Button>, <Input>, <Select> depuis @/ui',
  },
  {
    name: 'taille de texte hors échelle',
    re: /\btext-(5xl|6xl|7xl|8xl|9xl)\b/g,
    fix: 'l’échelle s’arrête à text-4xl',
  },
  {
    name: 'espacement hors échelle',
    re: new RegExp(`\\b-?(${SPACE_PREFIX})-(\\d+)\\b`, 'g'),
    fix: 'valeurs autorisées : 1 2 3 4 6 8 12 16 24',
    skip: (m) => ALLOWED_SPACE.has(m[2]),
  },
]

function walk(dir: string, out: string[] = []): string[] {
  let entries: string[]
  try {
    entries = readdirSync(dir)
  } catch {
    return out
  }
  for (const name of entries) {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) walk(full, out)
    else if (/\.(tsx|ts)$/.test(name)) out.push(full)
  }
  return out
}

const findings: Finding[] = []

for (const base of SCAN) {
  for (const file of walk(join(ROOT, base))) {
    const lines = readFileSync(file, 'utf8').split('\n')
    lines.forEach((line, i) => {
      if (line.trimStart().startsWith('//') || line.trimStart().startsWith('*')) return
      for (const rule of RULES) {
        rule.re.lastIndex = 0
        let m: RegExpExecArray | null
        while ((m = rule.re.exec(line))) {
          if (rule.skip?.(m)) continue
          findings.push({
            file: relative(ROOT, file),
            line: i + 1,
            rule: rule.name,
            found: m[0],
            fix: rule.fix,
          })
        }
      }
    })
  }
}

if (findings.length === 0) {
  console.log('check:design  aucune entorse')
  process.exit(0)
}

console.log('')
for (const f of findings) {
  console.log(`  x ${f.file}:${f.line}`)
  console.log(`    ${f.rule} : ${f.found}`)
  console.log(`    ${f.fix}`)
  console.log('')
}
console.log(`${findings.length} erreur(s), build interrompu`)
process.exit(1)
