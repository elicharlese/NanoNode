"use client"

import Link from "next/link"
import { useTheme } from "@/components/theme-provider"
import { Moon, Sun, Github, Terminal } from "lucide-react"
import { useEffect, useState } from "react"

export function LandingHeader() {
  const { theme, setTheme } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      // Check if scrolled past threshold
      setScrolled(window.scrollY > 50)

      // Calculate scroll progress
      const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const progress = (window.scrollY / totalHeight) * 100
      setScrollProgress(progress)
    }

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll)

    // Initial calculation
    handleScroll()

    // Cleanup
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/80 dark:bg-black/80 border-b border-gray-200 dark:border-white/5 backdrop-blur-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 border border-green-700/50 dark:border-green-500/50 flex items-center justify-center">
            <Terminal className="h-4 w-4 text-green-700 dark:text-green-500/80" />
          </div>
          <span className="text-xl font-mono font-bold text-green-700 dark:text-green-500/90">NanoNode</span>
        </div>

        <div className="hidden md:block flex-1"></div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="glass-button w-10 h-10 flex items-center justify-center"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5 text-yellow-300" />
            ) : (
              <Moon className="h-5 w-5 text-blue-400" />
            )}
          </button>

          <Link href="https://github.com/nanonode/nanonode" target="_blank" rel="noopener noreferrer">
            <button className="glass-button w-10 h-10 flex items-center justify-center">
              <Github className="h-4 w-4 text-gray-700 dark:text-gray-300" />
              <span className="sr-only">GitHub</span>
            </button>
          </Link>

          <Link href="/app">
            <button className="hacker-button px-6 py-2 text-sm">Launch App</button>
          </Link>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-[2px] bg-gray-200 dark:bg-gray-800 w-full overflow-hidden">
        <div
          className="h-full bg-green-700 dark:bg-green-500 transition-all duration-100"
          style={{
            width: `${scrollProgress}%`,
          }}
        />
      </div>
    </header>
  )
}

