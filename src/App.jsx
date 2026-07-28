import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import PlannerApp from './pages/PlannerApp'
import ErrorBoundary from './components/ErrorBoundary'

export default function App() {
  const [view, setView] = useState('landing')   // 'landing' | 'planner'
  const [pendingPrompt, setPendingPrompt] = useState('')

  const handleLaunch = (prompt = '') => {
    setPendingPrompt(prompt)
    setView('planner')
  }

  const handleBack = () => {
    setPendingPrompt('')
    setView('landing')
  }

  return (
    <ErrorBoundary>
      <Routes>
        <Route
          path="/"
          element={
            view === 'landing'
              ? <LandingPage onLaunch={handleLaunch} />
              : <PlannerApp onBack={handleBack} pendingPrompt={pendingPrompt} />
          }
        />
        {/* Legacy /app links still work — redirect to / */}
        <Route path="/app" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  )
}
