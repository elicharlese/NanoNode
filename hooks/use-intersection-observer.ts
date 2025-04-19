"use client"

import { useState, useEffect, useRef } from "react"

interface UseIntersectionObserverProps {
  threshold?: number
  rootMargin?: string
  freezeOnceVisible?: boolean
}

export function useIntersectionObserver({
  threshold = 0.1,
  rootMargin = "0px",
  freezeOnceVisible = true,
}: UseIntersectionObserverProps = {}) {
  const ref = useRef<HTMLElement | null>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Update state when observer callback fires
        const isVisible = entry.isIntersecting
        setIsInView(isVisible)

        // Unobserve once visible if freezeOnceVisible is true
        if (isVisible && freezeOnceVisible && node) {
          observer.unobserve(node)
        }
      },
      { threshold, rootMargin },
    )

    observer.observe(node)

    return () => {
      if (node) {
        observer.unobserve(node)
      }
    }
  }, [threshold, rootMargin, freezeOnceVisible])

  return { ref, isInView }
}

