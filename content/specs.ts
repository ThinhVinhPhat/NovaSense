export interface SpecRow {
  label: string
  value: string
}

export interface SpecGroup {
  group: string
  rows: SpecRow[]
}

export const specGroups: SpecGroup[] = [
  {
    group: 'Processing',
    rows: [
      { label: 'AI Processor', value: 'Dedicated NPU (Neural Processing Unit)' },
      { label: 'Local Processing', value: 'Full on-device AI + optional cloud sync' },
    ],
  },
  {
    group: 'Connectivity',
    rows: [
      { label: 'Wi-Fi', value: 'Wi-Fi 6 (802.11ax)' },
      { label: 'Bluetooth', value: 'Bluetooth 5.3' },
      { label: 'Smart Home', value: 'Zigbee 3.0 + Z-Wave + Thread + Matter' },
    ],
  },
  {
    group: 'Audio',
    rows: [
      { label: 'Microphone', value: 'Far-field multi-mic array' },
      { label: 'Noise Cancellation', value: 'Built-in beamforming + echo cancellation' },
    ],
  },
  {
    group: 'Capacity',
    rows: [
      { label: 'Simultaneous Devices', value: '100+ devices' },
      { label: 'App Support', value: 'iOS & Android companion app' },
    ],
  },
  {
    group: 'Hardware',
    rows: [
      { label: 'Form Factor', value: 'Compact desktop' },
      { label: 'Power', value: 'USB-C / DC power adapter' },
    ],
  },
]
