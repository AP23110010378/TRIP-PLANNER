import { useRef, useState } from 'react'

export default function TiltCard({ children, style, className, intensity = 15 }) {
  const ref = useRef(null)
  const [transform, setTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)')
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 })

  const handleMouseMove = (e) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    // calculate rotation (-intensity to +intensity)
    const rotateX = ((y / rect.height) - 0.5) * -intensity
    const rotateY = ((x / rect.width) - 0.5) * intensity

    // calculate glare position
    const glareX = (x / rect.width) * 100
    const glareY = (y / rect.height) * 100

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`)
    setGlare({ x: glareX, y: glareY, opacity: 0.15 })
  }

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)')
    setGlare(prev => ({ ...prev, opacity: 0 }))
  }

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        ...style,
        position: 'relative',
        transition: 'transform 0.1s ease-out, box-shadow 0.2s',
        transform,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Glare overlay */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        borderRadius: 'inherit',
        pointerEvents: 'none',
        background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 60%)`,
        opacity: glare.opacity,
        transition: 'opacity 0.2s',
        zIndex: 10,
      }} />
      {/* Content */}
      <div style={{ transform: 'translateZ(20px)', height: '100%', width: '100%' }}>
        {children}
      </div>
    </div>
  )
}
