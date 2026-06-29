'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useToast } from '@/components/ui/Toast'
import { subscribeSchema, type SubscribeInput } from '@/lib/validations'
import { trackClick, initScrollTracking } from '@/lib/analytics'
import { Mail } from 'lucide-react'

export function Newsletter() {
  const { toast } = useToast()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SubscribeInput>({ resolver: zodResolver(subscribeSchema) })

  useEffect(() => {
    return initScrollTracking()
  }, [])

  async function onSubmit(data: SubscribeInput) {
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = (await res.json()) as { success: boolean; message: string }
      if (json.success) {
        toast({ title: "You're on the list!", description: "We'll notify you at launch.", variant: 'success' })
        reset()
      } else {
        toast({ title: 'Subscription failed', description: json.message, variant: 'error' })
      }
    } catch {
      toast({ title: 'Network error', description: 'Please try again later.', variant: 'error' })
    }
  }

  return (
    <Section id="newsletter" className="bg-(--color-bg-subtle)">
      <Container>
        <div className="mx-auto max-w-xl text-center">
          <Badge className="mb-4">
            <Mail size={12} />
            Stay Updated
          </Badge>
          <h2 className="font-heading text-3xl font-bold text-(--color-text-primary) sm:text-4xl">
            Be first to know when NovaSense ships
          </h2>
          <p className="mt-4 text-(--color-text-secondary)">
            Join thousands of smart home enthusiasts. No spam, just launch updates.
          </p>
          <form className="mt-8 flex flex-col gap-3 sm:flex-row" onSubmit={handleSubmit(onSubmit)}>
            <input
              type="text"
              tabIndex={-1}
              aria-hidden="true"
              className="hidden"
              {...register('_honey')}
            />
            <div className="flex-1">
              <input
                type="email"
                placeholder="you@example.com"
                aria-label="Email address"
                aria-describedby={errors.email ? 'email-error' : undefined}
                aria-invalid={errors.email ? 'true' : 'false'}
                className="w-full rounded-md border border-(--color-border) bg-(--color-bg) px-4 py-2.5 text-sm text-(--color-text-primary) placeholder:text-(--color-text-muted) focus:outline-none focus:ring-2 focus:ring-(--color-accent) aria-[invalid=true]:border-red-400"
                {...register('email')}
              />
              {errors.email && (
                <p id="email-error" className="mt-1 text-left text-xs text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              size="md"
              disabled={isSubmitting}
              onClick={() => trackClick('newsletter-cta')}
            >
              {isSubmitting ? 'Sending…' : 'Notify Me'}
            </Button>
          </form>
          <p className="mt-3 text-xs text-(--color-text-muted)">
            By subscribing you agree to our privacy policy.
          </p>
        </div>
      </Container>
    </Section>
  )
}
