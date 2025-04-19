"use client"

import type React from "react"

import { useIntersectionObserver } from "@/hooks/use-intersection-observer"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface AnimatedSectionProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: "up" | "down" | "left" | "right" | "none"
  distance?: number
  once?: boolean
  threshold?: number
  rootMargin?: string
}

export function AnimatedSection({
  children,
  className,
  delay = 0,
  direction = "up",
  distance = 30,
  once = true,
  threshold = 0.1,
  rootMargin = "0px",
}: AnimatedSectionProps) {
  const { ref, isInView } = useIntersectionObserver({
    threshold,
    rootMargin,
    freezeOnceVisible: once,
  })

  // Define transform values based on direction
  const getInitialTransform = () => {
    switch (direction) {
      case "up":
        return `translateY(${distance}px)`
      case "down":
        return `translateY(-${distance}px)`
      case "left":
        return `translateX(${distance}px)`
      case "right":
        return `translateX(-${distance}px)`
      case "none":
        return "none"
      default:
        return `translateY(${distance}px)`
    }
  }

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={cn(className)}
      style={{
        transform: isInView ? "none" : getInitialTransform(),
        opacity: isInView ? 1 : 0,
        transition: `transform 0.8s cubic-bezier(0.17, 0.55, 0.55, 1) ${delay}s, opacity 0.8s cubic-bezier(0.17, 0.55, 0.55, 1) ${delay}s`,
      }}
    >
      {children}
    </div>
  )
}

