import { useState } from 'react'
import { BookOpen, ChevronLeft, ChevronRight, Utensils, Compass, Sparkles } from 'lucide-react'
import { usePlaceImage } from '../hooks/usePlaceImage'

function InsightCard({ item, destination }) {
  const { imageUrl } = usePlaceImage(item.imageQuery || item.title, destination, item.category, `insight_${item.title}`)

  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid rgba(255,255,255,0.08)',
      padding: '16px',
      marginBottom: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '14px',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
    }}>
      {imageUrl && (
        <div style={{
          width: '100%', height: 140, borderRadius: 'var(--radius-md)',
          overflow: 'hidden', border: '1px solid rgba(255,255,255,0.12)',
          background: 'rgba(0,0,0,0.3)', position: 'relative',
          boxShadow: '0 6px 20px rgba(0,0,0,0.4)',
        }}>
          <img src={imageUrl} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{
            position: 'absolute', top: 10, left: 10,
            background: 'rgba(7,9,15,0.85)', backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            borderRadius: 999, padding: '4px 10px',
            fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.08em', color: 'var(--accent-light)',
            display: 'flex', alignItems: 'center', gap: 6,
            border: '1px solid rgba(255,255,255,0.15)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          }}>
            {item.category === 'food' ? <Utensils size={12} /> : <Compass size={12} />}
            {item.typeTag || 'Highlight'}
          </div>
        </div>
      )}

      <div>
        <h4 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 17, fontWeight: 600, color: 'var(--text-primary)',
          lineHeight: 1.3, marginBottom: 8,
        }}>
          {item.title}
        </h4>
        <p style={{
          fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6,
          display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical',
          overflow: 'hidden', margin: 0,
        }}>
          {item.description}
        </p>
      </div>
    </div>
  )
}

export default function DestinationInsights({ itinerary }) {
  const [currentPage, setCurrentPage] = useState(0)

  // Generate insights dynamically from the itinerary data
  const destination = itinerary.destination || 'Destination'
  
  // Extract all stops across days
  const allStops = itinerary.days.flatMap(d => d.stops)
  const foodStops = allStops.filter(s => s.category === 'food')
  const sightseeingStops = allStops.filter(s => s.category === 'sightseeing')
  
  const insightsList = [
    {
      typeTag: `Must-See: ${sightseeingStops[0]?.name || destination}`,
      title: sightseeingStops[0]?.name || `Exploring ${destination}`,
      description: sightseeingStops[0]?.description || `${destination} offers rich historical context, iconic architecture, and vibrant culture.`,
      imageQuery: sightseeingStops[0]?.name || destination,
    },
    {
      typeTag: `Flavors: ${foodStops[0]?.name || 'Local Cuisine'}`,
      title: foodStops[0]?.name || `Authentic ${destination} Flavors`,
      description: foodStops[0]?.description || `Experience local culinary traditions, street food delicacies, and traditional tea houses.`,
      imageQuery: foodStops[0]?.name || `${destination} food`,
      category: 'food',
    },
    {
      typeTag: `Landmark: ${sightseeingStops[1]?.name || 'City Center'}`,
      title: sightseeingStops[1]?.name || 'Historical District',
      description: sightseeingStops[1]?.description || `Explore bustling local markets, ancient monuments, and scenic walking corridors.`,
      imageQuery: sightseeingStops[1]?.name || destination,
    },
    {
      typeTag: `Food & Drink: ${foodStops[1]?.name || 'Dining Highlight'}`,
      title: foodStops[1]?.name || 'Local Eats',
      description: foodStops[1]?.description || `Popular spot among locals for traditional regional dishes and refreshing beverages.`,
      imageQuery: foodStops[1]?.name || destination,
      category: 'food',
    },
  ]

  const itemsPerPage = 2
  const totalPages = Math.ceil(insightsList.length / itemsPerPage)
  const currentItems = insightsList.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)

  return (
    <div>
      {/* Cards list */}
      {currentItems.map((item) => (
        <InsightCard key={item.title} item={item} destination={destination} />
      ))}

      {/* Pagination controls matching screenshot */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
        gap: 12, marginTop: 12, paddingRight: 4,
      }}>
        <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>
          Page {currentPage + 1} of {totalPages}
        </span>
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
            disabled={currentPage === 0}
            style={{
              width: 32, height: 32, borderRadius: 'var(--radius-md)',
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
              color: currentPage === 0 ? 'rgba(255,255,255,0.2)' : 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: currentPage === 0 ? 'default' : 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={currentPage === totalPages - 1}
            style={{
              width: 32, height: 32, borderRadius: 'var(--radius-md)',
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
              color: currentPage === totalPages - 1 ? 'rgba(255,255,255,0.2)' : 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: currentPage === totalPages - 1 ? 'default' : 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
