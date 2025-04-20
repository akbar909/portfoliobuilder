"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ImagePlus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

interface HeroFormProps {
  portfolio: {
    heroType: "text" | "image"
    heroTitle: string
    heroSubtitle: string
    heroImage?: string
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
          ...(heroType === "image" && { heroImage: imageUrl }),
        }),
      })

      if (!res.ok) {
        throw new Error("Failed to update portfolio")
      }

      toast({
        title: "Success",
        description: "Your hero section has been updated.",
      })

      router.refresh()
    } catch (error) {
      console.error("Error updating hero section:", error)
      toast({
        title: "Error",
        description: "Failed to update hero section. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Hero Section</CardTitle>
          <CardDescription>Customize how the hero section of your portfolio appears to visitors.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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
                    variant="destructive"
                    size="icon"
                    className="absolute right-2 top-2"
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
