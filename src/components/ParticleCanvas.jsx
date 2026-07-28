import { useEffect, useRef } from 'react'

const PALETTE = ['#8B5CF6', '#6366F1', '#22D3EE', '#34D399', '#A78BFA']

export default function ParticleCanvas({ opacity = 0.55 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId

    /* ── resize ── */
    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    /* ── particles ── */
    const N = Math.min(90, Math.floor((window.innerWidth * window.innerHeight) / 12000))
    const CONNECT = 130

    const particles = Array.from({ length: N }, () => ({
      x:  Math.random() * canvas.width,
      y:  Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      r:  Math.random() * 2 + 0.8,
      color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
      pulse: Math.random() * Math.PI * 2,
    }))

    /* ── draw loop ── */
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const t = Date.now() * 0.001

      /* update + draw dots */
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > canvas.width)  p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1

        const pulsedR = p.r * (1 + 0.35 * Math.sin(t * 1.5 + p.pulse))
        ctx.beginPath()
        ctx.arc(p.x, p.y, pulsedR, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.shadowBlur = 10
        ctx.shadowColor = p.color
        ctx.fill()
        ctx.shadowBlur = 0
      }

      /* draw connections */
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < CONNECT) {
            const alpha = (1 - d / CONNECT) * 0.35
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(139,92,246,${alpha})`
            ctx.lineWidth = 0.7
            ctx.stroke()
          }
        }
      }

      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', top: 0, left: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 0, opacity,
      }}
    />
  )
}
