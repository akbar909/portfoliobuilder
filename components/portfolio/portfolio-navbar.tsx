"use client"

import { Button } from "@/components/ui/button"
import { ThemeToggleNavbar } from "@/components/ui/Theme-Toggle-Navbar"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface PortfolioNavbarProps {
  username: string
  primaryColor: string
  backgroundColor: string
  backgroundColorDark: string
  foregroundColor: string
  foregroundColorDark: string
  secondaryColor?: string
  secondaryColorDark?: string
  linkColor: string
  linkColorDark: string
}

// Helper to add alpha to hex color
function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function PortfolioNavbar({
  username,
  primaryColor,
  backgroundColor,
  backgroundColorDark,
  foregroundColor,
  foregroundColorDark,
  secondaryColor,
  secondaryColorDark,
  linkColor,
  linkColorDark,
}: PortfolioNavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Create semi-transparent versions of background colors
  const bgWithAlpha = hexToRgba(backgroundColor, 0.95);
  const bgDarkWithAlpha = hexToRgba(backgroundColorDark, 0.95);

  // CSS variables for theme-aware styling (no JS theme detection needed)
  const cssVars = {
    '--nav-bg': bgWithAlpha,
    '--nav-bg-dark': bgDarkWithAlpha,
    '--nav-fg': foregroundColor,
    '--nav-fg-dark': foregroundColorDark,
    '--nav-border': linkColor + '33',
    '--nav-border-dark': linkColorDark + '33',
  } as React.CSSProperties;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId)
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
    }
    setIsMenuOpen(false)
  }

  return (
    <nav
      className="sticky top-0 z-50 backdrop-blur-md bg-[var(--nav-bg)] text-[var(--nav-fg)] border-b border-[var(--nav-border)] dark:bg-[var(--nav-bg-dark)] dark:text-[var(--nav-fg-dark)] dark:border-[var(--nav-border-dark)]"
      style={cssVars}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Link href="/" className="text-xl font-bold">
            {username}'s Portfolio
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 md:flex">
          <button onClick={() => scrollToSection("home")} className="text-sm hover:text-primary">
            Home
          </button>
          <button onClick={() => scrollToSection("about")} className="text-sm hover:text-primary">
            About
          </button>
          <button onClick={() => scrollToSection("projects")} className="text-sm hover:text-primary">
            Projects
          </button>
          <button onClick={() => scrollToSection("experience")} className="text-sm hover:text-primary">
            Experience
          </button>
          <button onClick={() => scrollToSection("education")} className="text-sm hover:text-primary">
            Education
          </button>
          <button onClick={() => scrollToSection("contact")} className="text-sm hover:text-primary">
            Contact
          </button>
          <ThemeToggleNavbar />
        </div>

        {/* Mobile Navigation Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggleNavbar />
          <Button variant="ghost" size="icon" onClick={toggleMenu}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="border-t px-4 py-3 md:hidden border-[var(--nav-border)] dark:border-[var(--nav-border-dark)]">
          <div className="flex flex-col space-y-3">
            <button onClick={() => scrollToSection("home")} className="text-left text-sm">
              Home
            </button>
            <button onClick={() => scrollToSection("about")} className="text-left text-sm">
              About
            </button>
            <button onClick={() => scrollToSection("projects")} className="text-left text-sm">
              Projects
            </button>
            <button onClick={() => scrollToSection("experience")} className="text-left text-sm">
              Experience
            </button>
            <button onClick={() => scrollToSection("education")} className="text-left text-sm">
              Education
            </button>
            <button onClick={() => scrollToSection("contact")} className="text-left text-sm">
              Contact
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}