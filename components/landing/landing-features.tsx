"use client"

import { Cpu, BarChart3, Terminal, Network, Shield, Zap, Code, Layers } from "lucide-react"
import { useIntersectionObserver } from "@/hooks/use-intersection-observer"
import { useState, useEffect } from "react"

export function LandingFeatures() {
  const features = [
    {
      icon: <Terminal className="h-6 w-6 text-green-700 dark:text-green-500/80" />,
      title: "Interactive Console",
      description:
        "Powerful command-line interface with autocompletion and syntax highlighting for blockchain interactions.",
    },
    {
      icon: <Network className="h-6 w-6 text-green-700 dark:text-green-500/80" />,
      title: "Multi-Network Support",
      description: "Connect to any EVM-compatible network including Ethereum, Polygon, Arbitrum, and custom networks.",
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-green-700 dark:text-green-500/80" />,
      title: "Real-time Metrics",
      description: "Monitor node performance with real-time metrics for CPU, memory usage, and blockchain statistics.",
    },
    {
      icon: <Cpu className="h-6 w-6 text-green-700 dark:text-green-500/80" />,
      title: "Node Management",
      description:
        "Start, stop, pause, and reset your node with a single click. Full control over your blockchain environment.",
    },
    {
      icon: <Shield className="h-6 w-6 text-green-700 dark:text-green-500/80" />,
      title: "Secure by Default",
      description: "Built with security in mind. Local-only by default with optional remote access controls.",
    },
    {
      icon: <Zap className="h-6 w-6 text-green-700 dark:text-green-500/80" />,
      title: "Lightning Fast",
      description: "Optimized for performance with minimal resource usage. Run a full node on modest hardware.",
    },
    {
      icon: <Code className="h-6 w-6 text-green-700 dark:text-green-500/80" />,
      title: "Developer Tools",
      description: "Built-in tools for smart contract deployment, testing, and debugging. Perfect for developers.",
    },
    {
      icon: <Layers className="h-6 w-6 text-green-700 dark:text-green-500/80" />,
      title: "Extensible Architecture",
      description: "Modular design allows for easy extension and customization to fit your specific needs.",
    },
  ]

  const { ref, isInView } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "0px",
    freezeOnceVisible: true,
  })

  const [visibleFeatures, setVisibleFeatures] = useState<number[]>([])

  useEffect(() => {
    if (isInView) {
      const interval = setInterval(() => {
        setVisibleFeatures((prev) => {
          if (prev.length >= features.length) {
            clearInterval(interval)
            return prev
          }
          return [...prev, prev.length]
        })
      }, 150)

      return () => clearInterval(interval)
    }
  }, [isInView, features.length])

  return (
    <section
      id="features"
      className="py-20 relative bg-gray-100 dark:bg-gradient-to-br dark:from-gray-900 dark:to-black"
    >
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="hacker-grid"></div>
      </div>

      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-mono font-bold mb-4 text-green-700 dark:text-green-500/90 uppercase tracking-wider">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-700 dark:text-gray-300/80 max-w-2xl mx-auto font-mono">
            Everything you need to run and interact with blockchain nodes in one interface.
          </p>
        </div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`glass-panel p-6 transition-all duration-500 ${
                visibleFeatures.includes(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <div className="w-12 h-12 border border-green-700/30 dark:border-green-500/30 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-mono font-semibold mb-2 text-green-700 dark:text-green-500/80">
                {feature.title}
              </h3>
              <p className="text-gray-700 dark:text-gray-300/70 font-mono text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

