import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { ArrowRight, Sparkles } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-(--color-bg) py-20 sm:py-32">
      <div className="absolute inset-0 bg-gradient-to-br from-(--color-accent)/5 via-transparent to-transparent" />
      <Container className="relative">
        <div className="mx-auto max-w-3xl text-center">
          <Badge className="mb-6">
            <Sparkles size={12} />
            Introducing NovaSense
          </Badge>
          <h1 className="font-heading text-4xl font-extrabold tracking-tight text-(--color-text-primary) sm:text-6xl lg:text-7xl">
            The Future of{' '}
            <span className="bg-gradient-to-r from-(--color-accent) to-purple-400 bg-clip-text text-transparent">
              Smart Living
            </span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-(--color-text-secondary) sm:text-xl">
            NovaSense is the intelligent brain of your home. One hub to connect, control, and
            automate every device — by voice or app — powered by on-device AI.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button size="lg">
              Pre-order Now <ArrowRight size={18} />
            </Button>
            <Button variant="secondary" size="lg">
              Explore Features
            </Button>
          </div>
        </div>
        <div className="mt-16 flex justify-center">
          <div className="relative h-64 w-64 sm:h-80 sm:w-80 lg:h-96 lg:w-96">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-(--color-accent)/20 to-purple-500/20 blur-3xl" />
            <div className="relative flex h-full w-full items-center justify-center rounded-xl border border-(--color-border) bg-(--color-bg-card) shadow-lg">
              <div className="text-center">
                <div className="mb-4 text-6xl">🏠</div>
                <p className="font-heading text-lg font-semibold text-(--color-text-primary)">NovaSense Hub</p>
                <p className="text-sm text-(--color-text-muted)">Coming Soon</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
