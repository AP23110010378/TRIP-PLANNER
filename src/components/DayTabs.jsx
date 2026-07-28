export default function DayTabs({ days, activeDay, onSelectDay }) {
  return (
    <div
      role="tablist"
      aria-label="Trip days"
      style={{
        display: 'flex', gap: 8, marginBottom: 28,
        overflowX: 'auto', paddingBottom: 4,
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none', msOverflowStyle: 'none',
      }}
    >
      {days.map((day, idx) => {
        const isActive = idx === activeDay
        return (
          <button
            key={day.id}
            id={`day-tab-${idx + 1}`}
            role="tab"
            aria-selected={isActive}
            aria-controls={`day-panel-${idx + 1}`}
            onClick={() => onSelectDay(idx)}
            style={{
              flexShrink: 0,
              display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
              padding: '10px 18px',
              borderRadius: 'var(--radius-pill)',
              border: isActive
                ? '1px solid rgba(139,92,246,0.5)'
                : '1px solid rgba(255,255,255,0.08)',
              background: isActive
                ? 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(99,102,241,0.2))'
                : 'rgba(255,255,255,0.04)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
              fontFamily: 'var(--font-body)',
              minWidth: 80,
              boxShadow: isActive ? '0 0 20px rgba(139,92,246,0.2)' : 'none',
            }}
            onMouseOver={(e) => {
              if (!isActive) {
                e.currentTarget.style.borderColor = 'rgba(139,92,246,0.3)'
                e.currentTarget.style.background = 'rgba(139,92,246,0.08)'
              }
            }}
            onMouseOut={(e) => {
              if (!isActive) {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
              }
            }}
          >
            <span style={{
              fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: isActive ? 'rgba(167,139,250,0.8)' : 'var(--text-muted)',
              marginBottom: 2,
            }}>
              Day
            </span>
            <span style={{
              fontSize: 18, fontWeight: 700,
              color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontFamily: 'var(--font-heading)', lineHeight: 1,
            }}>
              {day.dayNumber}
            </span>
          </button>
        )
      })}
    </div>
  )
}
