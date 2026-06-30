export interface PricingTier {
  name: string
  price: string
  period: string
  description: string
  features: string[]
  cta: string
  highlighted?: boolean
}

export const pricingTiers: PricingTier[] = [
  {
    name: 'Starter',
    price: 'Free',
    period: 'with every hub',
    description: 'Core control for your home.',
    features: ['Voice & app control', 'Up to 20 devices', 'Basic automations', 'Community support'],
    cta: 'Get started',
  },
  {
    name: 'Professional',
    price: '$9',
    period: 'per month',
    description: 'AI automations + insights.',
    features: ['Unlimited devices', 'Adaptive AI routines', 'Energy analytics', 'Priority support', 'Encrypted cloud sync'],
    cta: 'Choose Pro',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'multi-property',
    description: 'For installers & estates.',
    features: ['Multi-property dashboard', 'API & webhooks', 'SLA & onboarding', 'Dedicated manager'],
    cta: 'Contact sales',
  },
]
