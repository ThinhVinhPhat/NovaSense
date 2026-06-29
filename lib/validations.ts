import { z } from 'zod'

export const subscribeSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  name: z.string().max(100).optional(),
  _honey: z.string().max(0, 'Bot detected').optional(),
})

export type SubscribeInput = z.infer<typeof subscribeSchema>
