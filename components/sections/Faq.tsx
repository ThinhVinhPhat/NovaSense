import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Badge } from '@/components/ui/Badge'
import { Reveal } from '@/components/motion/Reveal'
import { faqItems } from '@/content/faq'
import { HelpCircle, ChevronDown } from 'lucide-react'

export function Faq() {
  return (
    <Section id="faq">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Badge className="mb-4">
            <HelpCircle size={12} />
            FAQ
          </Badge>
          <h2 className="font-heading text-3xl font-bold text-(--color-text-primary) sm:text-4xl">
            Questions, answered
          </h2>
        </div>
        <div className="mx-auto mt-10 max-w-2xl space-y-3">
          {faqItems.map((item, i) => (
            <Reveal key={item.question} delay={i * 0.04}>
              <details className="group rounded-2xl border border-(--color-glass-border) bg-(--color-glass) backdrop-blur-xl">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-medium text-(--color-text-primary) [&::-webkit-details-marker]:hidden">
                  {item.question}
                  <ChevronDown size={18} className="flex-shrink-0 text-(--color-text-muted) transition-transform group-open:rotate-180" />
                </summary>
                <p className="px-5 pb-5 text-sm leading-relaxed text-(--color-text-secondary)">{item.answer}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  )
}
