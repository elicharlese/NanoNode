"use client"

import { cn } from "@/lib/utils"
import { type ReactNode, useEffect, useState } from "react"

interface FloatingElementProps {
  children: ReactNode
  className?: string
  amplitude?: number
  speed?: number
  direction?: "x" | "y" | "both"
  delay?: number
}

export function FloatingElement({
  children,
  className,
  amplitude = 10,
  speed = 3,
  direction = "y",
  delay = 0,
}: FloatingElementProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const startTime = Date.now() + delay * 1000
    let animationFrameId: number

    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000
      const x = direction === "x" || direction === "both" ? Math.sin(elapsed / speed) * amplitude : 0
      const y = direction === "y" || direction === "both" ? Math.sin(elapsed / speed) * amplitude : 0

      setPosition({ x, y })
      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [amplitude, speed, direction, delay])

  return (
    <div
      className={cn(className)}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: "transform 0.1s ease-out",
      }}
    >
      {children}
    </div>
  )
}

