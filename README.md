# 🧭 Waypoint — AI Trip Planner

> **Describe your dream trip in plain English. Get a beautiful, interactive day-by-day itinerary in seconds.**

Waypoint is a full-stack AI-powered travel planning application that takes a natural language prompt and generates a rich, geographically-optimized trip itinerary complete with an interactive map, real place photography, day-by-day timelines, and destination insights.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 **AI Itinerary Generation** | Powered by Groq LLM — generates detailed multi-day trip plans from plain English |
| 🗺️ **Interactive Leaflet Map** | Visualize all stops per day with color-coded routes and markers |
| 📸 **Real Place Photography** | Fetches authentic Wikipedia photos for every location — no stock/AI art |
| 📅 **Day-by-Day Timeline** | Expandable stop cards with descriptions, times, and drag-to-reorder |
| 🏛️ **Destination Insights** | Cultural highlights and food recommendations sourced from Wikipedia |
| 🌐 **Single-URL SPA** | Landing page + Planner dashboard both on one link — no separate routes |
| 📱 **Fully Responsive** | Mobile (< 768px), Tablet, Desktop (1024px+), and Ultra-wide (2560px+) |

---

## 🛠️ Tech Stack

**Frontend**
- [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- [Framer Motion](https://www.framer.com/motion/) — animations
- [Leaflet](https://leafletjs.com/) + [React-Leaflet](https://react-leaflet.js.org/) — interactive maps
- [Lucide React](https://lucide.dev/) — icons
- Vanilla CSS with CSS custom properties

**Backend**
- [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/)
- [Groq SDK](https://groq.com/) — LLM API (LLaMA 3 / Mixtral)
- [Wikipedia REST API](https://en.wikipedia.org/api/rest_v1/) — place images & summaries
- [Nominatim (OpenStreetMap)](https://nominatim.org/) — geocoding

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- A free [Groq API key](https://console.groq.com/)

### 1. Clone the repository

```bash
git clone https://github.com/AP23110010378/TRIP-PLANNER.git
cd TRIP-PLANNER
```

### 2. Install dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 3. Configure environment variables

```bash
cp server/.env.example server/.env
```

Open `server/.env` and add your Groq API key:

```env
GROQ_API_KEY=your_groq_api_key_here
PORT=3001
```

### 4. Run the development server

**Terminal 1 — Backend:**
```bash
cd server
node index.js
```

**Terminal 2 — Frontend:**
```bash
npm run dev
```

Open **`http://localhost:5173`** in your browser.

---

## 📁 Project Structure

```
TRIP-PLANNER/
├── src/
│   ├── components/
│   │   ├── JourneyOverview.jsx   # 3-column editorial dashboard
│   │   ├── TripMap.jsx           # Interactive Leaflet map
│   │   ├── DayItinerary.jsx      # Day timeline with stop cards
│   │   ├── StopCard.jsx          # Individual stop card
│   │   ├── DestinationInsights.jsx # Wikipedia-powered insights
│   │   ├── InputPanel.jsx        # Trip prompt input
│   │   ├── LoadingState.jsx      # Loading animation
│   │   └── ParticleCanvas.jsx    # Ambient particle background
│   ├── hooks/
│   │   ├── useGenerateItinerary.js # API call + state management
│   │   └── usePlaceImage.js        # Wikipedia image fetching
│   ├── pages/
│   │   ├── LandingPage.jsx       # Hero landing page
│   │   └── PlannerApp.jsx        # Main planner dashboard
│   ├── App.jsx                   # Single-URL state-based routing
│   └── index.css                 # Design system + responsive breakpoints
├── server/
│   ├── index.js                  # Express server + Groq API
│   ├── promptTemplate.js         # LLM prompt engineering
│   └── .env.example              # Environment variable template
├── public/
│   └── _redirects               # Netlify SPA redirect config
├── vercel.json                   # Vercel SPA rewrite config
└── vite.config.js               # Vite build configuration
```

---

## 🌍 Deployment

### Deploy to Vercel (Recommended)

1. Push this repo to GitHub
2. Import the project at [vercel.com](https://vercel.com)
3. Set the **Root Directory** to `/` and **Framework** to `Vite`
4. Add environment variable: `GROQ_API_KEY = your_key`
5. Deploy ✅

### Deploy to Render

1. Create a new **Web Service** on [render.com](https://render.com)
2. Connect this GitHub repository
3. Set **Build Command**: `npm install && npm run build`
4. Set **Start Command**: `node server/index.js`
5. Add environment variable: `GROQ_API_KEY = your_key`
6. Deploy ✅

---

## 🔑 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GROQ_API_KEY` | ✅ Yes | Your Groq API key from [console.groq.com](https://console.groq.com) |
| `PORT` | ❌ Optional | Backend server port (default: `3001`) |

> **Security:** Never commit your `.env` file. It is listed in `.gitignore`.

---

## 📸 Screenshots

| Landing Page | Trip Planner Dashboard |
|---|---|
| Dark cosmic hero with AI prompt input | 3-column editorial layout with map, timeline & insights |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">
  <strong>Built with ❤️ using React, Express, and Groq AI</strong>
</div>
