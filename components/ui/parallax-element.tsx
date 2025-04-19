"use client"

import { cn } from "@/lib/utils"
import { type ReactNode, useEffect, useState } from "react"

interface ParallaxElementProps {
  children: ReactNode
  className?: string
  speed?: number
  direction?: "up" | "down"
}

export function ParallaxElement({ children, className, speed = 0.5, direction = "up" }: ParallaxElementProps) {
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const factor = direction === "up" ? -speed : speed
      setOffset(scrollY * factor)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [speed, direction])

  return (
    <div
      className={cn(className)}
      style={{
        transform: `translateY(${offset}px)`,
        transition: "transform 0.1s ease-out",
      }}
    >
      {children}
    </div>
  )
}

