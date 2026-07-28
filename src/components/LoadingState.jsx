import { useState, useEffect } from 'react'

const MESSAGES = [
  'Reading your trip idea…',
  'Consulting the AI travel expert…',
  'Mapping out your destinations…',
  'Building your daily schedule…',
  'Finding the best local spots…',
  'Picking restaurants and sights…',
  'Adding insider tips…',
  'Polishing your itinerary…',
  'Almost there…',
]

function SkeletonLine({ width = '100%', height = 14, style = {} }) {
  return (
    <div
      className="skeleton"
      style={{ width, height, borderRadius: 'var(--radius-sm)', ...style }}
    />
  )
}

function SkeletonStop() {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)',
      borderRadius: 'var(--radius-md)',
      padding: '16px 20px',
      border: '1px solid rgba(255,255,255,0.07)',
      marginBottom: 8,
      display: 'flex', alignItems: 'center', gap: 16,
    }}>
      <SkeletonLine width={4} height={40} style={{ borderRadius: 2, flexShrink: 0 }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <SkeletonLine width="55%" height={13} />
        <SkeletonLine width="30%" height={10} />
      </div>
      <SkeletonLine width={52} height={20} style={{ borderRadius: 'var(--radius-pill)', flexShrink: 0 }} />
    </div>
  )
}

export default function LoadingState() {
  const [msgIdx, setMsgIdx] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIdx((prev) => (prev + 1) % MESSAGES.length)
    }, 2200)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ maxWidth: 680, margin: '0 auto' }}>
      {/* Status indicator */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 16,
        marginBottom: 32, padding: '18px 22px',
        background: 'rgba(139,92,246,0.08)',
        backdropFilter: 'blur(20px)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid rgba(139,92,246,0.25)',
        boxShadow: '0 0 30px rgba(139,92,246,0.08)',
      }}>
        {/* Spinner */}
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          border: '2px solid rgba(139,92,246,0.2)',
          borderTopColor: '#8B5CF6',
          animation: 'spin 1s linear infinite', flexShrink: 0,
        }} />
        <div>
          <p style={{
            fontSize: 15, fontWeight: 600, color: '#A78BFA',
            marginBottom: 3, transition: 'opacity 0.3s ease',
          }}>
            {MESSAGES[msgIdx]}
          </p>
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            This usually takes 5–15 seconds
          </p>
        </div>
      </div>

      {/* Skeleton tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="skeleton" style={{ width: 72, height: 46, borderRadius: 'var(--radius-pill)' }} />
        ))}
      </div>

      {/* Skeleton stops */}
      <div style={{ marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <SkeletonLine width="35%" height={22} />
        <SkeletonLine width="60%" height={12} />
      </div>
      {[1, 2, 3, 4].map((i) => <SkeletonStop key={i} />)}
    </div>
  )
}
