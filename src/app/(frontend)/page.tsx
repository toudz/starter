import { ButtonLink, Page, Prose, Row, Section, Stack } from '@/ui'
import { site } from '@/site.config'

export default function Home() {
  return (
    <Page>
      <Section space="lg">
        <Stack gap="lg">
          <h1 className="text-4xl">{site.name}</h1>
          <Prose>
            <p className="text-lg text-ink-2">
              Le site est en ligne et vide. Le socle est posé, les composants attendent du contenu.
            </p>
          </Prose>
          <Row>
            <ButtonLink href="/design">Voir le socle</ButtonLink>
            <ButtonLink href="/admin" variant="secondary">
              Ouvrir l&apos;admin
            </ButtonLink>
          </Row>
        </Stack>
      </Section>
    </Page>
  )
}
