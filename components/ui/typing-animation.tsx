"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface TypingAnimationProps {
  text: string
  className?: string
  speed?: number
  delay?: number
  cursor?: boolean
  repeat?: boolean
  onComplete?: () => void
}

export function TypingAnimation({
  text,
  className,
  speed = 50,
  delay = 0,
  cursor = true,
  repeat = false,
  onComplete,
}: TypingAnimationProps) {
  const [displayText, setDisplayText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    let timeout: NodeJS.Timeout

    // Initial delay
    timeout = setTimeout(() => {
      setIsTyping(true)
    }, delay)

    return () => clearTimeout(timeout)
  }, [delay])

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isTyping) {
      if (currentIndex < text.length) {
        interval = setInterval(() => {
          setDisplayText((prev) => prev + text[currentIndex])
          setCurrentIndex((prev) => prev + 1)
        }, speed)
      } else {
        setIsTyping(false)
        if (onComplete) onComplete()

        if (repeat) {
          setTimeout(() => {
            setDisplayText("")
            setCurrentIndex(0)
            setIsTyping(true)
          }, 2000)
        }
      }
    }

    return () => clearInterval(interval)
  }, [isTyping, currentIndex, text, speed, repeat, onComplete])

  return (
    <span className={cn("font-mono", className)}>
      {displayText}
      {cursor && isTyping && <span className="inline-block w-2 h-4 bg-green-500 ml-1 animate-blink"></span>}
    </span>
  )
}

