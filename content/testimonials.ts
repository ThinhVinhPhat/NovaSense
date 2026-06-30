export interface Testimonial {
  name: string
  role: string
  initials: string
  rating: number
  quote: string
}

export const testimonials: Testimonial[] = [
  { name: 'Ava Chen', role: 'Smart-home enthusiast', initials: 'AC', rating: 5, quote: 'NovaSense replaced four different apps. Now I just talk to my house.' },
  { name: 'Marcus Reid', role: 'Architect', initials: 'MR', rating: 5, quote: 'The on-device AI is shockingly fast and the design disappears into the room.' },
  { name: 'Lena Ortiz', role: 'Energy consultant', initials: 'LO', rating: 4, quote: 'Energy insights cut our standby draw noticeably within the first month.' },
  { name: 'Tomás Vidal', role: 'Developer', initials: 'TV', rating: 5, quote: 'Matter and Thread just worked. No hubs-on-hubs nonsense.' },
]
