import type React from "react"
import type { Metadata } from "next"
import { JetBrains_Mono, Inter } from "next/font/google"
import "./globals.css"

// Load JetBrains Mono font
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  weight: ["400", "500", "700"],
  display: "swap", // Add display swap for better font loading
})

// Load Inter font
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap", // Add display swap for better font loading
})

export const metadata: Metadata = {
  title: "NanoNode - Your Personal Blockchain Node",
  description:
    "Run, manage, and interact with blockchain nodes effortlessly. NanoNode provides a powerful yet simple interface for blockchain development.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${jetbrainsMono.variable} ${inter.variable} font-sans`}>{children}</body>
    </html>
  )
}

