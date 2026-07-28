import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  MapPin, Calendar, Move, Sparkles, Compass, ArrowRight,
  Globe, Zap, Utensils, Star, CheckCircle2, ShieldCheck, Heart, Layers
} from 'lucide-react'
import ParticleCanvas from '../components/ParticleCanvas'

const POPULAR_DESTINATIONS = [
  {
    city: 'Hyderabad, India',
    days: '5 Days',
    highlights: ['Charminar', 'Golconda Fort', 'Hyderabadi Biryani', 'Hussain Sagar Lake'],
    image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1000&q=80',
    prompt: '5 days in Hyderabad. Must include Charminar, Golconda Fort, and authentic Hyderabadi Biryani!'
  },
  {
    city: 'Tokyo, Japan',
    days: '7 Days',
    highlights: ['Shibuya Crossing', 'Meiji Jingu Shrine', 'Akihabara', 'Tsukiji Outer Market'],
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1000&q=80',
    prompt: '7 days in Tokyo. Love street food, anime culture, and modern architecture.'
  },
  {
    city: 'Paris, France',
    days: '4 Days',
    highlights: ['Eiffel Tower', 'Louvre Museum', 'Montmartre', 'Seine River Cruise'],
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1000&q=80',
    prompt: '4 days in Paris. Focus on art museums, cozy bakeries, and romantic walks.'
  },
  {
    city: 'Lisbon, Portugal',
    days: '3 Days',
    highlights: ['Alfama Quarter', 'Belém Tower', 'Pastéis de Belém', 'Tram 28'],
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1000&q=80',
    prompt: 'Weekend in Lisbon. We love history, local wine, and Fado music.'
  }
]

const FEATURES = [
  {
    icon: <Sparkles size={24} color="#A78BFA" />,
    title: 'Natural Language Input',
    description: 'Describe your dream trip in plain English. No complex forms or boring dropdowns required.'
  },
  {
    icon: <Calendar size={24} color="#22D3EE" />,
    title: 'Smart Day-by-Day Scheduling',
    description: 'AI crafts a realistic, geographically optimized itinerary with realistic travel times between stops.'
  },
  {
    icon: <MapPin size={24} color="#34D399" />,
    title: 'Interactive Spatial Map',
    description: 'Visualize all stops on an interactive map. Switch between all-trip overview and individual day routes.'
  },
  {
    icon: <Move size={24} color="#FBBF24" />,
    title: 'Drag-and-Drop Management',
    description: 'Reorder stops, expand detailed guides, or delete places seamlessly with smooth micro-animations.'
  }
]

const HOW_IT_WORKS = [
  {
    number: '01',
    title: 'Enter Your Vision',
    desc: 'Type your destination, travel duration, and favorite interests or must-see places.'
  },
  {
    number: '02',
    title: 'AI Crafts Your Itinerary',
    desc: 'Our AI engine builds a tailored, day-by-day plan with dining and cultural highlights.'
  },
  {
    number: '03',
    title: 'Explore & Customize',
    desc: 'Interactively reorder stops, view map routes, and inspect authentic place photography.'
  }
]

function FadeIn({ children, delay = 0, style = {} }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      style={style}
    >
      {children}
    </motion.div>
  )
}

export default function LandingPage({ onLaunch }) {
  const [heroPrompt, setHeroPrompt] = useState('')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLaunchApp = (customPrompt) => {
    const promptToUse = customPrompt !== undefined ? customPrompt : heroPrompt
    onLaunch(promptToUse?.trim() || '')
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#07090F',
      color: '#F1F5F9',
      position: 'relative',
      overflowX: 'hidden',
      fontFamily: 'var(--font-body)',
      width: '100%',
    }}>
      {/* Background Particles & Ambient Lighting */}
      <ParticleCanvas />

      <div style={{
        position: 'fixed', top: -200, left: '20%', width: 700, height: 700,
        background: 'radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />
      <div style={{
        position: 'fixed', top: 300, right: '-5%', width: 800, height: 800,
        background: 'radial-gradient(circle, rgba(34,211,238,0.12) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* Navigation Header */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(7,9,15,0.88)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
        transition: 'all 0.3s ease',
      }}>
        <div style={{
          maxWidth: 1600, margin: '0 auto', padding: '0 clamp(24px, 5vw, 64px)', height: 76,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #8B5CF6, #22D3EE)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 20px rgba(139,92,246,0.4)',
            }}>
              <Compass size={20} color="white" />
            </div>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: 26, fontWeight: 700, color: '#F1F5F9', letterSpacing: '-0.02em' }}>
              Waypoint
            </span>
          </div>

          {/* Nav Links */}
          <nav className="hide-mobile" style={{ display: 'flex', gap: 40, alignItems: 'center' }}>
            <a href="#features" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: 15, fontWeight: 500, transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = '#F1F5F9'} onMouseOut={(e) => e.target.style.color = '#94A3B8'}>Features</a>
            <a href="#destinations" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: 15, fontWeight: 500, transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = '#F1F5F9'} onMouseOut={(e) => e.target.style.color = '#94A3B8'}>Destinations</a>
            <a href="#how-it-works" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: 15, fontWeight: 500, transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = '#F1F5F9'} onMouseOut={(e) => e.target.style.color = '#94A3B8'}>How it Works</a>
          </nav>

          {/* Action button */}
          <button
            onClick={() => handleLaunchApp()}
            style={{
              padding: '12px 26px', borderRadius: 'var(--radius-pill)',
              background: 'linear-gradient(135deg, #8B5CF6, #22D3EE)',
              border: 'none', color: '#FFFFFF', fontSize: 15, fontWeight: 600,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
              boxShadow: '0 4px 20px rgba(139,92,246,0.35)', transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(139,92,246,0.5)' }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(139,92,246,0.35)' }}
          >
            Launch Planner <ArrowRight size={16} />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        paddingTop: 160, paddingBottom: 100, paddingLeft: 'clamp(24px, 5vw, 64px)', paddingRight: 'clamp(24px, 5vw, 64px)',
        maxWidth: 1600, margin: '0 auto', position: 'relative', zIndex: 1,
        display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
      }}>
        <FadeIn delay={0.1}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '8px 20px', borderRadius: 'var(--radius-pill)',
            background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.3)',
            color: '#A78BFA', fontSize: 14, fontWeight: 600, marginBottom: 28,
            backdropFilter: 'blur(10px)',
          }}>
            <Sparkles size={16} /> Next-Gen AI Trip Planner
          </div>
        </FadeIn>

        <FadeIn delay={0.2} style={{ width: '100%' }}>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(42px, 5.5vw, 76px)',
            fontWeight: 700, lineHeight: 1.15,
            color: '#FFFFFF', letterSpacing: '-0.025em',
            maxWidth: 1100, margin: '0 auto 24px',
          }}>
            Plan your next journey with <br />
            <span style={{
              background: 'linear-gradient(135deg, #A78BFA 0%, #22D3EE 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              intelligent precision.
            </span>
          </h1>
        </FadeIn>

        <FadeIn delay={0.3}>
          <p style={{
            fontSize: 'clamp(17px, 1.8vw, 22px)', color: '#94A3B8', lineHeight: 1.6,
            maxWidth: 780, margin: '0 auto 48px', fontWeight: 400,
          }}>
            Describe where you want to go and what you love. Waypoint generates a personalized, day-by-day itinerary complete with maps, photos, and realistic timings.
          </p>
        </FadeIn>

        {/* Widescreen Interactive Prompt Input Box */}
        <FadeIn delay={0.4} style={{ width: '100%', maxWidth: 960 }}>
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.14)',
            borderRadius: 24, padding: 24,
            boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(139,92,246,0.15)',
            display: 'flex', flexDirection: 'column', gap: 16,
            textAlign: 'left', width: '100%',
          }}>
            <textarea
              value={heroPrompt}
              onChange={(e) => setHeroPrompt(e.target.value)}
              placeholder="e.g. 5 days in Hyderabad. Must include Charminar, Golconda Fort, and authentic Hyderabadi Biryani..."
              rows={3}
              style={{
                width: '100%', background: 'transparent', border: 'none', outline: 'none',
                color: '#FFFFFF', fontSize: 18, fontFamily: 'var(--font-body)', resize: 'none',
                lineHeight: 1.5,
              }}
            />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
              <span style={{ fontSize: 13, color: '#64748B' }}>
                💡 Tip: Mention budget, pacing, or specific attractions!
              </span>
              <button
                onClick={() => handleLaunchApp()}
                style={{
                  padding: '14px 34px', borderRadius: 'var(--radius-pill)',
                  background: 'linear-gradient(135deg, #8B5CF6, #22D3EE)',
                  border: 'none', color: '#FFFFFF', fontSize: 16, fontWeight: 600,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
                  boxShadow: '0 4px 20px rgba(139,92,246,0.4)', transition: 'all 0.2s ease',
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'none'}
              >
                Plan My Trip <ArrowRight size={18} />
              </button>
            </div>
          </div>

          {/* Quick Example Prompt Pills */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginTop: 24 }}>
            {POPULAR_DESTINATIONS.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleLaunchApp(item.prompt)}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 'var(--radius-pill)', padding: '8px 20px',
                  fontSize: 13, color: '#94A3B8', cursor: 'pointer',
                  transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: 6,
                }}
                onMouseOver={(e) => { e.currentTarget.style.borderColor = 'rgba(139,92,246,0.5)'; e.currentTarget.style.color = '#FFFFFF' }}
                onMouseOut={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#94A3B8' }}
              >
                📍 {item.city}
              </button>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* Feature Cards Widescreen Grid */}
      <section id="features" style={{ padding: '100px clamp(24px, 5vw, 64px)', maxWidth: 1600, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <FadeIn>
          <div style={{ textAlign: 'center', marginBottom: 72 }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(32px, 3.5vw, 44px)', fontWeight: 700, color: '#FFFFFF', marginBottom: 16 }}>
              Crafted for Effortless Travel Planning
            </h2>
            <p style={{ fontSize: 18, color: '#94A3B8', maxWidth: 640, margin: '0 auto' }}>
              Everything you need to turn inspiration into an actionable, beautiful trip itinerary.
            </p>
          </div>
        </FadeIn>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 28 }}>
          {FEATURES.map((feat, index) => (
            <FadeIn key={index} delay={index * 0.1}>
              <div
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 24, padding: 36, height: '100%',
                  transition: 'all 0.3s ease', cursor: 'default',
                  display: 'flex', flexDirection: 'column', gap: 18,
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)'
                  e.currentTarget.style.borderColor = 'rgba(139,92,246,0.3)'
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.5)'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'none'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {feat.icon}
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
                  {feat.title}
                </h3>
                <p style={{ fontSize: 15, color: '#94A3B8', lineHeight: 1.6, margin: 0 }}>
                  {feat.description}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Popular Destinations Showcase */}
      <section id="destinations" style={{ padding: '100px clamp(24px, 5vw, 64px)', background: 'rgba(13,17,32,0.6)', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1600, margin: '0 auto' }}>
          <FadeIn>
            <div style={{ textAlign: 'center', marginBottom: 72 }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(32px, 3.5vw, 44px)', fontWeight: 700, color: '#FFFFFF', marginBottom: 16 }}>
                Popular Destinations
              </h2>
              <p style={{ fontSize: 18, color: '#94A3B8', maxWidth: 640, margin: '0 auto' }}>
                Tap any destination to instantly generate a tailored trip plan with real-world landmark photography.
              </p>
            </div>
          </FadeIn>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 28 }}>
            {POPULAR_DESTINATIONS.map((dest, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div
                  onClick={() => handleLaunchApp(dest.prompt)}
                  style={{
                    borderRadius: 24, overflow: 'hidden',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    cursor: 'pointer', transition: 'all 0.3s ease',
                    position: 'relative', height: 360, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)'
                    e.currentTarget.style.borderColor = 'rgba(34,211,238,0.4)'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'none'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                  }}
                >
                  <img
                    src={dest.image}
                    alt={dest.city}
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(180deg, transparent 20%, rgba(7,9,15,0.92) 100%)',
                  }} />
                  <div style={{ position: 'relative', zIndex: 2, padding: 28 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#22D3EE', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      {dest.days}
                    </span>
                    <h3 style={{ fontSize: 24, fontWeight: 700, color: '#FFFFFF', margin: '4px 0 14px' }}>
                      {dest.city}
                    </h3>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {dest.highlights.slice(0, 3).map((h, idx) => (
                        <span key={idx} style={{
                          fontSize: 12, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
                          borderRadius: 8, padding: '4px 10px', color: '#E2E8F0',
                        }}>
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" style={{ padding: '100px clamp(24px, 5vw, 64px)', maxWidth: 1600, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <FadeIn>
          <div style={{ textAlign: 'center', marginBottom: 72 }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(32px, 3.5vw, 44px)', fontWeight: 700, color: '#FFFFFF', marginBottom: 16 }}>
              How Waypoint Works
            </h2>
            <p style={{ fontSize: 18, color: '#94A3B8', maxWidth: 640, margin: '0 auto' }}>
              3 simple steps to a stress-free travel itinerary.
            </p>
          </div>
        </FadeIn>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32 }}>
          {HOW_IT_WORKS.map((step, idx) => (
            <FadeIn key={idx} delay={idx * 0.15}>
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 24, padding: 36, position: 'relative',
              }}>
                <span style={{
                  fontSize: 42, fontWeight: 800, fontFamily: 'var(--font-heading)',
                  color: 'rgba(139,92,246,0.3)', display: 'block', marginBottom: 16,
                }}>
                  {step.number}
                </span>
                <h3 style={{ fontSize: 22, fontWeight: 600, color: '#FFFFFF', marginBottom: 14 }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: 15, color: '#94A3B8', lineHeight: 1.6, margin: 0 }}>
                  {step.desc}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section style={{
        padding: '100px clamp(24px, 5vw, 64px)',
        background: 'linear-gradient(135deg, rgba(139,92,246,0.2) 0%, rgba(34,211,238,0.15) 100%)',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        position: 'relative', zIndex: 1, textAlign: 'center',
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <FadeIn>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(36px, 4vw, 48px)', fontWeight: 700, color: '#FFFFFF', marginBottom: 20 }}>
              Ready to Start Your Next Adventure?
            </h2>
            <p style={{ fontSize: 20, color: '#CBD5E1', marginBottom: 40 }}>
              Join travelers world-wide organizing custom trips in seconds with Waypoint AI.
            </p>
            <button
              onClick={() => handleLaunchApp()}
              style={{
                padding: '18px 44px', borderRadius: 'var(--radius-pill)',
                background: 'linear-gradient(135deg, #8B5CF6, #22D3EE)',
                border: 'none', color: '#FFFFFF', fontSize: 17, fontWeight: 700,
                cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 10,
                boxShadow: '0 8px 30px rgba(139,92,246,0.45)', transition: 'all 0.2s ease',
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'none'}
            >
              Build My Itinerary Now <ArrowRight size={20} />
            </button>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#05070B', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '48px clamp(24px, 5vw, 64px)', color: '#64748B', fontSize: 15 }}>
        <div style={{ maxWidth: 1600, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Compass size={20} color="#8B5CF6" />
            <span style={{ fontWeight: 600, color: '#94A3B8', fontSize: 16 }}>Waypoint AI Trip Planner</span>
          </div>
          <span>© 2026 Waypoint. Powered by Gemini AI.</span>
        </div>
      </footer>
    </div>
  )
}
