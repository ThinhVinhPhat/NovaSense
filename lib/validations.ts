import { z } from 'zod'

export const subscribeSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  name: z.string().max(100).optional(),
  _honey: z.string().max(0, 'Bot detected').optional(),
})

export type SubscribeInput = z.infer<typeof subscribeSchema>

export const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().max(40).optional(),
  message: z.string().min(1, 'Message is required').max(2000),
  _honey: z.string().max(0, 'Bot detected').optional(),
})

export type ContactInput = z.infer<typeof contactSchema>
