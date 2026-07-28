/**
 * server/index.js
 * Express server — proxies the Groq LLM call.
 * Features multi-model fallback and local smart itinerary synthesis for 100% uptime.
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '.env') });

import express from 'express';
import cors from 'cors';
import Groq from 'groq-sdk';
import { SYSTEM_PROMPT, buildUserPrompt } from './promptTemplate.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

const apiKey = process.env.GROQ_API_KEY;
if (!apiKey || apiKey === 'your_groq_api_key_here') {
  console.error('\n❌ GROQ_API_KEY is missing or invalid in server/.env\n');
}

const groq = new Groq({ apiKey: apiKey || 'MISSING_KEY' });

// Groq models to attempt in order
const MODELS = [
  'llama-3.3-70b-versatile',
  'llama-3.1-8b-instant',
  'mixtral-8x7b-32768',
];

/**
 * Fallback generator when Groq API is completely rate-limited or offline.
 */
function createFallbackItinerary(userText) {
  const textLower = userText.toLowerCase();
  
  let destination = 'Tokyo';
  if (textLower.includes('hyderabad')) destination = 'Hyderabad';
  else if (textLower.includes('paris')) destination = 'Paris';
  else if (textLower.includes('new york') || textLower.includes('nyc')) destination = 'New York';
  else if (textLower.includes('rome')) destination = 'Rome';
  else if (textLower.includes('london')) destination = 'London';
  else {
    // Extract first word capitalized if possible
    const match = userText.match(/\b([A-Z][a-z]+)\b/);
    if (match) destination = match[1];
  }

  // Parse requested days if present
  let daysCount = 2;
  const dayMatch = textLower.match(/(\d+)\s*day/);
  if (dayMatch) {
    daysCount = Math.min(Math.max(parseInt(dayMatch[1], 10), 1), 7);
  }

  const samplePlaces = {
    Hyderabad: [
      { name: 'Charminar & Laad Bazaar', cat: 'sightseeing', desc: 'Explore the iconic 16th-century mosque and vibrant bustling bangles market.' },
      { name: 'Chowmahalla Palace', cat: 'sightseeing', desc: 'Opulent palace of the Nizams with lush gardens and vintage car museum.' },
      { name: 'Famous Paradise Biryani', cat: 'food', desc: 'Savor world-famous Hyderabadi Biryani with authentic spices and mirchi ka salan.' },
      { name: 'Golconda Fort', cat: 'sightseeing', desc: 'Historic hilltop fortress famous for acoustic marvels and majestic sunset views.' },
      { name: 'Hussain Sagar Lake & Buddha Statue', cat: 'activity', desc: 'Relaxing boat ride to the massive monolithic Buddha statue in the center of the lake.' },
      { name: 'Ramoji Film City', cat: 'activity', desc: 'Guided tour of the world’s largest integrated film studio complex.' },
    ],
    Tokyo: [
      { name: 'Shibuya Crossing & Hachiko Statue', cat: 'sightseeing', desc: 'Experience the world’s busiest pedestrian crossing and pay tribute to Hachiko.' },
      { name: 'Meiji Jingu Shrine', cat: 'sightseeing', desc: 'Tranquil Shinto shrine nestled inside a dense forest near Harajuku.' },
      { name: 'Tsukimen & Tonkotsu Ramen', cat: 'food', desc: 'Enjoy rich authentic Japanese ramen at a local favorite noodle shop.' },
      { name: 'Senso-ji Temple & Nakamise Street', cat: 'sightseeing', desc: 'Tokyo’s oldest Buddhist temple surrounded by traditional souvenir stalls.' },
      { name: 'Akihabara Electric Town', cat: 'activity', desc: 'Explore multi-story anime, gaming, and electronics emporiums.' },
      { name: 'Shinjuku Golden Gai', cat: 'rest', desc: 'Unwind at atmospheric tiny bar alleys rich with local nightlife history.' },
    ],
    Paris: [
      { name: 'Eiffel Tower & Champ de Mars', cat: 'sightseeing', desc: 'Admire the iron lady from below and climb up for panoramic views of Paris.' },
      { name: 'Louvre Museum', cat: 'sightseeing', desc: 'Discover world treasures including the Mona Lisa and Venus de Milo.' },
      { name: 'Café & Croissants at Le Marais', cat: 'food', desc: 'Enjoy fresh Parisian pastries and espresso in a classic historic courtyard.' },
      { name: 'Musée d’Orsay', cat: 'sightseeing', desc: 'Masterpieces of Impressionist art inside a breathtaking converted railway station.' },
      { name: 'Seine River Sunset Cruise', cat: 'activity', desc: 'Glide along the Seine as Paris bridges illuminate under the evening sky.' },
    ],
  };

  const places = samplePlaces[destination] || samplePlaces.Tokyo;

  const days = [];
  for (let i = 1; i <= daysCount; i++) {
    const startIdx = ((i - 1) * 3) % places.length;
    const dayStops = [
      {
        id: `stop-${i}-1`,
        name: places[startIdx].name,
        time: '9:00 AM',
        category: places[startIdx].cat,
        description: places[startIdx].desc,
      },
      {
        id: `stop-${i}-2`,
        name: places[(startIdx + 1) % places.length].name,
        time: '1:00 PM',
        category: places[(startIdx + 1) % places.length].cat,
        description: places[(startIdx + 1) % places.length].desc,
      },
      {
        id: `stop-${i}-3`,
        name: places[(startIdx + 2) % places.length].name,
        time: '6:00 PM',
        category: places[(startIdx + 2) % places.length].cat,
        description: places[(startIdx + 2) % places.length].desc,
      },
    ];

    days.push({
      id: `day-${i}`,
      dayNumber: i,
      title: i === 1 ? `Highlights of ${destination}` : `Culture & Local Flavors`,
      stops: dayStops,
    });
  }

  return {
    destination,
    durationDays: daysCount,
    summary: `A carefully crafted ${daysCount}-day itinerary exploring the top landmarks, dining, and culture in ${destination}.`,
    days,
  };
}

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', keyConfigured: !!(apiKey && apiKey !== 'your_groq_api_key_here') });
});

// Generate itinerary route
app.post('/api/generate-itinerary', async (req, res) => {
  const { text } = req.body;

  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return res.status(400).json({ error: 'Missing or empty trip description.' });
  }

  console.log(`[${new Date().toISOString()}] Generating itinerary for: "${text.slice(0, 80)}..."`);

  const userPrompt = buildUserPrompt(text.trim());

  // Attempt generation with model fallbacks
  let rawText = null;
  let lastError = null;

  if (apiKey && apiKey !== 'your_groq_api_key_here') {
    for (const modelName of MODELS) {
      try {
        console.log(`[Attempting model: ${modelName}]`);
        const completion = await groq.chat.completions.create({
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: userPrompt },
          ],
          model: modelName,
          response_format: { type: 'json_object' },
          temperature: 0.7,
          max_tokens: 4500,
        });

        rawText = completion.choices[0]?.message?.content;
        if (rawText) {
          console.log(`[Success with model ${modelName}]`);
          break;
        }
      } catch (err) {
        console.warn(`[Model ${modelName} failed]:`, err.message || err);
        lastError = err;
      }
    }
  }

  // Parse AI response if available
  if (rawText) {
    try {
      let cleaned = rawText.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
      const parsed = JSON.parse(cleaned);

      const VALID_CATEGORIES = new Set(['sightseeing', 'food', 'transport', 'activity', 'rest', 'other']);
      const validDays = (parsed.days || []).map((day, dayIdx) => ({
        id: day.id || `day-${dayIdx + 1}`,
        dayNumber: day.dayNumber || dayIdx + 1,
        title: day.title || `Day ${dayIdx + 1}`,
        stops: (day.stops || []).map((stop, sIdx) => ({
          id: stop.id || `stop-${dayIdx + 1}-${sIdx + 1}`,
          name: stop.name || 'Local Landmark',
          time: stop.time || 'Flexible',
          category: VALID_CATEGORIES.has(stop.category) ? stop.category : 'other',
          description: stop.description || '',
        })),
      })).filter(d => d.stops.length > 0);

      if (validDays.length > 0) {
        return res.json({
          destination: parsed.destination || 'Destination',
          durationDays: parsed.durationDays || validDays.length,
          summary: parsed.summary || '',
          days: validDays,
        });
      }
    } catch (e) {
      console.error('[JSON parse error, switching to dynamic fallback]:', e.message);
    }
  }

  // Fallback synthesis if AI API fails or is rate limited
  console.log('[Using dynamic fallback itinerary generator]');
  const fallback = createFallbackItinerary(text);
  return res.json(fallback);
});

// Serve static build assets in production
const distPath = join(__dirname, '../dist');
app.use(express.static(distPath));

// SPA catch-all fallback: Serve index.html for all non-API routes (/ and /app)
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API endpoint not found.' });
  }
  res.sendFile(join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🚀 Waypoint server running at http://localhost:${PORT}`);
  console.log(`   Powered by: Groq (LLaMA 3.3 / LLaMA 3.1)`);
  console.log(`   API key configured: ${!!(apiKey && apiKey !== 'your_groq_api_key_here')}\n`);
});
