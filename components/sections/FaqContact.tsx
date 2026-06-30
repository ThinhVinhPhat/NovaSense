import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Faq } from './Faq'
import { Contact } from './Contact'

export function FaqContact() {
  return (
    <Section>
      <Container>
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <Faq />
          <Contact />
        </div>
      </Container>
    </Section>
  )
}
