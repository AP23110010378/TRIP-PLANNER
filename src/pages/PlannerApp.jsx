import { useState, useEffect } from 'react'
import { useGenerateItinerary } from '../hooks/useGenerateItinerary'
import InputPanel from '../components/InputPanel'
import LoadingState from '../components/LoadingState'
import ErrorState from '../components/ErrorState'
import JourneyOverview from '../components/JourneyOverview'
import ParticleCanvas from '../components/ParticleCanvas'
import { Compass, MapPin, RotateCcw } from 'lucide-react'

export default function PlannerApp({ onBack, pendingPrompt }) {
  const { status, itinerary, error, generate, reset } = useGenerateItinerary()
  const [localItinerary, setLocalItinerary] = useState(null)

  useEffect(() => {
    if (itinerary) {
      setLocalItinerary(itinerary)
    }
  }, [itinerary])

  // Auto-generate when arriving from LandingPage with a prompt
  useEffect(() => {
    if (pendingPrompt && pendingPrompt.trim()) {
      generate(pendingPrompt.trim())
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* Remove a stop from a day */
  const handleRemoveStop = (dayId, stopId) => {
    setLocalItinerary((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        days: prev.days.map((day) => {
          if (day.id !== dayId) return day
          return { ...day, stops: day.stops.filter((s) => s.id !== stopId) }
        }),
      }
    })
  }

  /* Update stop details inline */
  const handleUpdateStop = (dayId, stopId, updatedFields) => {
    setLocalItinerary((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        days: prev.days.map((day) => {
          if (day.id !== dayId) return day
          return {
            ...day,
            stops: day.stops.map((s) => (s.id === stopId ? { ...s, ...updatedFields } : s)),
          }
        }),
      }
    })
  }

  /* Reorder stops within a day */
  const handleReorderStops = (dayId, newStops) => {
    setLocalItinerary((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        days: prev.days.map((day) => {
          if (day.id !== dayId) return day
          return { ...day, stops: newStops }
        }),
      }
    })
  }

  const handleReset = () => {
    reset()
    setLocalItinerary(null)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <ParticleCanvas opacity={0.6} />

      {/* ── Sticky App Header ───────────────────────────────────────────────── */}
      <header style={{
        background: 'rgba(7,9,15,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{
          maxWidth: 'none', width: '100%', padding: '0 clamp(24px, 4vw, 80px)',
          height: 'clamp(60px, 5vh, 80px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {/* Logo */}
          <button onClick={() => onBack()} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0',
          }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: 'linear-gradient(135deg, #8B5CF6, #22D3EE)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Compass size={16} color="white" />
            </div>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Waypoint
            </span>
          </button>

          {/* Destination badge + New trip matching screenshot */}
          {localItinerary && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button
                id="start-over-btn"
                onClick={handleReset}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 'var(--radius-pill)',
                  padding: '7px 18px', fontSize: 13, fontWeight: 600,
                  color: 'var(--text-primary)', cursor: 'pointer',
                  fontFamily: 'var(--font-body)', transition: 'all var(--transition-fast)',
                }}
              >
                <RotateCcw size={13} /> New Trip
              </button>

              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 'var(--radius-pill)', padding: '7px 18px', fontSize: 13,
              }}>
                <MapPin size={13} color="var(--accent-light)" />
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{localItinerary.destination}</span>
                <span style={{ color: 'var(--text-muted)' }}>-</span>
                <span style={{ color: 'var(--text-secondary)' }}>{localItinerary.durationDays} Days</span>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ── Main Content ─────────────────────────────────────────────────────── */}
      <main className="planner-main-container">

        {/* Input state */}
        {status === 'idle' && <InputPanel onSubmit={generate} prefill={location.state?.prefill} />}

        {/* Loading state */}
        {status === 'loading' && <LoadingState />}

        {/* Error state */}
        {status === 'error' && <ErrorState message={error} onRetry={handleReset} />}

        {/* Success state — 3-column Editorial Dashboard view */}
        {status === 'success' && localItinerary && (
          <div className="animate-fade-in" style={{ paddingTop: 8 }}>
            <JourneyOverview
              itinerary={localItinerary}
              onRemoveStop={handleRemoveStop}
              onUpdateStop={handleUpdateStop}
              onReorderStops={handleReorderStops}
            />
          </div>
        )}
      </main>
    </div>
  )
}
