"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { Menu, X } from "lucide-react"
import { signOut } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { useSession } from "next-auth/react";

export default function Navbar() {
  const { user, loading, refetch } = useCurrentUser();
  const pathname = usePathname()
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const isDashboard = pathname.startsWith("/dashboard")

  // Check if we're on a portfolio page (username route)
  const isPortfolioPage = /^\/[^/]+$/.test(pathname) && pathname !== "/"

  // Don't show this navbar on portfolio pages
  if (isPortfolioPage) {
    return null
  }

  return (
    <nav className="border-b bg-background">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Link href="/" className="text-xl font-bold">
            PortfolioBuilder
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 md:flex">
          <Link href="/" className={`text-sm ${pathname === "/" ? "font-medium" : "text-muted-foreground"}`}>
            Home
          </Link>

          {session ? (
            <>
              <Link href="/dashboard" className={`text-sm ${isDashboard ? "font-medium" : "text-muted-foreground"}`}>
                Dashboard
              </Link>
              <Link href={`/${session?.user?.username}`} className="text-sm text-muted-foreground" target="_blank">
                View Portfolio
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full bg-primary p-0">
                    <span className="sr-only">Open user menu</span>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.image || undefined} alt={session?.user?.name || "User"} />
                      <AvatarFallback>{session?.user?.name?.[0] || "U"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/auth/signin" className="text-sm text-muted-foreground">
                Sign In
              </Link>
              <Link href="/auth/signup">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
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
            <Link
              href="/"
              className={`text-sm ${pathname === "/" ? "font-medium" : "text-muted-foreground"}`}
              onClick={toggleMenu}
            >
              Home
            </Link>

            {loading ? (
              <Skeleton className="h-8 w-8 rounded-full bg-muted animate-pulse" />
            ) : user ? (
              <>
                <Link
                  href="/dashboard"
                  className={`text-sm ${isDashboard ? "font-medium" : "text-muted-foreground"}`}
                  onClick={toggleMenu}
                >
                  Dashboard
                </Link>
                <Link
                  href={`/${user.username}`}
                  className="text-sm text-muted-foreground"
                  target="_blank"
                  onClick={toggleMenu}
                >
                  View Portfolio
                </Link>
                <Link href="/dashboard/settings" className="text-sm text-muted-foreground" onClick={toggleMenu}>
                  Settings
                </Link>
                <Button
                  variant="ghost"
                  className="justify-start px-0 text-sm text-muted-foreground"
                  onClick={() => {
                    signOut()
                    toggleMenu()
                  }}
                >
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/signin" className="text-sm text-muted-foreground" onClick={toggleMenu}>
                  Sign In
                </Link>
                <Link href="/auth/signup" className="text-sm text-muted-foreground" onClick={toggleMenu}>
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
