import { BarChart3, Leaf, Mic, ShieldCheck, Smartphone, Workflow, type LucideIcon } from 'lucide-react'


export interface Feature {
  icon: LucideIcon
  title: string
  description: string
}
export const features = [
  {
    icon: Mic,
    title: 'AI Voice Assistant',
    desc: 'Natural-language control — no rigid commands, just speak.',
    span: 'lg:col-span-2 lg:row-span-2',
    hero: true,
  },
  { icon: Workflow, title: 'Smart Automation', desc: 'Scenes and routines that orchestrate the whole home.', span: '' },
  { icon: Leaf, title: 'Energy Saving', desc: 'Track consumption and cut waste with real-time insights.', span: '' },
  { icon: Smartphone, title: 'Remote Access', desc: 'Control everything from anywhere via the unified app.', span: '' },
  { icon: ShieldCheck, title: 'Security', desc: 'AI cameras with face recognition and instant alerts.', span: '' },
  {
    icon: BarChart3,
    title: 'Analytics',
    desc: 'Real-time statistics across every connected device.',
    span: 'sm:col-span-2 lg:col-span-4',
    analytics: true,
  },
]

export const waveBars = [40, 70, 45, 90, 55, 75, 35, 60]
export const sparkPoints = [12, 28, 18, 40, 30, 52, 38, 60, 48, 70]
