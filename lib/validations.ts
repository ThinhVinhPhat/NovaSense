import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().max(40).optional(),
  message: z.string().min(1, 'Message is required').max(2000),
  _honey: z.string().max(0, 'Bot detected').optional(),
})

export type ContactInput = z.infer<typeof contactSchema>

const trackBase = { path: z.string().max(500), ts: z.number().int().positive() }

export const trackSchema = z.discriminatedUnion('type', [
  z.object({ ...trackBase, type: z.literal('click'), label: z.string().max(200) }),
  z.object({ ...trackBase, type: z.literal('scroll'), depth: z.number().int().min(0).max(100) }),
])

export type TrackInput = z.infer<typeof trackSchema>
