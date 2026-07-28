import { useState, useEffect } from 'react'

const assignedPhotoMap = new Map()

// Clean action phrases from place titles (e.g. "Breakfast at Khan Bawarchi" -> "Khan Bawarchi")
function cleanPlaceTitle(rawName) {
  if (!rawName) return ''
  return rawName
    .replace(/^(breakfast|lunch|dinner|snack|coffee|tea|food|meal)\s+(at|in|near)\s+/i, '')
    .replace(/^(visit|explore|stroll|walk|shopping|tour|trip)\s+(to|at|in|around|along)\s+/i, '')
    .replace(/^(evening|morning|afternoon|night)\s+(stroll|walk|tour|visit)\s+(at|along|in|around|to)\s+/i, '')
    .trim()
}

// Check if a stop is a generic non-landmarked activity (e.g. "Dinner at a local hotel", "Lunch at a local cafe")
function isGenericPlaceName(name) {
  if (!name) return true
  const lower = name.toLowerCase()
  return (
    lower.includes('local hotel') ||
    lower.includes('local cafe') ||
    lower.includes('local café') ||
    lower.includes('local restaurant') ||
    lower.includes('local market') ||
    lower.includes('check-in') ||
    lower.includes('relax at') ||
    lower.includes('rest at') ||
    lower.includes('local eatery') ||
    lower.includes('street food stall')
  )
}

// Region-specific high-resolution authentic travel & food photography pools (Zero anime/maps/stations)
const REGION_PHOTO_POOLS = {
  india: {
    food: [
      'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1000&q=80', // Hyderabadi Biryani
      'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1000&q=80', // Dosa / South Indian
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1000&q=80', // Samosa / Chaat
      'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1000&q=80', // Indian Curry feast
      'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=1000&q=80', // Indian thali meal
      'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?auto=format&fit=crop&w=1000&q=80', // Chicken biryani pot
      'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=1000&q=80', // Indian Naan & Paneer
    ],
    sightseeing: [
      'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1000&q=80', // Charminar / Heritage
      'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1000&q=80', // Taj Mahal / Palace
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1000&q=80', // Indian Fort
      'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=1000&q=80', // Lake / City view
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=80', // South Indian Temple
    ]
  },
  japan: {
    food: [
      'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1000&q=80', // Ramen bowl
      'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=1000&q=80', // Sushi
      'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=1000&q=80', // Gyoza
      'https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?auto=format&fit=crop&w=1000&q=80', // Yakitori
    ],
    sightseeing: [
      'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1000&q=80', // Tokyo Tower
      'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=1000&q=80', // Shibuya Crossing
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1000&q=80', // Pagoda / Shrine
      'https://images.unsplash.com/photo-1528164344705-47542687990d?auto=format&fit=crop&w=1000&q=80', // Torii Gate
    ]
  },
  general: {
    food: [
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80', // Gourmet dish
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80', // Restaurant interior
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80', // Dining table
    ],
    sightseeing: [
      'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1000&q=80', // Travel landscape
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1000&q=80', // Scenic view
      'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1000&q=80', // City skyline
    ]
  }
}

function detectRegion(destination) {
  const destLower = (destination || '').toLowerCase()
  if (destLower.includes('hyderabad') || destLower.includes('india') || destLower.includes('delhi') || destLower.includes('mumbai') || destLower.includes('bangalore') || destLower.includes('chennai') || destLower.includes('goa')) {
    return 'india'
  }
  if (destLower.includes('tokyo') || destLower.includes('japan') || destLower.includes('kyoto') || destLower.includes('osaka')) {
    return 'japan'
  }
  return 'general'
}

function getRelevantFallbackPhoto(cardId, placeName, destination, category) {
  if (assignedPhotoMap.has(cardId)) {
    return assignedPhotoMap.get(cardId)
  }

  const region = detectRegion(destination)
  const pools = REGION_PHOTO_POOLS[region] || REGION_PHOTO_POOLS.general
  const nameLower = (placeName || '').toLowerCase()

  let poolKey = 'sightseeing'
  if (nameLower.includes('food') || nameLower.includes('biryani') || nameLower.includes('ramen') || nameLower.includes('sushi') || nameLower.includes('breakfast') || nameLower.includes('lunch') || nameLower.includes('dinner') || nameLower.includes('hotel') || nameLower.includes('bawarchi') || nameLower.includes('shadab') || category === 'food') {
    poolKey = 'food'
  }

  const pool = pools[poolKey] || pools.sightseeing
  const usedInSession = new Set(assignedPhotoMap.values())
  let selected = pool.find(url => !usedInSession.has(url))
  if (!selected) {
    const hash = Math.abs(cardId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)) % pool.length
    selected = pool[hash]
  }

  assignedPhotoMap.set(cardId, selected)
  return selected
}

async function fetchWikipediaPhoto(placeName, destination, category) {
  // If it's a generic phrase (e.g. "Dinner at a local hotel"), skip Wikipedia to prevent random municipal/metro photos
  if (isGenericPlaceName(placeName)) {
    return null
  }

  const cleanName = cleanPlaceTitle(placeName)
  if (!cleanName) return null

  const isFoodOrHotel = category === 'food' || /biryani|restaurant|hotel|cafe|bakery|dosa|idli|eats|food|curry|kebabs|thali|breakfast|lunch|dinner|tiffin|eatery/i.test(placeName)

  const isUnwantedImage = (src) => {
    if (!src) return true
    if (/\.svg$/i.test(src)) return true
    // Filter out vector maps, logos, flags, illustrations, diagrams
    if (/logo|map|diagram|flag|icon|illustration|anime|drawing|cartoon|coat_of_arms|honshu|prefecture|location/i.test(src)) return true

    // For food & hotel stops, strictly reject metro stations, government buildings, municipal corporations, bridges, flyovers, courts, offices
    if (isFoodOrHotel) {
      if (/station|metro|municipal|corporation|flyover|bridge|building|academy|court|police|hospital|office|depot|junction/i.test(src)) {
        return true
      }
    }
    return false
  }

  // 1. Try Direct REST Summary API first with clean name (e.g. "Charminar", "Hussain_Sagar", "Mecca_Masjid", "Paradise_Biryani")
  const searchCandidates = [
    cleanName,
    `${cleanName}_${destination}`,
  ]

  for (const candidate of searchCandidates) {
    try {
      const cleanTitle = candidate.trim().replace(/\s+/g, '_')
      const restUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cleanTitle)}`
      const restRes = await fetch(restUrl)
      if (restRes.ok) {
        const restData = await restRes.json()
        const imgObj = restData.originalimage || restData.thumbnail
        if (imgObj && imgObj.source) {
          const src = imgObj.source
          if (!isUnwantedImage(src)) {
            return src
          }
        }
      }
    } catch {
      // try next candidate
    }
  }

  // 2. Wikipedia Generator Search API sorted strictly by relevance index (1..N)
  try {
    const searchQuery = `${cleanName} ${destination || ''}`.trim()
    const url = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(searchQuery)}&gsrlimit=10&prop=pageimages&format=json&piprop=thumbnail&pithumbsize=1000&origin=*`
    const res = await fetch(url)
    const data = await res.json()
    if (data.query && data.query.pages) {
      const pages = Object.values(data.query.pages).sort((a, b) => (a.index || 99) - (b.index || 99))
      const usedInSession = new Set(assignedPhotoMap.values())
      for (const page of pages) {
        if (page.thumbnail && page.thumbnail.source) {
          const src = page.thumbnail.source
          if (!isUnwantedImage(src) && !usedInSession.has(src)) {
            return src
          }
        }
      }
    }
  } catch {
    // ignore
  }

  return null
}

export function usePlaceImage(placeName, destination, category, uniqueKey) {
  const cardId = uniqueKey || `${placeName}||${destination}`
  
  // Synchronously initialize region & category matching photo so every card starts with a contextually correct photo
  const [imageUrl, setImageUrl] = useState(() => getRelevantFallbackPhoto(cardId, placeName, destination, category))
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!placeName) return

    const initialPhoto = getRelevantFallbackPhoto(cardId, placeName, destination, category)
    setImageUrl(initialPhoto)

    let isMounted = true

    const fetchWiki = async () => {
      const wikiPhoto = await fetchWikipediaPhoto(placeName, destination, category)
      if (wikiPhoto && isMounted) {
        assignedPhotoMap.set(cardId, wikiPhoto)
        setImageUrl(wikiPhoto)
      }
    }

    fetchWiki()

    return () => {
      isMounted = false
    }
  }, [placeName, destination, category, cardId])

  return { imageUrl, loading }
}
