import { ImageResponse } from 'next/og'

export const alt = 'NovaSense — The Future of Smart Living'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '90px',
          background:
            'radial-gradient(1200px 700px at 78% 18%, #1e1b4b 0%, #0b0a1f 45%, #07080d 100%)',
          color: '#f1f5f9',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 30,
            fontWeight: 700,
            letterSpacing: '0.22em',
            color: '#818cf8',
          }}
        >
          NOVASENSE AI
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 88,
            fontWeight: 800,
            lineHeight: 1.04,
            marginTop: 24,
            maxWidth: 920,
          }}
        >
          The Future of Smart Living
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 32,
            color: '#94a3b8',
            marginTop: 28,
            maxWidth: 840,
          }}
        >
          One AI hub that connects and orchestrates every device in your home — by voice or app.
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 26,
            color: '#22d3ee',
            marginTop: 44,
          }}
        >
          Matter · Zigbee · Z-Wave · Thread · Wi-Fi 6 · Bluetooth 5.3
        </div>
      </div>
    ),
    { ...size },
  )
}
