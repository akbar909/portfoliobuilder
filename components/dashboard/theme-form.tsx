"use client"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { COLOR_PALETTES } from "./COLOR_PALETTES"

interface ThemeFormProps {
  portfolio: {
    theme: string
    customizations: {
      primaryColor: string
      backgroundColor: string
      backgroundColorDark?: string
      foregroundColor: string
      foregroundColorDark?: string
      secondaryColor: string
      secondaryColorDark?: string
      buttonColor: string
      buttonColorDark?: string
      buttonTextColor: string
      buttonTextColorDark?: string
      cardBackgroundColor: string
      cardBackgroundColorDark?: string
      linkColor: string
      linkColorDark?: string
      navbarColor: string
      navbarColorDark?: string
      footerColor: string
      footerColorDark?: string
      borderRadius: string
      fontFamily: string
    }
  }
}

export function ThemeForm({ portfolio }: ThemeFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [theme, setTheme] = useState(portfolio.theme)

  // Add index signature to customizations type for TS
  type Customizations = {
    primaryColor: string
    backgroundColor: string
    backgroundColorDark: string
    foregroundColor: string
    foregroundColorDark: string
    secondaryColor: string
    secondaryColorDark: string
    buttonColor: string
    buttonColorDark: string
    buttonTextColor: string
    buttonTextColorDark: string
    cardBackgroundColor: string
    cardBackgroundColorDark: string
    linkColor: string
    linkColorDark: string
    navbarColor: string
    navbarColorDark: string
    footerColor: string
    footerColorDark: string
    borderRadius: string
    fontFamily: string
    [key: string]: string
  }

  // State for all customizations (light and dark)
  const [customizations, setCustomizations] = useState<Customizations>({
    primaryColor: portfolio.customizations.primaryColor || "#2563eb",
    backgroundColor: portfolio.customizations.backgroundColor || "#ffffff",
    backgroundColorDark: portfolio.customizations.backgroundColorDark || "#18181b",
    foregroundColor: portfolio.customizations.foregroundColor || "#111827",
    foregroundColorDark: portfolio.customizations.foregroundColorDark || "#f4f4f5",
    secondaryColor: portfolio.customizations.secondaryColor || "#6366f1",
    secondaryColorDark: portfolio.customizations.secondaryColorDark || "#818cf8",
    buttonColor: portfolio.customizations.buttonColor || "#2563eb",
    buttonColorDark: portfolio.customizations.buttonColorDark || "#3b82f6",
    buttonTextColor: portfolio.customizations.buttonTextColor || "#ffffff",
    buttonTextColorDark: portfolio.customizations.buttonTextColorDark || "#f4f4f5",
    cardBackgroundColor: portfolio.customizations.cardBackgroundColor || "#f3f4f6",
    cardBackgroundColorDark: portfolio.customizations.cardBackgroundColorDark || "#27272a",
    linkColor: portfolio.customizations.linkColor || "#2563eb",
    linkColorDark: portfolio.customizations.linkColorDark || "#818cf8",
    navbarColor: portfolio.customizations.navbarColor || "#ffffff",
    navbarColorDark: portfolio.customizations.navbarColorDark || "#18181b",
    footerColor: portfolio.customizations.footerColor || "#f9fafb",
    footerColorDark: portfolio.customizations.footerColorDark || "#27272a",
    borderRadius: portfolio.customizations.borderRadius || "0.5rem",
    fontFamily: portfolio.customizations.fontFamily || "Inter",
  })

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
          customizations,
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

  // Helper to group color pickers by light/dark
  const colorFields = Object.keys(customizations).filter(k => k.endsWith("Color"))
  const colorFieldsDark = colorFields.filter(k => k.endsWith("Dark"))
  const colorFieldsLight = colorFields.filter(k => !k.endsWith("Dark"))

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Theme Settings</CardTitle>
          <CardDescription>Customize the appearance of your portfolio for both light and dark themes.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 ">
          {/* Palette Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {COLOR_PALETTES.map((palette) => (
              <button
                type="button"
                key={palette.name}
                className={`rounded-lg border-2 p-3 text-left transition-all ${
                  customizations.primaryColor === palette.colors.primaryColor &&
                  customizations.backgroundColor === palette.colors.backgroundColor
                    ? "border-primary"
                    : "border-transparent"
                }`}
                style={{
                  background: palette.colors.backgroundColor,
                  color: palette.colors.foregroundColor,
                  fontFamily: palette.colors.fontFamily,
                }}
                onClick={() => setCustomizations({ ...palette.colors })}
              >
                <div className="font-bold mb-2">{palette.name}</div>
                <div className="flex gap-1 mb-2">
                  {Object.entries(palette.colors)
                    .filter(([k]) => k.endsWith("Color"))
                    .map(([k, v]) => (
                      <span
                        key={k}
                        style={{
                          background: v as string,
                          display: "inline-block",
                          width: 20,
                          height: 20,
                          borderRadius: 4,
                          border: "1px solid #ccc",
                        }}
                        title={k}
                      />
                    ))}
                </div>
                <div>
                  <span
                    style={{
                      background: palette.colors.buttonColor,
                      color: palette.colors.buttonTextColor,
                      padding: "2px 8px",
                      borderRadius: palette.colors.borderRadius,
                      fontSize: 12,
                    }}
                  >
                    Button
                  </span>
                  <span
                    style={{
                      background: palette.colors.cardBackgroundColor,
                      color: palette.colors.foregroundColor,
                      padding: "2px 8px",
                      borderRadius: palette.colors.borderRadius,
                      fontSize: 12,
                      marginLeft: 8,
                    }}
                  >
                    Card
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Color Pickers for fine-tuning */}
          {/* <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="col-span-2 md:col-span-3 font-semibold text-lg">Light Theme Colors</div>
            {colorFieldsLight.map((key) => (
              <div key={key}>
                <Label htmlFor={key}>{key.replace(/([A-Z])/g, " $1")}</Label>
                <input
                  type="color"
                  id={key}
                  value={customizations[key]}
                  onChange={e => setCustomizations({ ...customizations, [key]: e.target.value })}
                  className="w-full h-10 p-0 border-none"
                  title={key}
                />
              </div>
            ))}
            <div className="col-span-2 md:col-span-3 font-semibold text-lg mt-4">Dark Theme Colors</div>
            {colorFieldsDark.map((key) => (
              <div key={key}>
                <Label htmlFor={key}>{key.replace(/([A-Z])/g, " $1")}</Label>
                <input
                  type="color"
                  id={key}
                  value={customizations[key]}
                  onChange={e => setCustomizations({ ...customizations, [key]: e.target.value })}
                  className="w-full h-10 p-0 border-none"
                  title={key}
                />
              </div>
            ))}
          </div> */}

         
          {/* Live Preview for Light and Dark Themes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            {/* Light Theme Preview */}
            <div>
              <div className="mb-2 font-semibold">Light Theme Preview</div>
              <div
                style={{
                  background: customizations.backgroundColor,
                  color: customizations.foregroundColor,
                  fontFamily: customizations.fontFamily,
                  borderRadius: customizations.borderRadius,
                  border: `1px solid ${customizations.primaryColor}`,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    background: customizations.navbarColor,
                    color: customizations.primaryColor,
                    padding: "1rem",
                    fontWeight: 700,
                  }}
                >
                  Navbar
                </div>
                <div style={{ padding: "2rem" }}>
                  <div
                    style={{
                      background: customizations.cardBackgroundColor,
                      color: customizations.foregroundColor,
                      borderRadius: customizations.borderRadius,
                      padding: "1rem",
                      marginBottom: "1rem",
                    }}
                  >
                    Card Example
                  </div>
                  <button
                    style={{
                      background: customizations.buttonColor,
                      color: customizations.buttonTextColor,
                      border: "none",
                      borderRadius: customizations.borderRadius,
                      padding: "0.5rem 1.5rem",
                      fontWeight: 600,
                    }}
                  >
                    Button
                  </button>
                  <a
                    href="#"
                    style={{
                      color: customizations.linkColor,
                      marginLeft: 16,
                      textDecoration: "underline",
                    }}
                  >
                    Link
                  </a>
                </div>
                <div
                  style={{
                    background: customizations.footerColor,
                    color: customizations.foregroundColor,
                    padding: "1rem",
                    textAlign: "center",
                  }}
                >
                  Footer
                </div>
              </div>
            </div>
            {/* Dark Theme Preview */}
            <div>
              <div className="mb-2 font-semibold">Dark Theme Preview</div>
              <div
                style={{
                  background: customizations.backgroundColorDark,
                  color: customizations.foregroundColorDark,
                  fontFamily: customizations.fontFamily,
                  borderRadius: customizations.borderRadius,
                  border: `1px solid ${customizations.primaryColor}`,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    background: customizations.navbarColorDark,
                    color: customizations.primaryColor,
                    padding: "1rem",
                    fontWeight: 700,
                  }}
                >
                  Navbar
                </div>
                <div style={{ padding: "2rem" }}>
                  <div
                    style={{
                      background: customizations.cardBackgroundColorDark,
                      color: customizations.foregroundColorDark,
                      borderRadius: customizations.borderRadius,
                      padding: "1rem",
                      marginBottom: "1rem",
                    }}
                  >
                    Card Example
                  </div>
                  <button
                    style={{
                      background: customizations.buttonColorDark,
                      color: customizations.buttonTextColorDark,
                      border: "none",
                      borderRadius: customizations.borderRadius,
                      padding: "0.5rem 1.5rem",
                      fontWeight: 600,
                    }}
                  >
                    Button
                  </button>
                  <a
                    href="#"
                    style={{
                      color: customizations.linkColorDark,
                      marginLeft: 16,
                      textDecoration: "underline",
                    }}
                  >
                    Link
                  </a>
                </div>
                <div
                  style={{
                    background: customizations.footerColorDark,
                    color: customizations.foregroundColorDark,
                    padding: "1rem",
                    textAlign: "center",
                  }}
                >
                  Footer
                </div>
              </div>
            </div>
          </div>

           {/* Font Family Selector */}
           <div className="space-y-2">
            <Label htmlFor="fontFamily">Font Family</Label>
            <Select value={customizations.fontFamily} onValueChange={val => setCustomizations({ ...customizations, fontFamily: val })}>
              <SelectTrigger id="fontFamily">
                <SelectValue placeholder="Select font family" />
              </SelectTrigger>
              <SelectContent className="bg-background dark:bg-background-dark">
                <SelectItem className="cursor-pointer" value="Inter">Inter</SelectItem>
                <SelectItem className="cursor-pointer" value="Roboto">Roboto</SelectItem>
                <SelectItem className="cursor-pointer" value="Poppins">Poppins</SelectItem>
                <SelectItem className="cursor-pointer" value="Montserrat">Montserrat</SelectItem>
                <SelectItem className="cursor-pointer" value="Open Sans">Open Sans</SelectItem>
                <SelectItem className="cursor-pointer" value="Quicksand">Quicksand</SelectItem>
                <SelectItem className="cursor-pointer" value="Orbitron">Orbitron</SelectItem>
                <SelectItem className="cursor-pointer" value="Playfair Display">Playfair Display</SelectItem>
                <SelectItem className="cursor-pointer" value="Lora">Lora</SelectItem>
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
