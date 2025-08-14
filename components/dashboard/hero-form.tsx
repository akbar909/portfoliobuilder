"use client"

import type React from "react"

import { HeroSection } from "@/components/portfolio/hero-section"
import HeroTemplateSelector from "@/components/portfolio/HeroTemplateSelector"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImagePlus, Trash2 } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

interface HeroFormProps {
  portfolio: {
    heroType: "text" | "image"
    heroTitle: string
    heroSubtitle: string
    heroImage?: string
    heroTemplate?: "hero1" | "hero2" | "hero3"
  }
}

export function HeroForm({ portfolio }: HeroFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [heroType, setHeroType] = useState<"text" | "image">(portfolio.heroType)
  const [heroTitle, setHeroTitle] = useState(portfolio.heroTitle)
  const [heroSubtitle, setHeroSubtitle] = useState(portfolio.heroSubtitle)
  const [heroImage, setHeroImage] = useState(portfolio.heroImage || "")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [heroTemplate, setHeroTemplate] = useState<"hero1" | "hero2" | "hero3">((portfolio as any).heroTemplate || "hero1")
  const { theme } = useTheme();

  // Add a customizations state for preview colors (copy from theme-form)
  const [customizations, setCustomizations] = useState({
    primaryColor: "#2563eb",
    backgroundColor: "#ffffff",
    backgroundColorDark: "#18181b",
    foregroundColor: "#111827",
    foregroundColorDark: "#f4f4f5",
    secondaryColor: "#6366f1",
    secondaryColorDark: "#818cf8",
    buttonColor: "#2563eb",
    buttonColorDark: "#3b82f6",
    buttonTextColor: "#ffffff",
    buttonTextColorDark: "#f4f4f5",
    cardBackgroundColor: "#f3f4f6",
    cardBackgroundColorDark: "#27272a",
    linkColor: "#2563eb",
    linkColorDark: "#818cf8",
    navbarColor: "#ffffff",
    navbarColorDark: "#18181b",
    footerColor: "#f9fafb",
    footerColorDark: "#27272a",
    borderRadius: "0.5rem",
    fontFamily: "Inter",
  });

  // Always set heroType to 'image' and hide the select
  useEffect(() => {
    setHeroType("image")
  }, [])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      // Create a preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setHeroImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Require image if heroType is 'image'
    if (heroType === "image" && !heroImage) {
      toast.error("Hero image is required.")
      setIsLoading(false)
      return
    }

    try {
      let imageUrl = heroImage

      // Upload image if there's a new file
      if (imageFile) {
        const formData = new FormData()
        formData.append("file", imageFile)

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!uploadRes.ok) {
          throw new Error("Failed to upload image")
        }

        const { url } = await uploadRes.json()
        imageUrl = url
      }

      // Update portfolio
      const res = await fetch("/api/portfolio", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          heroType,
          heroTitle,
          heroSubtitle,
          heroTemplate,
          ...(heroType === "image" && { heroImage: imageUrl }),
        }),
      })

      if (!res.ok) {
        throw new Error("Failed to update portfolio")
      }

      toast.success("Your hero section has been updated.")

      router.refresh()
    } catch (error) {
      console.error("Error updating hero section:", error)
      toast.error("Failed to update hero section. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
  <div >
    <form onSubmit={handleSubmit} className=" mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Hero Section</CardTitle>
          <CardDescription>Customize how the hero section of your portfolio appears to visitors.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Hide heroType select, always use image */}
          {/*
          <div className="space-y-2">
            <Label htmlFor="heroType">Hero Type</Label>
            <Select value={heroType} onValueChange={(value) => setHeroType(value as "text" | "image")}> 
              <SelectTrigger id="heroType">
                <SelectValue placeholder="Select hero type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text Only</SelectItem>
                <SelectItem value="image">Image Background</SelectItem>
              </SelectContent>
            </Select>
          </div>
          */}

          <div className="space-y-2">
            <Label htmlFor="heroTitle">Title</Label>
            <Input
              id="heroTitle"
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              placeholder="Enter a title for your hero section"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="heroSubtitle">Subtitle</Label>
            <Textarea
              id="heroSubtitle"
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              placeholder="Enter a subtitle for your hero section"
              rows={3}
            />
          </div>

          {heroType === "image" && (
            <div className="space-y-4">
              <Label>Hero Image</Label>
              {heroImage ? (
                <div className="relative aspect-video max-w-96 overflow-hidden rounded-lg border">
                  <Image src={heroImage || "/placeholder.svg"} alt="Hero image preview" fill className="object-cover" />
                  <Button
                    type="button"
                    size="icon"
                    className="absolute right-2 top-2 bg-red-700 hover:bg-red-800 dark:text-white"
                    onClick={() => {
                      setHeroImage("")
                      setImageFile(null)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex aspect-video max-w-96 flex-col items-center justify-center rounded-lg border border-dashed p-4">
                  <ImagePlus className="mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Upload an image for your hero section</p>
                  <div className="mt-4">
                    <Input
                      id="heroImage"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
          <div className="space-y-2 max-w-sm">
            <Label>Hero Template</Label>
            <HeroTemplateSelector
              current={heroTemplate}
              onChange={setHeroTemplate}
            />
          </div>
        </CardContent>
        <CardFooter>
          <div className="mt-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </form>
      <div className="mt-8 space-y-6">
        <div className="space-y-2">
          <Label>Live Preview</Label>
          <div
            className="border rounded-lg mx-auto bg-muted p-4"
            style={{
              borderColor: customizations.primaryColor,
              background: theme === "dark" ? customizations.backgroundColorDark : customizations.backgroundColor,
            }}
          >
            <HeroSection
              heroTemplate={heroTemplate}
              title={heroTitle}
              subtitle={heroSubtitle}
              imageUrl={heroImage}
              primaryColor={customizations.primaryColor}
              backgroundColor={customizations.backgroundColor}
              backgroundColorDark={customizations.backgroundColorDark}
              foregroundColor={customizations.foregroundColor}
              foregroundColorDark={customizations.foregroundColorDark}
              secondaryColor={customizations.secondaryColor}
              secondaryColorDark={customizations.secondaryColorDark}
              buttonColor={customizations.buttonColor}
              buttonColorDark={customizations.buttonColorDark}
              buttonTextColor={customizations.buttonTextColor}
              buttonTextColorDark={customizations.buttonTextColorDark}
            />
          </div>
        </div>
      </div>
      </div>
  )
}
