import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'SongGeneratorAI - AI Music Generator'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #16213e 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          padding: '60px',
        }}
      >
        <div style={{ fontSize: 72, marginBottom: 20 }}>🎵</div>
        <div
          style={{
            fontSize: 56,
            fontWeight: 800,
            color: '#ffffff',
            textAlign: 'center',
            lineHeight: 1.2,
            marginBottom: 20,
          }}
        >
          SongGeneratorAI
        </div>
        <div
          style={{
            fontSize: 28,
            color: '#a78bfa',
            textAlign: 'center',
            maxWidth: 800,
          }}
        >
          Create Original AI Music from Text or Lyrics
        </div>
        <div
          style={{
            marginTop: 40,
            padding: '12px 32px',
            background: '#7c3aed',
            borderRadius: 50,
            color: '#ffffff',
            fontSize: 22,
            fontWeight: 600,
          }}
        >
          Free · Royalty-Free · Multiple Styles
        </div>
      </div>
    ),
    { ...size }
  )
}
