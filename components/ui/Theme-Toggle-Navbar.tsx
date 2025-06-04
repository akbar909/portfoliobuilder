"use client"

import { useTheme } from "@/components/theme-provider"
import { Moon, Sun } from "lucide-react"

export function ThemeToggleNavbar() {
  const { theme, setTheme } = useTheme()

  const handleToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={handleToggle}
      className="rounded-full p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary flex items-center justify-center"
      style={{
        backgroundColor: theme === "dark" ? "var(--background-dark)" : "var(--background)",
        color: theme === "dark" ? "var(--foreground-dark)" : "var(--foreground)",
      }}
    >
      {theme === "dark" ? (
        <Sun className="h-[1.1rem] w-[1.1rem]" />
      ) : (
        <Moon className="h-[1.1rem] w-[1.1rem]" />
      )}
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}