export interface Stat {
  to: number
  suffix: string
  decimals?: number
  label: string
}

export const stats: Stat[] = [
  { to: 500, suffix: 'K+', label: 'Active users' },
  { to: 98, suffix: '%', label: 'Voice accuracy' },
  { to: 120, suffix: '+', label: 'Countries' },
  { to: 4.9, suffix: '★', decimals: 1, label: 'Average rating' },
]
