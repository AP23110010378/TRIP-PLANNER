import {
  DndContext, closestCenter, PointerSensor, TouchSensor,
  useSensor, useSensors, DragOverlay,
} from '@dnd-kit/core'
import {
  SortableContext, verticalListSortingStrategy, arrayMove,
} from '@dnd-kit/sortable'
import { restrictToVerticalAxis, restrictToParentElement } from '@dnd-kit/modifiers'
import { useState } from 'react'
import StopCard from './StopCard'
import { PackageOpen } from 'lucide-react'

export default function DayItinerary({ day, destination, onRemoveStop, onUpdateStop, onReorderStops }) {
  const [activeId, setActiveId] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } })
  )

  const stopIds = day.stops.map((s) => s.id)
  const activeStop = activeId ? day.stops.find((s) => s.id === activeId) : null

  function handleDragStart({ active }) { setActiveId(active.id) }
  function handleDragEnd({ active, over }) {
    setActiveId(null)
    if (!over || active.id === over.id) return
    const oldIndex = day.stops.findIndex((s) => s.id === active.id)
    const newIndex = day.stops.findIndex((s) => s.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return
    onReorderStops(arrayMove(day.stops, oldIndex, newIndex))
  }
  function handleDragCancel() { setActiveId(null) }

  return (
    <div id={`day-panel-${day.dayNumber}`} role="tabpanel" aria-label={`Day ${day.dayNumber}: ${day.title}`} style={{ paddingBottom: 48 }}>
      {/* Day header */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 700,
          color: 'var(--text-primary)', letterSpacing: '-0.02em',
          lineHeight: 1.2, marginBottom: 6,
        }}>
          Day {day.dayNumber}{' '}
          <span style={{
            background: 'linear-gradient(135deg, #A78BFA, #22D3EE)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            — {day.title}
          </span>
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          {day.stops.length} stop{day.stops.length !== 1 ? 's' : ''} · Drag to reorder, click to expand or edit
        </p>
      </div>

      {/* Empty day state */}
      {day.stops.length === 0 && (
        <div style={{
          textAlign: 'center', padding: '56px 32px',
          background: 'rgba(255,255,255,0.03)',
          borderRadius: 'var(--radius-xl)',
          border: '1px dashed rgba(255,255,255,0.1)',
          color: 'var(--text-muted)',
        }}>
          <PackageOpen size={36} style={{ marginBottom: 12, opacity: 0.4 }} />
          <p style={{ fontSize: 15, fontWeight: 500 }}>All stops removed</p>
          <p style={{ fontSize: 13, marginTop: 4 }}>Nothing left for this day.</p>
        </div>
      )}

      {/* Sortable stop list */}
      {day.stops.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis, restrictToParentElement]}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <SortableContext items={stopIds} strategy={verticalListSortingStrategy}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {day.stops.map((stop) => (
                <StopCard
                  key={stop.id}
                  stop={stop}
                  destination={destination}
                  onRemove={() => onRemoveStop(stop.id)}
                  onUpdate={(fields) => onUpdateStop && onUpdateStop(stop.id, fields)}
                />
              ))}
            </div>
          </SortableContext>
          <DragOverlay dropAnimation={{ duration: 200, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}>
            {activeStop ? <StopCard stop={activeStop} destination={destination} onRemove={() => {}} isOverlay /> : null}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  )
}
