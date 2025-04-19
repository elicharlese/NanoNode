"use client"

import dynamic from "next/dynamic"
import { ThemeProvider } from "@/components/theme-provider"

// Use dynamic import with ssr: false to prevent server-side rendering errors
const NanoNodeDashboard = dynamic(
  () => import("@/components/nano-node-dashboard").then((mod) => ({ default: mod.NanoNodeDashboard })),
  { ssr: false },
)

export default function AppPage() {
  return (
    <ThemeProvider defaultTheme="dark">
      <div className="flex flex-col h-screen font-mono">
        <NanoNodeDashboard />
      </div>
    </ThemeProvider>
  )
}

