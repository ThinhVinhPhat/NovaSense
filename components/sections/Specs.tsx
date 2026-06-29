import { specGroups } from '@/content/specs'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Badge } from '@/components/ui/Badge'

export function Specs() {
  return (
    <Section id="specs">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Badge className="mb-4">Tech Specs</Badge>
          <h2 className="font-heading text-3xl font-bold text-(--color-text-primary) sm:text-4xl">
            Built for the next decade of smart homes
          </h2>
        </div>
        <div className="mt-12 mx-auto max-w-3xl divide-y divide-(--color-border) rounded-xl border border-(--color-border) bg-(--color-bg-card) overflow-hidden shadow-sm">
          {specGroups.map((group) => (
            <div key={group.group}>
              <div className="bg-(--color-bg-subtle) px-6 py-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-(--color-text-muted)">
                  {group.group}
                </span>
              </div>
              {group.rows.map((row) => (
                <div
                  key={row.label}
                  className="flex flex-col gap-1 px-6 py-3 sm:flex-row sm:items-center sm:gap-8"
                >
                  <span className="min-w-[180px] text-sm font-medium text-(--color-text-secondary)">
                    {row.label}
                  </span>
                  <span className="text-sm text-(--color-text-primary)">{row.value}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Container>
    </Section>
  )
}
