"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImagePlus, Trash2 } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

interface AboutFormProps {
  portfolio: any
}

export function AboutForm({ portfolio }: AboutFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const [aboutTitle, setAboutTitle] = useState(portfolio.aboutTitle || "")
  const [aboutLocation, setAboutLocation] = useState(portfolio.aboutLocation || "")
  const [aboutBio, setAboutBio] = useState(portfolio.aboutBio || "")
  const [aboutDescription, setAboutDescription] = useState(portfolio.aboutDescription || "")

  const [aboutProfileImage, setAboutProfileImage] = useState(portfolio.aboutProfileImage || "")
  const [imageFile, setImageFile] = useState<File | null>(null)

  const [skills, setSkills] = useState<{ name: string; image: string; file: File | null }[]>(
    portfolio.skills?.length
      ? portfolio.skills.map((s: any) => ({
          name: s.name,
          image: s.image,
          file: null,
        }))
      : []
  )

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      setAboutProfileImage(reader.result as string)
      setImageFile(file)
    }
    reader.readAsDataURL(file)
  }

  const handleSkillImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      const newSkills = [...skills]
      newSkills[index].image = reader.result as string
      newSkills[index].file = file
      setSkills(newSkills)
    }
    reader.readAsDataURL(file)
  }

  const addSkill = () => {
    setSkills([...skills, { name: "", image: "", file: null }])
  }

  const removeSkill = (index: number) => {
    const newSkills = [...skills]
    newSkills.splice(index, 1)
    setSkills(newSkills)
  }

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append("file", file)

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    })

    if (!res.ok) throw new Error("Image upload failed")

    const data = await res.json()
    return data.url
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Validation: Profile image required
    if (!aboutTitle) {
      toast.error("About Title Required. Please write a about title.")
      return
    }
    if (!aboutLocation) {
      toast.error("Location Required. Please write a location.")
      return
    }
    if (!aboutDescription) {
      toast.error("About Bio Required. Please write a bio.")
      return
    }
    if (!aboutBio) {
      toast.error("About Description Required. Please write a description")
      return
    }
    if (!aboutProfileImage) {
      toast.error("About Image Required. Please upload an image")
      return
    }
    // Validation: Each skill must have an image and a name
    for (let i = 0; i < skills.length; i++) {
      if (!skills[i].name.trim()) {
        toast.error(`Skill Name Required. Please enter a name for skill #${i + 1}.`)
        return
      }
      if (!skills[i].image) {
        toast.error(`Skill Image Required. Please upload an image for skill #${i + 1}.`)
        return
      }
    }
    setIsLoading(true)

    try {
      let profileImageUrl = aboutProfileImage

      if (imageFile) {
        profileImageUrl = await uploadImage(imageFile)
      }

      const updatedSkills = await Promise.all(
        skills.map(async (skill) => {
          let imageUrl = skill.image
          if (skill.file) {
            imageUrl = await uploadImage(skill.file)
          }
          return { name: skill.name, image: imageUrl }
        })
      )

      const res = await fetch("/api/portfolio/about", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          aboutTitle,
          aboutLocation,
          aboutBio,
          aboutDescription,
          aboutProfileImage: profileImageUrl,
          skills: updatedSkills,
        }),
      })

      if (!res.ok) throw new Error("Failed to update about section")

      toast.success("Your about section has been updated.")

      router.refresh()
    } catch (error) {
      console.error("Error updating about section:", error)
      toast.error("Failed to update about section. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="container mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold">About Section</h2>
        </CardHeader>
        <CardContent className="space-y-6">

          {/* About Title */}
          <div>
            <Label>Title</Label>
            <Input
              value={aboutTitle}
              onChange={(e) => setAboutTitle(e.target.value)}
              placeholder="Enter your title"
            />
          </div>

          {/* Location */}
          <div>
            <Label>Location</Label>
            <Input
              value={aboutLocation}
              onChange={(e) => setAboutLocation(e.target.value)}
              placeholder="Enter your location"
            />
          </div>

          {/* Description */}
          <div>
            <Label>Bio</Label>
            <Textarea
              value={aboutDescription}
              onChange={(e) => setAboutDescription(e.target.value)}
              placeholder="Write a short bio"
            />
          </div>
          {/* Bio */}
          <div>
            <Label>Description</Label>
            <Textarea
              value={aboutBio}
              onChange={(e) => setAboutBio(e.target.value)}
              placeholder="Detailed description about you"
            />
          </div>


          {/* Profile Image */}
          <div>
            <Label>Profile Image</Label>
            {aboutProfileImage && (
              <div className="relative w-32 h-32 my-2">
                <Image src={aboutProfileImage} alt="Profile" fill className="object-cover rounded-full" />
              </div>
            )}
            <Input type="file" accept="image/*" onChange={handleProfileImageChange} />
          </div>

          {/* Skills Section */}
          <div className="space-y-4">
  <Label>Skills</Label>

  {skills.map((skill, index) => (
    <div key={index} className="flex flex-col gap-2 border p-4 rounded-lg">
      <div className="flex items-center justify-between">
        <Input
          value={skill.name}
          onChange={(e) => {
            const newSkills = [...skills]
            newSkills[index].name = e.target.value
            setSkills(newSkills)
          }}
          placeholder="e.g. React, Tailwind"
        />
        <Button
          type="button"
         
          size="icon"
          className="ml-2 p-1 bg-red-700 hover:bg-red-800 dark:text-white"
          onClick={() => {
            const newSkills = [...skills]
            newSkills.splice(index, 1)
            setSkills(newSkills)
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {skill.image ? (
        <div className="relative h-20 w-20 overflow-hidden rounded-lg border">
          <Image src={skill.image} alt="Skill" fill className="object-contain" />
          <Button
            type="button"
           
            size="icon"
            className="absolute right-0 top-0 p-1 bg-red-700 hover:bg-red-800 dark:text-white"
            onClick={() => {
              const newSkills = [...skills]
              newSkills[index].image = ""
              newSkills[index].file = null
              setSkills(newSkills)
            }}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <div className="flex h-24 w-24 flex-col items-center justify-center rounded-lg border border-dashed p-2">
          <ImagePlus className="mb-1 h-6 w-6 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">Upload image</p>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => handleSkillImageChange(e, index)}
            className="mt-1 cursor-pointer"
          />
        </div>
      )}

    </div>
  ))}

  <Button type="button" variant="outline" onClick={addSkill}>
    + Add Skill
  </Button>
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
