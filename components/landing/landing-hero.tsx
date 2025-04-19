"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { TypingAnimation } from "@/components/ui/typing-animation"
import { useIntersectionObserver } from "@/hooks/use-intersection-observer"

export function LandingHero() {
  const { theme } = useTheme()
  const { ref, isInView } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "0px",
    freezeOnceVisible: true,
  })

  return (
    <section className="py-20 md:py-32 relative overflow-hidden bg-gray-50 dark:bg-gradient-to-br dark:from-gray-950 dark:to-black">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="hacker-grid"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-mono font-bold mb-6 text-green-700 dark:text-green-500/90 hacker-glow uppercase tracking-wider">
            <TypingAnimation text="Your Personal Blockchain Node" speed={70} className="inline-block" />
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300/80 mb-8 font-mono">
            Run, manage, and interact with blockchain nodes effortlessly. NanoNode provides a powerful interface for
            blockchain development.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/app">
              <button className="hacker-button px-8 py-4 text-lg flex items-center font-mono">
                Launch App
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </Link>
            <Link href="https://docs.nanonode.dev">
              <button className="glass-button px-8 py-4 text-lg font-mono text-gray-700 dark:text-gray-300">
                Read Docs
              </button>
            </Link>
          </div>
        </div>

        {/* Application Preview */}
        <div ref={ref} className="max-w-5xl mx-auto">
          {isInView && (
            <div className="relative">
              {/* Main application screenshot */}
              <div className="rounded-lg overflow-hidden shadow-2xl">
                <Image
                  src={
                    theme === "dark"
                      ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-03-11%20at%208.32.23%E2%80%AFAM-qfZslSieggNvBoivN2pmw7Vm5CuAiB.png"
                      : "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-03-11%20at%208.32.33%E2%80%AFAM-NVDPGxoPfDYCjwQQghyWVKNcjqkK9D.png"
                  }
                  alt="NanoNode Interface"
                  width={1400}
                  height={800}
                  className="w-full object-cover object-[-1px_-1px]"
                  priority
                />
              </div>

              {/* Terminal overlay */}
              <div className="absolute -bottom-10 -right-10 md:right-10 w-96 h-64 glass-panel p-3 rotate-6 overflow-hidden hidden md:block">
                <Image
                  src={
                    theme === "dark"
                      ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-03-11%20at%208.34.14%E2%80%AFAM-8495lKHZDV3qRfpYfjRKWyYwoNYZXb.png"
                      : "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-03-11%20at%208.33.04%E2%80%AFAM-DSgjc6Ry35sjgbgkXl3kRpSK3QIhBp.png"
                  }
                  alt="NanoNode Terminal"
                  width={800}
                  height={600}
                  className="w-full rounded object-cover object-[-1px_-1px]"
                  priority
                />
              </div>

              {/* Glass effect overlays */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-gray-50/30 dark:from-gray-950/30 to-transparent pointer-events-none"></div>
              <div className="absolute inset-0 rounded-lg ring-1 ring-black/5 dark:ring-white/5 pointer-events-none"></div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

