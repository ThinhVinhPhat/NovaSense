export interface FaqItem {
  question: string
  answer: string
}

export const faqItems: FaqItem[] = [
  { question: 'Which smart-home standards does NovaSense support?', answer: 'NovaSense speaks Matter, Zigbee 3.0, Z-Wave, Thread, Wi-Fi 6, and Bluetooth 5.3 — so it works with virtually every modern device.' },
  { question: 'Does it work without the internet?', answer: 'Yes. NovaSense processes AI on-device, so voice control and automations keep working even when your connection drops. Cloud sync is optional.' },
  { question: 'How many devices can it control?', answer: 'A single hub manages 100+ simultaneous devices across every supported protocol.' },
  { question: 'Is my data private?', answer: 'On-device (edge) AI means your voice and routines stay local by default. Cloud sync is encrypted and entirely opt-in.' },
  { question: 'What is the difference between Hub and Pro?', answer: 'Pro adds enhanced processing and expandable storage for larger homes and heavier automation workloads. Both run the full NovaSense AI.' },
]
