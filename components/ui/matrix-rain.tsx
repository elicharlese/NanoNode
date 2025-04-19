"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "@/components/theme-provider"

interface MatrixRainProps {
  className?: string
  density?: number
  speed?: number
  opacity?: number
}

export function MatrixRain({ className = "", density = 0.03, speed = 0.8, opacity = 0.02 }: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Matrix rain characters
    const chars = "01010101010101"
    const fontSize = 14
    const columns = Math.floor((canvas.width / fontSize) * density)

    // Array to track the y position of each column
    const drops: number[] = []
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * -canvas.height)
    }

    // Drawing function
    const draw = () => {
      // Background to create fade effect
      ctx.fillStyle = theme === "dark" ? `rgba(0, 0, 0, ${1 - opacity})` : `rgba(255, 255, 255, ${1 - opacity})`
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Text color
      ctx.fillStyle = theme === "dark" ? "rgba(0, 255, 0, 0.3)" : "rgba(0, 128, 0, 0.2)"
      ctx.font = `${fontSize}px monospace`

      // Loop through drops
      for (let i = 0; i < drops.length; i++) {
        // Random character
        const text = chars[Math.floor(Math.random() * chars.length)]

        // x = i * fontSize, y = drops[i] * fontSize
        ctx.fillText(text, i * (fontSize / density), drops[i] * fontSize)

        // Sending the drop back to the top randomly after it crosses the screen
        // Adding randomness to the reset to make the drops scattered
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }

        // Incrementing Y coordinate
        drops[i] += speed
      }
    }

    // Animation loop
    let animationFrameId: number
    const animate = () => {
      draw()
      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [density, speed, opacity, theme])

  return <canvas ref={canvasRef} className={`fixed top-0 left-0 w-full h-full -z-10 ${className}`} />
}

