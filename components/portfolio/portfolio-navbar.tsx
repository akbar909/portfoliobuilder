"use client"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export function PortfolioNavbar({ username }: { username: string }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
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
          <button onClick={() => scrollToSection("contact")} className="text-sm hover:text-primary">
            Contact
          </button>
          <ThemeToggle />
        </div>

        {/* Mobile Navigation Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={toggleMenu}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="border-t px-4 py-3 md:hidden">
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
            <button onClick={() => scrollToSection("contact")} className="text-left text-sm">
              Contact
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
