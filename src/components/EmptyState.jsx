import { Sparkles } from 'lucide-react'

const EXAMPLES = [
  { label: '🗾 5 days in Tokyo', full: '5 days in Tokyo, love street food, anime culture, and modern architecture. Mid-range budget, solo traveler.' },
  { label: '🇵🇹 Weekend in Lisbon', full: 'Weekend trip to Lisbon with my partner. We love history, local wine, and Fado music. Mix of relaxed and active.' },
  { label: '🛵 10 days in Vietnam', full: '10 days backpacking Vietnam on a tight budget. Want to see Hanoi, Ha Long Bay, Hoi An, and Ho Chi Minh City.' },
  { label: '🗼 Family Paris trip', full: 'Family trip to Paris, 7 days, traveling with two kids aged 8 and 11. Mix of iconic sights and fun kid-friendly activities.' },
  { label: '🏔️ Patagonia adventure', full: 'Two weeks in Patagonia as a solo adventurer. I love challenging hikes, raw nature, and remote landscapes.' },
]

export default function EmptyState({ onSelectExample }) {
  return (
    <div style={{ marginTop: 48 }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        marginBottom: 16, color: 'var(--text-muted)',
      }}>
        <Sparkles size={14} color="var(--accent-light)" />
        <span style={{
          fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
          letterSpacing: '0.1em', color: 'var(--accent-light)',
        }}>
          Need inspiration?
        </span>
      </div>

      <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
        Click an example to get started. You can edit it before submitting.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: 12 }}>
        {EXAMPLES.map((example) => (
          <button
            key={example.label}
            id={`example-${example.label.replace(/\s+/g, '-').toLowerCase()}`}
            onClick={() => onSelectExample(example.full)}
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 'var(--radius-md)',
              padding: '14px 18px', textAlign: 'left', cursor: 'pointer',
              transition: 'all var(--transition-fast)',
              fontFamily: 'var(--font-body)',
              display: 'flex', flexDirection: 'column', gap: 4,
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = 'rgba(139,92,246,0.4)'
              e.currentTarget.style.background = 'rgba(139,92,246,0.07)'
              e.currentTarget.style.transform = 'translateX(4px)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
              e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
              e.currentTarget.style.transform = 'translateX(0)'
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
              {example.label}
            </span>
            <span style={{
              fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.4,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {example.full}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
