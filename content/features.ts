import type { LucideIcon } from 'lucide-react'
import {
  Mic2, Link2, Home, Zap, Shield, Smartphone, BarChart2, Layers
} from 'lucide-react'

export interface Feature {
  icon: LucideIcon
  title: string
  description: string
}

export const features: Feature[] = [
  {
    icon: Mic2,
    title: 'Natural-Language Voice Control',
    description: 'Speak naturally to NovaSense. No rigid commands — just conversation.',
  },
  {
    icon: Link2,
    title: 'Universal Compatibility',
    description: 'Works with Matter, Zigbee, Z-Wave, Thread, Wi-Fi, and Bluetooth devices.',
  },
  {
    icon: Home,
    title: 'Whole-Home Control',
    description: 'Lights, cameras, AC, curtains, door locks, and sensors in one place.',
  },
  {
    icon: Zap,
    title: 'Smart Automations & Scenes',
    description: 'Create routines that adapt to your daily life automatically.',
  },
  {
    icon: Shield,
    title: 'On-Device Edge AI',
    description: 'AI processing stays local for millisecond response times and full privacy.',
  },
  {
    icon: Smartphone,
    title: 'Unified App + Voice',
    description: 'Control everything from the companion app or by voice — iOS and Android.',
  },
  {
    icon: BarChart2,
    title: 'Energy Monitoring',
    description: 'Real-time insights into your home’s energy usage with actionable suggestions.',
  },
  {
    icon: Layers,
    title: 'Expandable Ecosystem',
    description: 'Start small and add devices as you grow. No hub replacement needed.',
  },
]
