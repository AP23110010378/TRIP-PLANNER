import { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

/* ── Day color palette (matches JourneyOverview) ────────────── */
const DAY_COLORS = [
  '#8B5CF6', // violet
  '#22D3EE', // cyan
  '#34D399', // emerald
  '#FBBF24', // amber
  '#FB7185', // rose
  '#A78BFA', // purple
  '#FB923C', // orange
]

/* ── In-memory geocoding cache ──────────────────────────────── */
const geoCache = {}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function fetchNominatim(query) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&accept-language=en`
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'WaypointTripPlanner/1.0 (educational)' },
    })
    const data = await res.json()
    if (data?.[0]) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
    }
  } catch {
    // ignore
  }
  return null
}

async function geocodePlace(name, destination, stopIdx = 0) {
  const key = `${name}||${destination}`
  if (key in geoCache && geoCache[key]) return geoCache[key]

  // 1. Direct search
  let result = await fetchNominatim(`${name}, ${destination}`)

  // 2. Remove apostrophes (e.g. "Shinjuku's Golden Gai" -> "Shinjuku Golden Gai")
  if (!result && name.includes("'")) {
    const cleanName = name.replace(/'s?/g, '')
    result = await fetchNominatim(`${cleanName}, ${destination}`)
  }

  // 3. Strip generic non-location terms
  if (!result) {
    const simplified = name
      .replace(/(street food|food|market|exploration|tour|visit|district|area|walk|lunch|dinner|breakfast)/gi, '')
      .replace(/'s?/g, '')
      .trim()
    if (simplified && simplified.length > 2) {
      result = await fetchNominatim(`${simplified}, ${destination}`)
    }
  }

  // 4. Fallback to destination with deterministic spread offset so NO stop is ever missing
  if (!result) {
    let destCoords = geoCache[destination]
    if (!destCoords) {
      destCoords = await fetchNominatim(destination)
      if (destCoords) geoCache[destination] = destCoords
    }
    if (destCoords) {
      const hash = (name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + stopIdx * 7) % 100
      const offsetLat = ((hash % 10) - 5) * 0.005
      const offsetLng = (Math.floor(hash / 10) - 5) * 0.005
      result = { lat: destCoords.lat + offsetLat, lng: destCoords.lng + offsetLng }
    }
  }

  if (result) {
    geoCache[key] = result
  }
  return result
}

/* ── Auto-fit map bounds ─────────────────────────────────────── */
function FitBounds({ positions }) {
  const map = useMap()
  useEffect(() => {
    if (positions.length > 0) {
      map.fitBounds(positions, { padding: [48, 48] })
    }
  }, [map, positions])
  return null
}

/* ── Loading bar shown while geocoding ──────────────────────── */
function MapLoader({ progress, total, done }) {
  return (
    <div style={{
      height: 520, borderRadius: 'var(--radius-xl)',
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.08)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 20,
    }}>
      {/* Spinning globe */}
      <div style={{ fontSize: 48, animation: 'float 2s ease-in-out infinite' }}>🗺️</div>

      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
          Locating places on the map…
        </p>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          {done} / {total} stops geocoded
        </p>
      </div>

      {/* Progress bar */}
      <div style={{ width: 240, height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: 2,
          background: 'linear-gradient(90deg, #8B5CF6, #22D3EE)',
          width: `${progress}%`,
          transition: 'width 0.4s ease',
        }} />
      </div>
    </div>
  )
}

/* ── Custom popup CSS injected once ─────────────────────────── */
const POPUP_STYLE_ID = 'waypoint-leaflet-popup'
function injectPopupStyles() {
  if (document.getElementById(POPUP_STYLE_ID)) return
  const style = document.createElement('style')
  style.id = POPUP_STYLE_ID
  style.textContent = `
    .leaflet-popup-content-wrapper {
      background: rgba(13, 17, 32, 0.92) !important;
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255,255,255,0.12) !important;
      border-radius: 12px !important;
      box-shadow: 0 8px 32px rgba(0,0,0,0.6) !important;
      color: #F1F5F9 !important;
      padding: 0 !important;
    }
    .leaflet-popup-content {
      margin: 0 !important;
    }
    .leaflet-popup-tip {
      background: rgba(13,17,32,0.92) !important;
    }
    .leaflet-popup-close-button {
      color: rgba(255,255,255,0.5) !important;
      font-size: 18px !important;
      top: 6px !important;
      right: 8px !important;
    }
    .leaflet-container {
      background: #07090F;
      font-family: 'Inter', system-ui, sans-serif;
    }
    .leaflet-control-zoom a {
      background: rgba(13,17,32,0.9) !important;
      color: #F1F5F9 !important;
      border-color: rgba(255,255,255,0.12) !important;
    }
    .leaflet-control-attribution {
      background: rgba(7,9,15,0.7) !important;
      color: rgba(255,255,255,0.3) !important;
      font-size: 10px !important;
    }
    .leaflet-control-attribution a { color: rgba(255,255,255,0.4) !important; }

    .custom-map-marker {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      color: white;
      font-weight: 800;
      font-family: 'Inter', system-ui, sans-serif;
      box-shadow: 0 4px 12px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(0,0,0,0.1);
      border: 2px solid white;
      text-shadow: 0 1px 2px rgba(0,0,0,0.8);
    }
  `
  document.head.appendChild(style)
}

/* ── Popup content component ─────────────────────────────────── */
function StopPopup({ stop, day, color }) {
  const CAT_EMOJI = {
    sightseeing: '🗺️', food: '🍜', transport: '🚄',
    activity: '⚡', rest: '☕', other: '📍',
  }
  return (
    <div style={{ padding: '14px 16px', minWidth: 190 }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 8
      }}>
        <span style={{
          background: color,
          color: 'white',
          borderRadius: 999, padding: '2px 10px',
          fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}>
          Day {day.dayNumber}
        </span>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>
          Stop #{stop.overallNumber}
        </span>
      </div>
      <p style={{ fontSize: 14, fontWeight: 700, color: '#F1F5F9', lineHeight: 1.3, marginBottom: 4 }}>
        {stop.name}
      </p>
      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', display: 'flex', gap: 6, margin: 0 }}>
        <span>{CAT_EMOJI[stop.category] || '📍'} {stop.time}</span>
      </p>
    </div>
  )
}

/* ── Main TripMap component ──────────────────────────────────── */
export default function TripMap({ itinerary, selectedDayId = 'all', onSelectDay }) {
  const [geocodedDays, setGeocodedDays] = useState(null)
  const [doneCount, setDoneCount] = useState(0)
  const [error, setError] = useState(false)
  const cancelRef = useRef(false)

  const totalStops = itinerary.days.reduce((sum, d) => sum + d.stops.length, 0)

  useEffect(() => {
    cancelRef.current = false
    injectPopupStyles()
    setGeocodedDays(null)
    setDoneCount(0)
    setError(false)

    async function run() {
      const result = []
      let count = 0

      for (const day of itinerary.days) {
        const dayStops = []
        for (const stop of day.stops) {
          if (cancelRef.current) return
          const coords = await geocodePlace(stop.name, itinerary.destination, count)
          dayStops.push({ ...stop, coords })
          count++
          setDoneCount(count)
          await sleep(280) // Safe geocode rate limit
        }
        result.push({ ...day, stops: dayStops })
      }

      if (!cancelRef.current) {
        const anySuccess = result.some(d => d.stops.some(s => s.coords))
        if (!anySuccess) setError(true)
        else setGeocodedDays(result)
      }
    }

    run()
    return () => { cancelRef.current = true }
  }, [itinerary])

  /* ── Loading ── */
  if (!geocodedDays) {
    if (error) {
      return (
        <div style={{
          height: 200, borderRadius: 'var(--radius-xl)',
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--text-muted)', fontSize: 14,
        }}>
          ⚠️ Could not load map locations. Check your connection.
        </div>
      )
    }
    return (
      <MapLoader
        progress={totalStops > 0 ? Math.round((doneCount / totalStops) * 100) : 0}
        total={totalStops}
        done={doneCount}
      />
    )
  }

  // Calculate per-day AND overall continuous stop numbers (1..N across all days)
  let globalStopCounter = 1;
  const daysWithNumbers = geocodedDays.map((day) => {
    let dayStopCounter = 1;
    return {
      ...day,
      stops: day.stops.map(stop => {
        const overallNumber = globalStopCounter++;
        const dayStopNumber = dayStopCounter++;
        return {
          ...stop,
          overallNumber,
          dayStopNumber,
        }
      })
    }
  });

  /* ── Filter days based on selectedDayId ── */
  const isAll = selectedDayId === 'all' || !selectedDayId
  const daysToRender = isAll
    ? daysWithNumbers
    : daysWithNumbers.filter(d => d.id === selectedDayId || d.dayNumber === selectedDayId)

  const activePoints = daysToRender.flatMap(d =>
    d.stops.filter(s => s.coords).map(s => [s.coords.lat, s.coords.lng])
  )
  const allPoints = daysWithNumbers.flatMap(d =>
    d.stops.filter(s => s.coords).map(s => [s.coords.lat, s.coords.lng])
  )

  return (
    <div style={{
      borderRadius: 'var(--radius-xl)', overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.1)',
      boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(139,92,246,0.1)',
      height: 540, position: 'relative',
    }}>
      {/* Top Floating Day Selector Toolbar */}
      <div style={{
        position: 'absolute', top: 14, left: 14, right: 14, zIndex: 1000,
        display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap',
        background: 'rgba(7,9,15,0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 12, padding: '8px 12px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
      }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginRight: 4 }}>
          Map View:
        </span>
        <button
          id="map-filter-all"
          onClick={() => onSelectDay && onSelectDay('all')}
          style={{
            background: isAll ? 'linear-gradient(135deg, #8B5CF6, #6366F1)' : 'rgba(255,255,255,0.06)',
            color: isAll ? '#FFFFFF' : 'rgba(255,255,255,0.7)',
            border: isAll ? '1px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.08)',
            borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 700,
            cursor: 'pointer', transition: 'all 0.2s ease',
            boxShadow: isAll ? '0 0 12px rgba(139,92,246,0.4)' : 'none',
          }}
        >
          🌐 All Days
        </button>
        {geocodedDays.map((day, idx) => {
          const isSelected = selectedDayId === day.id || selectedDayId === day.dayNumber
          const color = DAY_COLORS[idx % DAY_COLORS.length]
          return (
            <button
              key={day.id}
              id={`map-filter-day-${day.dayNumber}`}
              onClick={() => onSelectDay && onSelectDay(isSelected ? 'all' : day.id)}
              style={{
                background: isSelected ? color : 'rgba(255,255,255,0.06)',
                color: isSelected ? '#FFFFFF' : 'rgba(255,255,255,0.7)',
                border: isSelected ? '1px solid #FFFFFF' : '1px solid rgba(255,255,255,0.08)',
                borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 700,
                cursor: 'pointer', transition: 'all 0.2s ease',
                display: 'flex', alignItems: 'center', gap: 6,
                boxShadow: isSelected ? `0 0 12px ${color}88` : 'none',
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: isSelected ? '#FFFFFF' : color }} />
              Day {day.dayNumber}
            </button>
          )
        })}
      </div>

      <MapContainer
        center={[allPoints[0]?.[0] ?? 35.6, allPoints[0]?.[1] ?? 139.7]}
        zoom={12}
        style={{ height: '100%', width: '100%', paddingTop: 50 }}
        zoomControl={true}
        scrollWheelZoom={true}
      >
        {/* Dark CartoDB tiles */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> &copy; <a href="https://carto.com">CARTO</a>'
          maxZoom={19}
        />

        {/* Auto-fit to active marker bounds */}
        {activePoints.length > 0 && <FitBounds positions={activePoints} />}

        {/* ── Draw connections BETWEEN days (only in All Days view) ── */}
        {isAll && daysWithNumbers.map((day, dayIdx) => {
          if (dayIdx === 0) return null
          
          const prevDayValidStops = daysWithNumbers[dayIdx - 1].stops.filter(s => s.coords)
          const currDayValidStops = day.stops.filter(s => s.coords)
          
          if (prevDayValidStops.length > 0 && currDayValidStops.length > 0) {
            const lastOfPrev = prevDayValidStops[prevDayValidStops.length - 1].coords
            const firstOfCurr = currDayValidStops[0].coords
            return (
              <Polyline
                key={`conn-${day.id}`}
                positions={[[lastOfPrev.lat, lastOfPrev.lng], [firstOfCurr.lat, firstOfCurr.lng]]}
                pathOptions={{
                  color: 'rgba(255,255,255,0.3)',
                  weight: 2,
                  dashArray: '4, 8',
                }}
              />
            )
          }
          return null
        })}

        {/* ── Render Polylines & Markers for daysToRender ── */}
        {daysToRender.map((day) => {
          const dayIdx = geocodedDays.findIndex(d => d.id === day.id)
          const color = DAY_COLORS[dayIdx >= 0 ? dayIdx % DAY_COLORS.length : 0]
          const validStops = day.stops.filter(s => s.coords)
          const dayCoords = validStops.map(s => [s.coords.lat, s.coords.lng])

          return (
            <div key={day.id}>
              {/* Route polyline FOR the day */}
              {dayCoords.length > 1 && (
                <Polyline
                  positions={dayCoords}
                  pathOptions={{
                    color,
                    weight: 4,
                    opacity: 0.9,
                  }}
                />
              )}

              {/* Stop markers */}
              {validStops.map((stop, stopIdx) => {
                const isFirst = stopIdx === 0;
                const size = 30; // Make markers prominent
                
                // Show overall stop number (1..20) in Overall View, and day stop number (1..4) in Day View
                const displayNumber = isAll ? stop.overallNumber : stop.dayStopNumber;

                const icon = L.divIcon({
                  className: 'custom-map-marker',
                  html: `<div style="background: ${color}; width: 100%; height: 100%; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 800; box-shadow: 0 0 10px ${color}">${displayNumber}</div>`,
                  iconSize: [size, size],
                  iconAnchor: [size/2, size/2],
                });

                return (
                  <Marker
                    key={stop.id}
                    position={[stop.coords.lat, stop.coords.lng]}
                    icon={icon}
                    zIndexOffset={isFirst ? 1000 : 0}
                  >
                    <Popup>
                      <StopPopup stop={stop} day={day} color={color} />
                    </Popup>
                  </Marker>
                )
              })}
            </div>
          )
        })}
      </MapContainer>

      {/* Day legend & Status overlay (bottom-left inside map) */}
      <div style={{
        position: 'absolute', bottom: 20, left: 16, zIndex: 1000,
        background: 'rgba(7,9,15,0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 12, padding: '12px 16px',
        display: 'flex', flexDirection: 'column', gap: 6,
        minWidth: 120,
        boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', margin: 0 }}>
            {isAll ? 'ALL STOPS' : `DAY ${daysToRender[0]?.dayNumber} STOPS`}
          </p>
          {!isAll && (
            <button
              onClick={() => onSelectDay && onSelectDay('all')}
              style={{
                background: 'none', border: 'none', color: '#22D3EE',
                fontSize: 10, fontWeight: 700, cursor: 'pointer', padding: 0,
                textDecoration: 'underline',
              }}
            >
              Show All
            </button>
          )}
        </div>
        {daysToRender.map((day) => {
          const idx = geocodedDays.findIndex(d => d.id === day.id)
          const color = DAY_COLORS[idx >= 0 ? idx % DAY_COLORS.length : 0]
          return (
            <div key={day.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: color,
                boxShadow: `0 0 6px ${color}`,
                flexShrink: 0,
              }} />
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>
                Day {day.dayNumber} ({day.stops.length} stops)
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}


