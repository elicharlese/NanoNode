"use client"

import { useEffect, useState } from "react"

export function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const scrollPosition = window.scrollY
      const progress = (scrollPosition / totalHeight) * 100
      setScrollProgress(progress)
    }

    // Add event listener
    window.addEventListener("scroll", handleScroll)

    // Initial calculation
    handleScroll()

    // Cleanup
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-gray-200 dark:bg-gray-800">
      <div
        className="h-full bg-green-700 dark:bg-green-500 transition-all duration-100"
        style={{
          width: `${scrollProgress}%`,
          boxShadow: "0 0 10px rgba(0, 128, 0, 0.3)",
        }}
      />
    </div>
  )
}

