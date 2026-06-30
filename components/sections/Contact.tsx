'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Badge } from '@/components/ui/Badge'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { contactSchema, type ContactInput } from '@/lib/validations'
import { Mails } from 'lucide-react'

const inputCls =
  'w-full rounded-md border border-(--color-glass-border) bg-(--color-bg) px-4 py-2.5 text-sm text-(--color-text-primary) placeholder:text-(--color-text-muted) focus:outline-none focus:ring-2 focus:ring-(--color-accent)'

export function Contact() {
  const { toast } = useToast()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) })

  async function onSubmit(data: ContactInput) {
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = (await res.json()) as { success: boolean; message: string }
      if (json.success) {
        toast({ title: 'Message sent!', description: "We'll be in touch soon.", variant: 'success' })
        reset()
      } else {
        toast({ title: 'Could not send', description: json.message, variant: 'error' })
      }
    } catch {
      toast({ title: 'Network error', description: 'Please try again later.', variant: 'error' })
    }
  }

  return (
    <Section id="contact">
      <Container>
        <div className="mx-auto max-w-xl text-center">
          <Badge className="mb-4">
            <Mails size={12} />
            Contact
          </Badge>
          <h2 className="font-heading text-3xl font-bold text-(--color-text-primary) sm:text-4xl">
            Talk to our team
          </h2>
        </div>
        <GlassCard className="mx-auto mt-10 max-w-xl p-6 sm:p-8">
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <input type="text" tabIndex={-1} aria-hidden="true" className="hidden" {...register('_honey')} />
            <div>
              <input placeholder="Your name" aria-label="Name" className={inputCls} {...register('name')} />
              {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
            </div>
            <div>
              <input type="email" placeholder="you@example.com" aria-label="Email" className={inputCls} {...register('email')} />
              {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
            </div>
            <div>
              <input type="tel" placeholder="Phone (optional)" aria-label="Phone" className={inputCls} {...register('phone')} />
              {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone.message}</p>}
            </div>
            <div>
              <textarea placeholder="How can we help?" aria-label="Message" rows={4} className={inputCls} {...register('message')} />
              {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message.message}</p>}
            </div>
            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Sending…' : 'Send message'}
            </Button>
          </form>
        </GlassCard>
      </Container>
    </Section>
  )
}
