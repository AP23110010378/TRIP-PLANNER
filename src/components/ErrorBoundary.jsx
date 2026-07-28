import { Component } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

/**
 * ErrorBoundary — catches render errors anywhere in the tree.
 * Shows a friendly error screen instead of crashing the app.
 * Must be a class component (React requirement for error boundaries).
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary] Caught error:', error, info)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    // Navigate back to home
    window.location.href = '/'
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'var(--color-canvas)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
        }}
      >
        <div
          style={{
            maxWidth: '480px',
            width: '100%',
            background: 'white',
            borderRadius: 'var(--radius-lg)',
            padding: '48px 40px',
            boxShadow: 'var(--shadow-lg)',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'var(--color-error-pale)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
            }}
          >
            <AlertTriangle size={28} color="var(--color-error)" />
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '24px',
              fontWeight: 600,
              color: 'var(--color-ink)',
              marginBottom: 12,
            }}
          >
            Something went wrong
          </h1>

          <p
            style={{
              color: 'var(--color-ink-muted)',
              fontSize: '15px',
              lineHeight: 1.6,
              marginBottom: 32,
            }}
          >
            An unexpected error occurred. Don&apos;t worry — your session wasn&apos;t saved.
            Click below to return to the home page.
          </p>

          <button
            onClick={this.handleReset}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'var(--color-ink)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              padding: '14px 28px',
              fontSize: '15px',
              fontWeight: 600,
              fontFamily: 'var(--font-body)',
              cursor: 'pointer',
              transition: 'background var(--transition-fast)',
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = 'var(--color-ink-light)')}
            onMouseOut={(e) => (e.currentTarget.style.background = 'var(--color-ink)')}
          >
            <RefreshCw size={16} />
            Return to Home
          </button>
        </div>
      </div>
    )
  }
}
