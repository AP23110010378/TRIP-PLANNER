import { useState } from 'react'
import {
  Compass, Calendar, BookOpen, ChevronDown, Trash2, Edit3, Star
} from 'lucide-react'
import TripMap from './TripMap'
import TripSummary from './TripSummary'
import DestinationInsights from './DestinationInsights'
import DayItinerary from './DayItinerary'

const DAY_COLORS = [
  '#8B5CF6', '#22D3EE', '#34D399', '#FBBF24', '#FB7185', '#A78BFA', '#FB923C'
]

/* ── Individual Day Block in Timeline ───────────────────────── */
function DayTimelineBlock({ day, dayIdx, destination, isSelected, onSelectDay, onRemoveStop, onUpdateStop, onReorderStops }) {
  const [isExpanded, setIsExpanded] = useState(true)
  const color = DAY_COLORS[dayIdx % DAY_COLORS.length]
  const highlight = day.stops.find(s => s.category === 'sightseeing') || day.stops[0]

  return (
    <div style={{ position: 'relative', paddingLeft: 32, marginBottom: 28 }}>
      {/* Glowing vertical node dot on the left timeline line */}
      <div style={{
        position: 'absolute', left: 0, top: 12, width: 14, height: 14,
        borderRadius: '50%', background: color,
        boxShadow: isSelected ? `0 0 16px ${color}, 0 0 24px ${color}` : `0 0 12px ${color}`,
        border: isSelected ? '3px solid #FFFFFF' : '3px solid #07090F', zIndex: 2,
        transition: 'all 0.3s ease',
      }} />

      {/* Main Day Card Container */}
      <div
        id={`day-card-${day.dayNumber}`}
        style={{
          background: isSelected ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: 'var(--radius-xl)',
          border: isSelected ? `1.5px solid ${color}` : '1px solid rgba(255,255,255,0.09)',
          boxShadow: isSelected ? `0 8px 32px rgba(0,0,0,0.4), 0 0 20px ${color}33` : 'none',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
        }}
      >
        {/* Day Card Header */}
        <div style={{
          padding: '16px 20px',
          background: isSelected ? `linear-gradient(90deg, ${color}22, rgba(255,255,255,0.02))` : 'rgba(255,255,255,0.03)',
          borderBottom: isExpanded ? '1px solid rgba(255,255,255,0.06)' : 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          cursor: 'pointer',
        }}
        onClick={() => onSelectDay(isSelected ? 'all' : day.id)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              background: color, color: 'white',
              borderRadius: 'var(--radius-pill)', padding: '4px 14px',
              fontSize: 12, fontWeight: 700, letterSpacing: '0.04em',
              boxShadow: isSelected ? `0 0 10px ${color}` : 'none',
            }}>
              DAY {day.dayNumber}
            </div>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>
              {day.stops.length} stops
            </span>
            {isSelected && (
              <span style={{
                fontSize: 11, fontWeight: 700, color: color,
                background: 'rgba(255,255,255,0.1)',
                padding: '2px 8px', borderRadius: 10,
                display: 'flex', alignItems: 'center', gap: 4,
              }}>
                📍 Map Active
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsExpanded(!isExpanded)
              }}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--text-muted)', padding: 4, display: 'flex', alignItems: 'center',
              }}
            >
              <ChevronDown size={18} style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>
          </div>
        </div>

        {/* Day Header Title */}
        <div style={{ padding: '14px 20px 6px' }}>
          <h3 style={{
            fontFamily: 'var(--font-heading)', fontSize: 17, fontWeight: 600,
            color: 'var(--text-primary)', margin: 0, lineHeight: 1.3,
          }}>
            {day.title || `Day ${day.dayNumber} Itinerary`}
          </h3>
          {highlight && (
            <p style={{ fontSize: 11, color: color, fontWeight: 600, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Star size={11} fill="currentColor" /> {highlight.name}
            </p>
          )}
        </div>

        {/* Day Stops (Expanded list) */}
        {isExpanded && (
          <div style={{ padding: '12px 16px 20px' }}>
            <DayItinerary
              day={day}
              destination={destination}
              onRemoveStop={onRemoveStop}
              onUpdateStop={onUpdateStop}
              onReorderStops={onReorderStops}
            />
          </div>
        )}
      </div>
    </div>
  )
}

/* ── 3-Column Dashboard Component ───────────────────────────── */
export default function JourneyOverview({ itinerary, onRemoveStop, onUpdateStop, onReorderStops }) {
  const [selectedDayId, setSelectedDayId] = useState('all')

  return (
    <div className="dashboard-grid">
      {/* ── Column 1: EXPLORE & ROUTE ────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          marginBottom: 16, color: 'var(--text-primary)',
        }}>
          <Compass size={18} color="var(--accent-light)" />
          <h2 style={{
            fontSize: 14, fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.1em', fontFamily: 'var(--font-heading)', margin: 0,
          }}>
            EXPLORE & ROUTE
          </h2>
        </div>

        {/* Leaflet Map */}
        <TripMap itinerary={itinerary} selectedDayId={selectedDayId} onSelectDay={setSelectedDayId} />

        {/* Trip Summary Card */}
        <TripSummary itinerary={itinerary} />
      </div>

      {/* ── Column 2: DAY-BY-DAY TIMELINE ────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          marginBottom: 16, color: 'var(--text-primary)',
        }}>
          <Calendar size={18} color="#22D3EE" />
          <h2 style={{
            fontSize: 14, fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.1em', fontFamily: 'var(--font-heading)', margin: 0,
          }}>
            DAY-BY-DAY TIMELINE
          </h2>
        </div>

        {/* Timeline Container with vertical connecting line */}
        <div style={{ position: 'relative' }}>
          {/* Continuous vertical timeline line */}
          <div style={{
            position: 'absolute', left: 6, top: 12, bottom: 20, width: 2,
            background: 'rgba(255,255,255,0.1)', zIndex: 1,
          }} />

          {/* Days */}
          {itinerary.days.map((day, idx) => {
            const isSelected = selectedDayId === day.id || selectedDayId === day.dayNumber
            return (
              <DayTimelineBlock
                key={day.id}
                day={day}
                dayIdx={idx}
                destination={itinerary.destination}
                isSelected={isSelected}
                onSelectDay={setSelectedDayId}
                onRemoveStop={(stopId) => onRemoveStop(day.id, stopId)}
                onUpdateStop={(stopId, fields) => onUpdateStop(day.id, stopId, fields)}
                onReorderStops={(newStops) => onReorderStops(day.id, newStops)}
              />
            )
          })}
        </div>
      </div>

      {/* ── Column 3: DESTINATION INSIGHTS ──────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          marginBottom: 16, color: 'var(--text-primary)',
        }}>
          <BookOpen size={18} color="#34D399" />
          <h2 style={{
            fontSize: 14, fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.1em', fontFamily: 'var(--font-heading)', margin: 0,
          }}>
            DESTINATION INSIGHTS
          </h2>
        </div>

        <DestinationInsights itinerary={itinerary} />
      </div>
    </div>
  )
}

