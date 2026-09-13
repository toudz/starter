import type { Metadata } from 'next'
import {
  Alert,
  Badge,
  Button,
  Card,
  EmptyState,
  Field,
  Grid,
  Input,
  Page,
  Prose,
  Row,
  Section,
  Select,
  Stack,
  Table,
  Tabs,
  Td,
  Th,
} from '@/ui'

export const metadata: Metadata = { title: 'Socle' }

const SWATCHES = [
  { name: 'bg', cls: 'bg-bg' },
  { name: 'surface', cls: 'bg-surface' },
  { name: 'surface-2', cls: 'bg-surface-2' },
  { name: 'line', cls: 'bg-line' },
  { name: 'line-2', cls: 'bg-line-2' },
  { name: 'ink', cls: 'bg-ink' },
  { name: 'ink-2', cls: 'bg-ink-2' },
  { name: 'ink-3', cls: 'bg-ink-3' },
  { name: 'accent', cls: 'bg-accent' },
  { name: 'accent-soft', cls: 'bg-accent-soft' },
  { name: 'ok', cls: 'bg-ok' },
  { name: 'warn', cls: 'bg-warn' },
  { name: 'danger', cls: 'bg-danger' },
]

const TYPE = [
  { tag: 'text-4xl', cls: 'text-4xl font-display', label: 'Titre de page' },
  { tag: 'text-3xl', cls: 'text-3xl font-display', label: 'Titre de section' },
  { tag: 'text-2xl', cls: 'text-2xl font-display', label: 'Sous-section' },
  { tag: 'text-xl', cls: 'text-xl font-display', label: 'Titre de bloc' },
  { tag: 'text-lg', cls: 'text-lg', label: 'Texte mis en avant' },
  { tag: 'text-base', cls: 'text-base', label: 'Texte courant, la taille par défaut' },
  { tag: 'text-sm', cls: 'text-sm', label: 'Libellés, boutons, texte secondaire' },
  { tag: 'text-xs', cls: 'text-xs', label: 'Mentions et unités' },
]

const SPACE = [
  { tag: '1', cls: 'w-1', px: '4' },
  { tag: '2', cls: 'w-2', px: '8' },
  { tag: '3', cls: 'w-3', px: '12' },
  { tag: '4', cls: 'w-4', px: '16' },
  { tag: '6', cls: 'w-6', px: '24' },
  { tag: '8', cls: 'w-8', px: '32' },
  { tag: '12', cls: 'w-12', px: '48' },
  { tag: '16', cls: 'w-16', px: '64' },
  { tag: '24', cls: 'w-24', px: '96' },
]

export default function Design() {
  return (
    <Page>
      <Section space="lg">
        <Stack gap="md">
          <h1 className="text-3xl">Socle</h1>
          <Prose>
            <p className="text-lg text-ink-2">
              Tout ce qui existe. Une page assemble ces objets, elle n&apos;en dessine jamais de
              nouveaux.
            </p>
          </Prose>
        </Stack>
      </Section>

      <Section>
        <Stack gap="lg">
          <h2 className="text-2xl">Couleurs</h2>
          <Grid min="150px" gap="sm">
            {SWATCHES.map((s) => (
              <div key={s.name} className="overflow-hidden rounded-md border border-line">
                <div className={`h-12 ${s.cls}`} />
                <div className="border-t border-line px-3 py-2 text-xs text-ink-2">{s.name}</div>
              </div>
            ))}
          </Grid>
        </Stack>
      </Section>

      <Section>
        <Stack gap="lg">
          <h2 className="text-2xl">Typographie</h2>
          <Stack gap="xs">
            {TYPE.map((t) => (
              <Row key={t.tag} gap="md" align="baseline" className="border-b border-line py-3">
                <span className="w-16 text-xs text-ink-3">{t.tag}</span>
                <span className={t.cls}>{t.label}</span>
              </Row>
            ))}
          </Stack>
        </Stack>
      </Section>

      <Section>
        <Stack gap="lg">
          <h2 className="text-2xl">Espacement</h2>
          <Prose>
            <p className="text-sm text-ink-2">
              Neuf valeurs. Les autres crans de Tailwind sont refusés par <code>check:design</code>.
            </p>
          </Prose>
          <Stack gap="xs">
            {SPACE.map((s) => (
              <Row key={s.tag} gap="sm">
                <span className="w-8 text-xs text-ink-2">{s.tag}</span>
                <span className={`h-3 bg-accent ${s.cls}`} />
                <span className="text-xs tabular-nums text-ink-3">{s.px}</span>
              </Row>
            ))}
          </Stack>
        </Stack>
      </Section>

      <Section>
        <Stack gap="xl">
          <h2 className="text-2xl">Composants</h2>

          <Stack gap="sm">
            <h3 className="text-sm text-ink-3">Boutons</h3>
            <Row>
              <Button>Prendre rendez-vous</Button>
              <Button variant="secondary">Enregistrer</Button>
              <Button variant="ghost">Annuler</Button>
              <Button variant="danger">Supprimer</Button>
              <Button disabled>Indisponible</Button>
            </Row>
            <Row>
              <Button size="sm">Petit</Button>
              <Button size="md">Normal</Button>
              <Button size="lg">Grand</Button>
            </Row>
          </Stack>

          <Stack gap="sm">
            <h3 className="text-sm text-ink-3">Champs</h3>
            <Grid min="240px">
              <Field label="Adresse du chantier" htmlFor="d-adresse" hint="Numéro, rue, commune.">
                <Input id="d-adresse" defaultValue="14 rue des Capucins, 69001 Lyon" />
              </Field>
              <Field label="Type de travaux" htmlFor="d-type">
                <Select id="d-type" defaultValue="renovation">
                  <option value="renovation">Rénovation complète</option>
                  <option value="cuisine">Cuisine</option>
                  <option value="salle-de-bain">Salle de bain</option>
                </Select>
              </Field>
              <Field label="Surface" htmlFor="d-surface" error="La surface doit dépasser 9 m².">
                <Input id="d-surface" defaultValue="0" invalid />
              </Field>
            </Grid>
          </Stack>

          <Stack gap="sm">
            <h3 className="text-sm text-ink-3">Étiquettes</h3>
            <Row>
              <Badge tone="accent">Visite prévue</Badge>
              <Badge tone="ok">Chantier ouvert</Badge>
              <Badge tone="warn">Devis à relancer</Badge>
              <Badge tone="danger">Bloqué</Badge>
              <Badge>Brouillon</Badge>
            </Row>
          </Stack>

          <Stack gap="sm">
            <h3 className="text-sm text-ink-3">Messages</h3>
            <Alert tone="ok" title="Devis envoyé.">
              Le client reçoit un lien de signature par email.
            </Alert>
            <Alert tone="warn" title="Trois devis dépassent dix jours.">
              La relance automatique part demain à 9 h.
            </Alert>
            <Alert tone="danger" title="Enregistrement refusé.">
              Vérifie la surface, puis réessaie.
            </Alert>
          </Stack>

          <Stack gap="sm">
            <h3 className="text-sm text-ink-3">Onglets</h3>
            <Tabs
              tabs={[
                { id: 'lots', label: 'Lots', content: 'Plomberie livrée, reste électricité et peinture.' },
                { id: 'photos', label: 'Photos', content: 'Douze photos, dont une en couverture.' },
                { id: 'histo', label: 'Historique', content: 'Visite le 3 mars, devis le 9, signature le 21.' },
              ]}
            />
          </Stack>

          <Stack gap="sm">
            <h3 className="text-sm text-ink-3">Tableau</h3>
            <Table
              head={
                <>
                  <Th>Chantier</Th>
                  <Th>Statut</Th>
                  <Th numeric>Montant</Th>
                </>
              }
            >
              <tr>
                <Td strong>Duplex Croix-Rousse</Td>
                <Td>
                  <Badge tone="ok">Ouvert</Badge>
                </Td>
                <Td numeric>62 300 €</Td>
              </tr>
              <tr>
                <Td strong>Ancienne école, Charnay</Td>
                <Td>
                  <Badge tone="warn">À relancer</Badge>
                </Td>
                <Td numeric>41 900 €</Td>
              </tr>
              <tr>
                <Td strong>Maison de bourg, Anse</Td>
                <Td>
                  <Badge>Brouillon</Badge>
                </Td>
                <Td numeric>18 400 €</Td>
              </tr>
            </Table>
          </Stack>

          <Stack gap="sm">
            <h3 className="text-sm text-ink-3">Carte et état vide</h3>
            <Grid min="280px">
              <Card>
                <Stack gap="sm">
                  <h4 className="text-lg">Devis ferme</h4>
                  <p className="text-sm text-ink-2">
                    Un document, poste par poste. Le prix ne bouge plus après signature.
                  </p>
                </Stack>
              </Card>
              <EmptyState
                title="Aucun chantier"
                description="Ajoute une adresse, on s'occupe du reste."
                action={<Button size="sm">Ajouter un chantier</Button>}
              />
            </Grid>
          </Stack>
        </Stack>
      </Section>
    </Page>
  )
}
