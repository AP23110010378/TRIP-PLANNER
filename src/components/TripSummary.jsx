import { Hourglass, MapPin, BookOpen } from 'lucide-react'

export default function TripSummary({ itinerary }) {
  const totalStops = itinerary.days.reduce((acc, d) => acc + d.stops.length, 0)
  
  // Extract 2-3 major stops (prioritizing sightseeing category)
  const majorStops = itinerary.days
    .flatMap(d => d.stops)
    .filter(s => s.category === 'sightseeing' || s.category === 'activity')
    .map(s => s.name)
    .slice(0, 3)

  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderRadius: 'var(--radius-xl)',
      border: '1px solid rgba(255,255,255,0.08)',
      padding: '24px',
      marginTop: '16px',
    }}>
      <h4 style={{
        fontSize: 12, fontWeight: 700, textTransform: 'uppercase',
        letterSpacing: '0.12em', color: 'var(--text-muted)', marginBottom: 16,
      }}>
        TRIP SUMMARY
      </h4>

      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr', gap: 16, alignItems: 'start',
      }}>
        {/* Duration */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 6 }}>
            <Hourglass size={12} color="var(--accent-light)" />
            <span>DURATION</span>
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
            {itinerary.durationDays} Days
          </div>
        </div>

        {/* Total Stops */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 6 }}>
            <MapPin size={12} color="#22D3EE" />
            <span>TOTAL STOPS</span>
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
            {totalStops}
          </div>
        </div>

        {/* Major Stops */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 6 }}>
            <BookOpen size={12} color="#34D399" />
            <span>MAJOR STOPS</span>
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500, lineHeight: 1.4 }}>
            {majorStops.length > 0 ? majorStops.join('\n') : itinerary.destination}
          </div>
        </div>
      </div>
    </div>
  )
}
