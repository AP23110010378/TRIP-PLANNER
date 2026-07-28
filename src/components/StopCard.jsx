import { useState, useRef } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  GripVertical, X, ChevronDown,
  MapPin, Utensils, Train, Zap, Coffee, MoreHorizontal, Image as ImageIcon
} from 'lucide-react'
import { usePlaceImage } from '../hooks/usePlaceImage'

const CATEGORY_CONFIG = {
  sightseeing: { icon: <MapPin size={13} />,       color: '#60A5FA', bg: 'rgba(96,165,250,0.12)',  label: 'Sightseeing' },
  food:        { icon: <Utensils size={13} />,     color: '#FB923C', bg: 'rgba(251,146,60,0.12)',  label: 'Food & Drink' },
  transport:   { icon: <Train size={13} />,        color: '#94A3B8', bg: 'rgba(148,163,184,0.12)', label: 'Transport' },
  activity:    { icon: <Zap size={13} />,          color: '#34D399', bg: 'rgba(52,211,153,0.12)',  label: 'Activity' },
  rest:        { icon: <Coffee size={13} />,       color: '#A78BFA', bg: 'rgba(167,139,250,0.12)', label: 'Rest' },
  other:       { icon: <MoreHorizontal size={13} />, color: '#CBD5E1', bg: 'rgba(203,213,225,0.08)', label: 'Other' },
}

export default function StopCard({ stop, destination, onRemove, isOverlay = false }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)
  const removeTimerRef = useRef(null)

  // Fetch image unconditionally so it shows in the collapsed view
  const { imageUrl, loading } = usePlaceImage(stop.name, destination, stop.category, stop.id)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: stop.id, disabled: isOverlay,
  })

  const style = { transform: CSS.Transform.toString(transform), transition }
  const cat = CATEGORY_CONFIG[stop.category] || CATEGORY_CONFIG.other

  const handleRemove = (e) => {
    e.stopPropagation()
    if (isRemoving) return
    setIsRemoving(true)
    removeTimerRef.current = setTimeout(() => onRemove(), 340)
  }

  const handleToggleExpand = () => {
    if (isRemoving) return
    setIsExpanded((prev) => !prev)
  }

  return (
    <div ref={isOverlay ? undefined : setNodeRef} style={{ ...style, opacity: isDragging ? 0.3 : 1 }}>
      <div
        className={isRemoving ? 'stop-card-removing' : isOverlay ? 'stop-card-dragging' : ''}
        style={{
          background: isOverlay ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: 'var(--radius-md)',
          border: `1px solid ${isOverlay ? 'rgba(139,92,246,0.4)' : 'rgba(255,255,255,0.08)'}`,
          overflow: 'hidden',
          transition: isRemoving ? 'none' : 'all var(--transition-fast)',
        }}
        onMouseOver={(e) => {
          if (!isRemoving && !isOverlay) {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'
            e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
          }
        }}
        onMouseOut={(e) => {
          if (!isRemoving && !isOverlay) {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
            e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
          }
        }}
      >
        {/* Card header */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* Drag handle */}
          <button
            {...(isOverlay ? {} : { ...attributes, ...listeners })}
            aria-label="Drag to reorder"
            tabIndex={isOverlay ? -1 : 0}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 28, flexShrink: 0, alignSelf: 'stretch',
              background: 'none', border: 'none',
              cursor: isOverlay ? 'grabbing' : 'grab',
              color: 'rgba(255,255,255,0.2)', padding: 0,
              transition: 'color var(--transition-fast)', touchAction: 'none',
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
            onMouseOut={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.2)')}
          >
            <GripVertical size={14} />
          </button>

          {/* Left accent bar */}
          <div style={{
            width: 3, alignSelf: 'stretch', background: cat.color,
            flexShrink: 0, borderRadius: '2px 0 0 2px',
            boxShadow: `0 0 8px ${cat.color}60`,
          }} />

          {/* Main clickable area */}
          <button
            onClick={handleToggleExpand}
            aria-expanded={isExpanded}
            aria-controls={`stop-desc-${stop.id}`}
            style={{
              flex: 1, background: 'none', border: 'none', cursor: 'pointer',
              padding: '12px 10px 12px 12px',
              display: 'flex', alignItems: 'center', gap: 10,
              textAlign: 'left', minWidth: 0, minHeight: 54,
            }}
          >
            {/* Category icon */}
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: cat.bg, border: `1px solid ${cat.color}25`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: cat.color, flexShrink: 0,
            }}>
              {cat.icon}
            </div>

            {/* Full Name + time (NO truncation / NO line clamp) */}
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <p style={{
                fontSize: 14, fontWeight: 600, color: 'var(--text-primary)',
                lineHeight: 1.35, wordBreak: 'break-word', overflowWrap: 'break-word',
                whiteSpace: 'normal', margin: 0,
              }}>
                {stop.name}
              </p>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500, margin: 0 }}>
                {stop.time}
              </p>
            </div>

            {/* Thumbnail Image (Compact 58x46px high-res photo container) */}
            <div style={{
              width: 58, height: 46, borderRadius: 8,
              background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.12)',
              overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative', flexShrink: 0, marginLeft: 2, marginRight: 2,
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            }}>
              {loading && (
                <div className="animate-spin" style={{
                  width: 16, height: 16, borderRadius: '50%',
                  border: '2px solid rgba(255,255,255,0.1)', borderTopColor: cat.color,
                }} />
              )}
              {!loading && imageUrl && (
                <img
                  src={imageUrl}
                  alt={stop.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  className="animate-fade-in"
                />
              )}
              {!loading && !imageUrl && (
                <ImageIcon size={18} color="var(--text-muted)" style={{ opacity: 0.4 }} />
              )}
            </div>

            {/* Expand / Collapse icon */}
            <div style={{
              width: 26, height: 26, borderRadius: 6,
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'rgba(255,255,255,0.5)', flexShrink: 0,
            }}>
              <ChevronDown size={14} style={{
                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform var(--transition-base)',
              }} />
            </div>
          </button>

          {/* Remove button */}
          <button
            onClick={handleRemove}
            aria-label={`Remove ${stop.name}`}
            disabled={isRemoving}
            style={{
              width: 32, minHeight: 54, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'none', border: 'none',
              borderLeft: '1px solid rgba(255,255,255,0.06)',
              cursor: isRemoving ? 'not-allowed' : 'pointer',
              color: 'rgba(255,255,255,0.25)', transition: 'all var(--transition-fast)',
            }}
            onMouseOver={(e) => {
              if (!isRemoving) {
                e.currentTarget.style.color = '#F87171'
                e.currentTarget.style.background = 'rgba(248,113,113,0.1)'
              }
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = 'rgba(255,255,255,0.25)'
              e.currentTarget.style.background = 'none'
            }}
          >
            <X size={13} />
          </button>
        </div>

        {/* Expandable details with Hero Photo */}
        <div
          id={`stop-desc-${stop.id}`}
          className={`stop-description ${isExpanded ? 'open' : ''}`}
          aria-hidden={!isExpanded}
        >
          <div style={{
            padding: '14px 16px 16px 16px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', flexDirection: 'column', gap: 14,
          }}>
            {imageUrl && (
              <div style={{
                width: '100%', height: 180, borderRadius: 12,
                overflow: 'hidden', position: 'relative',
                border: '1px solid rgba(255,255,255,0.12)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
              }}>
                <img
                  src={imageUrl}
                  alt={stop.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(180deg, transparent 40%, rgba(7,9,15,0.85) 100%)',
                  display: 'flex', alignItems: 'flex-end', padding: '12px 16px',
                }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#FFFFFF', textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
                    📍 {stop.name}
                  </span>
                </div>
              </div>
            )}
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
              {stop.description || 'No additional details available.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
