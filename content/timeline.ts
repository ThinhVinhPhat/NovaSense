import type { LucideIcon } from 'lucide-react'
import { Brain, Mic, Wifi, ShieldCheck, RefreshCw } from 'lucide-react'

export interface TimelineStep {
  title: string
  description: string
  icon: LucideIcon
}

export const timeline: TimelineStep[] = [
  { title: 'AI Learning', description: 'NovaSense learns your routines and adapts automatically.', icon: Brain },
  { title: 'Voice Recognition', description: 'Far-field mics understand you from across the room.', icon: Mic },
  { title: 'IoT Connectivity', description: 'Speaks every protocol — Matter, Zigbee, Z-Wave, Thread.', icon: Wifi },
  { title: 'Secure Cloud', description: 'On-device processing with optional encrypted sync.', icon: ShieldCheck },
  { title: 'OTA Update', description: 'Gets smarter over time with seamless updates.', icon: RefreshCw },
]
