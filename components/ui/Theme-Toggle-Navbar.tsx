"use client"

import { useTheme } from "@/components/theme-provider"
import { Moon, Sun } from "lucide-react"

export function ThemeToggleNavbar() {
  const { setTheme, theme } = useTheme()

  const handleToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={handleToggle}
      className="rounded-full p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary flex items-center justify-center hover:bg-muted"
    >
      {/* Sun icon - visible in dark mode, moon icon - visible in light mode */}
      <Sun className="h-[1.1rem] w-[1.1rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.1rem] w-[1.1rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}