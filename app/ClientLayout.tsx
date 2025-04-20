"use client"

import type React from "react"
import Navbar from "@/components/Navbar"

function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  )
}

export default ClientLayout
