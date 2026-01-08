'use client'

import { useEffect, useRef } from 'react'

interface Particle {
    x: number
    y: number
    originX: number
    originY: number
    vx: number
    vy: number
    size: number
    color: string
}

export default function InteractiveBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const mouseRef = useRef({ x: -1000, y: -1000 })
    const particlesRef = useRef<Particle[]>([])
    const animationRef = useRef<number | undefined>(undefined)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const mouseRadius = 220
        const minDistFromMouse = 15
        const maxDistFromOrigin = 120
        const colors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#6366f1'] // Mavi-mor tonları

        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight

            particlesRef.current = []
            const count = Math.floor((canvas.width * canvas.height) / 12000)
            for (let i = 0; i < Math.min(count, 100); i++) {
                const x = Math.random() * canvas.width
                const y = Math.random() * canvas.height
                particlesRef.current.push({
                    x,
                    y,
                    originX: x,
                    originY: y,
                    vx: 0,
                    vy: 0,
                    size: Math.random() * 2.5 + 1.5,
                    color: colors[Math.floor(Math.random() * colors.length)]
                })
            }
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            const particles = particlesRef.current
            const mouse = mouseRef.current

            // Bağlantı çizgileri (açık mavi/gri)
            particles.forEach((p, i) => {
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j]
                    const d = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2)
                    if (d < 120) {
                        ctx.beginPath()
                        ctx.strokeStyle = `rgba(100, 116, 139, ${0.4 * (1 - d / 120)})`
                        ctx.lineWidth = 0.8
                        ctx.moveTo(p.x, p.y)
                        ctx.lineTo(p2.x, p2.y)
                        ctx.stroke()
                    }
                }
            })

            // Partikülleri güncelle ve çiz
            particles.forEach((p) => {
                const dx = mouse.x - p.x
                const dy = mouse.y - p.y
                const distToMouse = Math.sqrt(dx * dx + dy * dy)

                if (distToMouse < mouseRadius && distToMouse > 0) {
                    if (distToMouse > minDistFromMouse) {
                        const force = (mouseRadius - distToMouse) / mouseRadius * 0.25
                        p.vx += (dx / distToMouse) * force
                        p.vy += (dy / distToMouse) * force
                    } else {
                        const pushForce = 0.5
                        p.vx -= (dx / distToMouse) * pushForce
                        p.vy -= (dy / distToMouse) * pushForce
                    }
                }

                const dxOrigin = p.originX - p.x
                const dyOrigin = p.originY - p.y
                const distFromOrigin = Math.sqrt(dxOrigin * dxOrigin + dyOrigin * dyOrigin)
                const originPull = Math.min(distFromOrigin / maxDistFromOrigin, 1) * 0.02
                p.vx += dxOrigin * originPull
                p.vy += dyOrigin * originPull

                p.x += p.vx
                p.y += p.vy
                p.vx *= 0.92
                p.vy *= 0.92

                // Partikül çiz (renkli, soft)
                ctx.beginPath()
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
                ctx.fillStyle = p.color
                ctx.globalAlpha = 0.75
                ctx.fill()
                ctx.globalAlpha = 1
            })

            animationRef.current = requestAnimationFrame(animate)
        }

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY }
        }

        const handleMouseLeave = () => {
            mouseRef.current = { x: -1000, y: -1000 }
        }

        window.addEventListener('resize', resize)
        window.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('mouseleave', handleMouseLeave)

        resize()
        animate()

        return () => {
            window.removeEventListener('resize', resize)
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseleave', handleMouseLeave)
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/50"
        />
    )
}
