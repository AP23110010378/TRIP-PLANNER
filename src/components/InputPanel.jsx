import { useState, useRef, useEffect } from 'react'
import { Send, Loader2 } from 'lucide-react'
import EmptyState from './EmptyState'

const MAX_CHARS = 1000

export default function InputPanel({ onSubmit, prefill }) {
  const [text, setText] = useState(prefill || '')
  const [touched, setTouched] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const textareaRef = useRef(null)

  useEffect(() => { textareaRef.current?.focus() }, [])
  useEffect(() => {
    if (prefill) { setText(prefill); textareaRef.current?.focus() }
  }, [prefill])

  const isEmpty = text.trim().length === 0
  const isOverLimit = text.length > MAX_CHARS
  const showError = touched && isEmpty

  const handleSubmit = async (e) => {
    e.preventDefault()
    setTouched(true)
    if (isEmpty || isOverLimit) return
    setIsSubmitting(true)
    await onSubmit(text.trim())
    setIsSubmitting(false)
  }

  const handleExampleClick = (example) => {
    setText(example)
    textareaRef.current?.focus()
  }

  const getBorderStyle = () => {
    if (isOverLimit) return '1px solid rgba(248,113,113,0.5)'
    if (showError) return '1px solid rgba(248,113,113,0.5)'
    if (isFocused) return '1px solid rgba(139,92,246,0.6)'
    return '1px solid rgba(255,255,255,0.08)'
  }

  const getGlow = () => {
    if (isOverLimit || showError) return '0 0 0 4px rgba(248,113,113,0.08)'
    if (isFocused) return '0 0 0 4px rgba(139,92,246,0.1), 0 0 30px rgba(139,92,246,0.12)'
    return 'none'
  }

  return (
    <div className="input-panel-container">
      {/* Heading */}
      <div style={{ marginBottom: 32, textAlign: 'center' }}>
        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(28px, 3.5vw, 64px)', fontWeight: 700,
          color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.15,
          marginBottom: 16,
        }}>
          Describe your{' '}
          <em style={{
            fontStyle: 'italic',
            background: 'linear-gradient(135deg, #A78BFA, #22D3EE)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            dream trip.
          </em>
        </h1>
        <p style={{ fontSize: 'clamp(14px, 1.2vw, 20px)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          Tell us where, how long, who you&apos;re with, and what you love — anything helps.
        </p>
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmit} noValidate>
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: 'var(--radius-xl)',
          border: getBorderStyle(),
          boxShadow: getGlow(),
          overflow: 'hidden',
          transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
        }}>
          <textarea
            id="trip-input"
            ref={textareaRef}
            value={text}
            onChange={(e) => { setText(e.target.value); if (touched) setTouched(false) }}
            onBlur={() => { setTouched(true); setIsFocused(false) }}
            onFocus={() => setIsFocused(true)}
            placeholder="e.g. 5 days in Kyoto, love food and temples, mid-range budget, traveling with my partner, prefer a relaxed pace..."
            rows={6}
            aria-label="Trip description"
            style={{
              width: '100%', padding: 'clamp(16px, 2vw, 32px)',
              border: 'none', outline: 'none', resize: 'none',
              fontSize: 'clamp(15px, 1.1vw, 20px)', fontFamily: 'var(--font-body)',
              color: 'var(--text-primary)', lineHeight: 1.65,
              background: 'transparent',
            }}
          />

          {/* Footer row */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 24px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            background: 'rgba(0,0,0,0.2)',
          }}>
            <span style={{
              fontSize: 13,
              color: isOverLimit ? '#F87171' : 'var(--text-muted)',
              fontWeight: isOverLimit ? 600 : 400,
              transition: 'color var(--transition-fast)',
            }}>
              {text.length} / {MAX_CHARS}
            </span>

            <button
              id="plan-trip-btn"
              type="submit"
              disabled={isSubmitting || isOverLimit}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: isEmpty
                  ? 'rgba(255,255,255,0.08)'
                  : 'linear-gradient(135deg, #8B5CF6, #6366F1)',
                color: isEmpty ? 'var(--text-muted)' : 'white',
                border: 'none', borderRadius: 'var(--radius-md)',
                padding: '12px 24px', fontSize: 15, fontWeight: 700,
                fontFamily: 'var(--font-body)',
                cursor: isSubmitting || isOverLimit || isEmpty ? 'not-allowed' : 'pointer',
                transition: 'all var(--transition-fast)',
                opacity: isOverLimit ? 0.5 : 1,
                boxShadow: isEmpty ? 'none' : '0 4px 20px rgba(139,92,246,0.35)',
              }}
              onMouseOver={(e) => {
                if (!isEmpty && !isSubmitting && !isOverLimit) {
                  e.currentTarget.style.transform = 'translateY(-1px)'
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(139,92,246,0.5)'
                }
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = isEmpty ? 'none' : '0 4px 20px rgba(139,92,246,0.35)'
              }}
            >
              {isSubmitting
                ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                : <Send size={15} />}
              {isSubmitting ? 'Planning…' : 'Plan my trip'}
            </button>
          </div>
        </div>

        {showError && (
          <p id="input-error" role="alert" style={{
            color: '#F87171', fontSize: 13, fontWeight: 500,
            marginTop: 8, paddingLeft: 4,
          }}>
            Please describe your trip before planning.
          </p>
        )}
      </form>

      <EmptyState onSelectExample={handleExampleClick} />
    </div>
  )
}
