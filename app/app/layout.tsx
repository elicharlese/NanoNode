import type React from "react"

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <div className="h-screen overflow-hidden font-mono">{children}</div>
}

