"use client"

import { Check } from "lucide-react"
import { useIntersectionObserver } from "@/hooks/use-intersection-observer"

export function LandingBenefits() {
  const benefits = [
    {
      title: "For Developers",
      items: [
        "Rapid development environment setup",
        "Instant blockchain interaction",
        "Smart contract testing and deployment",
        "Debug transactions with detailed traces",
        "Custom network configuration",
        "API access for integration with your tools",
      ],
    },
    {
      title: "For Researchers",
      items: [
        "Analyze blockchain data in real-time",
        "Monitor network performance",
        "Test theoretical models on live networks",
        "Collect and export blockchain metrics",
        "Simulate network conditions",
        "Validate research findings",
      ],
    },
    {
      title: "For Enthusiasts",
      items: [
        "Learn blockchain technology hands-on",
        "Run your own node without complex setup",
        "Explore blockchain data visually",
        "Understand network operations",
        "Participate in network consensus",
        "Join the decentralized web movement",
      ],
    },
  ]

  const { ref, isInView } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "0px",
    freezeOnceVisible: true,
  })

  return (
    <section id="benefits" className="py-20 bg-white dark:bg-gradient-to-br dark:from-black dark:to-gray-900 relative">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="hacker-grid"></div>
      </div>

      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-mono font-bold mb-4 text-green-700 dark:text-green-500/90 uppercase tracking-wider">
            Who Benefits from NanoNode?
          </h2>
          <p className="text-xl text-gray-700 dark:text-gray-300/80 max-w-2xl mx-auto font-mono">
            NanoNode is designed for everyone from blockchain beginners to experienced developers.
          </p>
        </div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className={`glass-panel p-8 transition-all duration-500 ${
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{
                transitionDelay: `${index * 200}ms`,
              }}
            >
              <h3 className="text-2xl font-mono font-semibold mb-6 text-green-700 dark:text-green-500/80 uppercase">
                {benefit.title}
              </h3>
              <ul className="space-y-4">
                {benefit.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start">
                    <span className="mr-2 mt-1 flex-shrink-0 w-5 h-5 border border-green-700/30 dark:border-green-500/30 flex items-center justify-center">
                      <Check className="h-3 w-3 text-green-700 dark:text-green-500/80" />
                    </span>
                    <span className="text-gray-700 dark:text-gray-300/70 font-mono">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

