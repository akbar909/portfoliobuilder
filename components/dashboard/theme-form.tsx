"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

interface ThemeFormProps {
  portfolio: {
    theme: string
    customizations: {
      primaryColor: string
      fontFamily: string
    }
  }
}

export function ThemeForm({ portfolio }: ThemeFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [theme, setTheme] = useState(portfolio.theme)
  const [primaryColor, setPrimaryColor] = useState(portfolio.customizations.primaryColor)
  const [fontFamily, setFontFamily] = useState(portfolio.customizations.fontFamily)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch("/api/portfolio", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          theme,
          customizations: {
            primaryColor,
            fontFamily,
          },
        }),
      })

      if (!res.ok) {
        throw new Error("Failed to update theme")
      }

      toast.success("Your theme settings have been updated.")

      router.refresh()
    } catch (error) {
      console.error("Error updating theme:", error)
      toast.error("Failed to update theme settings. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Theme Settings</CardTitle>
          <CardDescription>Customize the appearance of your portfolio.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 ">
          <div className="space-y-2 hidden">
            <Label htmlFor="theme">Theme Mode</Label>
            <Select   value={theme} onValueChange={setTheme}>
              <SelectTrigger id="theme">
                <SelectValue placeholder="Select theme mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System (User Preference)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">Choose how your portfolio appears to visitors.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="primaryColor">Primary Color</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                id="primaryColor"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="h-10 w-10 cursor-pointer rounded-md border"
              />
              <span className="text-sm">{primaryColor}</span>
            </div>
          </div>

          <div className="space-y-2 mt-4">
            <Label>Preview</Label>
            <div className="flex flex-wrap gap-2">
              <div
                className="h-10 w-20 rounded-md flex items-center justify-center text-white"
                style={{ backgroundColor: primaryColor }}
              >
                Button
              </div>
              <div
                className="h-10 px-3 rounded-md flex items-center justify-center"
                style={{
                  backgroundColor: `${primaryColor}20`,
                  color: primaryColor,
                }}
              >
                Tag
              </div>
              <div
                className="h-10 w-10 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: primaryColor }}
              >
                A
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              This preview shows how your primary color will appear on various elements.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fontFamily">Font Family</Label>
            <Select value={fontFamily} onValueChange={setFontFamily}>
              <SelectTrigger id="fontFamily">
                <SelectValue placeholder="Select font family" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Inter">Inter</SelectItem>
                <SelectItem value="Roboto">Roboto</SelectItem>
                <SelectItem value="Poppins">Poppins</SelectItem>
                <SelectItem value="Montserrat">Montserrat</SelectItem>
                <SelectItem value="Open Sans">Open Sans</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
