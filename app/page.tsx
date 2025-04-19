"use client"

import { ThemeProvider } from "@/components/theme-provider"
import { LandingHeader } from "@/components/landing/landing-header"
import { LandingHero } from "@/components/landing/landing-hero"
import { LandingFeatures } from "@/components/landing/landing-features"
import { LandingBenefits } from "@/components/landing/landing-benefits"
import { LandingFooter } from "@/components/landing/landing-footer"
import { ScrollToTop } from "@/components/ui/scroll-to-top"
import { ScrollProgress } from "@/components/ui/scroll-progress"

export default function LandingPage() {
  return (
    <ThemeProvider defaultTheme="dark">
      <div className="min-h-screen bg-white dark:bg-black text-gray-800 dark:text-gray-300">
        <ScrollProgress />
        <LandingHeader />
        <LandingHero />
        <LandingFeatures />
        <LandingBenefits />
        <LandingFooter />
        <ScrollToTop />
      </div>
    </ThemeProvider>
  )
}

