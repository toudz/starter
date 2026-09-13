import { ButtonLink, Card, Grid, Page, Prose, Row, Section, Stack } from '@/ui'
import { site } from '@/site.config'

const ETAPES = [
  { titre: 'Visite et relevé', texte: 'Deux heures sur place, relevé complet des surfaces.' },
  { titre: 'Devis ferme', texte: 'Un document, poste par poste. Le prix ne bouge plus.' },
  { titre: 'Chantier suivi', texte: 'Un point chaque vendredi, photos à l’appui.' },
]

export default function Home() {
  return (
    <Page>
      <Section space="lg">
        <Stack gap="lg">
          <h1 className="text-4xl">Une rénovation, un seul interlocuteur</h1>
          <Prose>
            <p className="text-lg text-ink-2">{site.description}</p>
          </Prose>
          <Row>
            <ButtonLink href="/contact" size="lg">
              Demander un devis
            </ButtonLink>
            <ButtonLink href="/design" size="lg" variant="secondary">
              Voir le socle
            </ButtonLink>
          </Row>
        </Stack>
      </Section>

      <Section>
        <Grid min="240px">
          {ETAPES.map((e) => (
            <Card key={e.titre}>
              <Stack gap="sm">
                <h2 className="text-lg">{e.titre}</h2>
                <p className="text-sm text-ink-2">{e.texte}</p>
              </Stack>
            </Card>
          ))}
        </Grid>
      </Section>
    </Page>
  )
}
