import { useState, useEffect } from 'react'
import { AlertCircle, RefreshCw, Clock } from 'lucide-react'

const isRateLimit = (msg) =>
  msg && (msg.toLowerCase().includes('rate limit') || msg.toLowerCase().includes('too many'))

export default function ErrorState({ message, onRetry }) {
  const rateLimit = isRateLimit(message)
  const [countdown, setCountdown] = useState(rateLimit ? 60 : 0)

  useEffect(() => {
    if (!rateLimit) return
    setCountdown(60)
    const timer = setInterval(() => {
      setCountdown((c) => { if (c <= 1) { clearInterval(timer); return 0 } return c - 1 })
    }, 1000)
    return () => clearInterval(timer)
  }, [rateLimit, message])

  const canRetry = !rateLimit || countdown === 0

  return (
    <div style={{
      maxWidth: 460, margin: '40px auto',
      background: 'rgba(255,255,255,0.04)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      borderRadius: 'var(--radius-xl)',
      padding: '52px 44px', textAlign: 'center',
      border: `1px solid ${rateLimit ? 'rgba(251,191,36,0.2)' : 'rgba(248,113,113,0.2)'}`,
      boxShadow: rateLimit
        ? '0 20px 60px rgba(0,0,0,0.4), 0 0 30px rgba(251,191,36,0.05)'
        : '0 20px 60px rgba(0,0,0,0.4), 0 0 30px rgba(248,113,113,0.05)',
    }}>
      {/* Icon */}
      <div style={{
        width: 68, height: 68, borderRadius: '50%',
        background: rateLimit ? 'rgba(251,191,36,0.1)' : 'rgba(248,113,113,0.1)',
        border: `1px solid ${rateLimit ? 'rgba(251,191,36,0.25)' : 'rgba(248,113,113,0.25)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 24px',
        boxShadow: rateLimit ? '0 0 30px rgba(251,191,36,0.12)' : '0 0 30px rgba(248,113,113,0.12)',
      }}>
        {rateLimit
          ? <Clock size={30} color="#FBBF24" />
          : <AlertCircle size={30} color="#F87171" />}
      </div>

      <h2 style={{
        fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 600,
        color: 'var(--text-primary)', marginBottom: 12,
      }}>
        {rateLimit ? 'Rate limit reached' : "Something didn't go to plan"}
      </h2>

      <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 8 }}>
        {rateLimit
          ? 'The Groq API free tier has a rate limit. Please wait a moment.'
          : (message || 'An unexpected error occurred while generating your itinerary.')}
      </p>

      {rateLimit && countdown === 0 && (
        <p style={{ fontSize: 13, color: 'var(--accent-emerald)', fontWeight: 600, marginBottom: 16, marginTop: 8 }}>
          ✓ Ready — click Try again!
        </p>
      )}

      {!rateLimit && (
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>
          This is usually a temporary issue. Try again and it should work.
        </p>
      )}

      <button
        id="retry-btn"
        onClick={canRetry ? onRetry : undefined}
        disabled={!canRetry}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: canRetry
            ? 'linear-gradient(135deg, #8B5CF6, #6366F1)'
            : 'rgba(255,255,255,0.08)',
          color: canRetry ? 'white' : 'var(--text-muted)',
          border: 'none', borderRadius: 'var(--radius-md)',
          padding: '14px 28px', fontSize: 15, fontWeight: 600,
          fontFamily: 'var(--font-body)',
          cursor: canRetry ? 'pointer' : 'not-allowed',
          transition: 'all var(--transition-fast)',
          boxShadow: canRetry ? '0 4px 20px rgba(139,92,246,0.35)' : 'none',
        }}
        onMouseOver={(e) => {
          if (canRetry) {
            e.currentTarget.style.transform = 'translateY(-1px)'
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(139,92,246,0.5)'
          }
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = canRetry ? '0 4px 20px rgba(139,92,246,0.35)' : 'none'
        }}
      >
        <RefreshCw size={15} />
        {rateLimit && countdown > 0 ? `Wait ${countdown}s…` : 'Try again'}
      </button>
    </div>
  )
}
