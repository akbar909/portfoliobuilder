"use client"

import { useTheme } from "@/components/theme-provider"
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
  const { theme } = useTheme()

  const borderClr = theme === "dark" ? linkColorDark : linkColor

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
      className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur"
      style={{ backgroundColor: theme === "dark" ? backgroundColorDark : backgroundColor, color: theme === "dark" ? foregroundColorDark : foregroundColor, borderColor: borderClr }}
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
        <div className="border-t px-4 py-3 md:hidden" style={{ borderColor: borderClr }}>
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