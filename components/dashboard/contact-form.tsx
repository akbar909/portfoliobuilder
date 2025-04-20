"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Mail, Linkedin, Github, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

interface ContactFormProps {
  portfolio: {
    contact?: {
      email?: string
      linkedin?: string
      github?: string
      twitter?: string
    }
  }
}

export function ContactForm({ portfolio }: ContactFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState(portfolio.contact?.email || "")
  const [linkedin, setLinkedin] = useState(portfolio.contact?.linkedin || "")
  const [github, setGithub] = useState(portfolio.contact?.github || "")
  const [twitter, setTwitter] = useState(portfolio.contact?.twitter || "")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Update portfolio with contact info
      const res = await fetch("/api/portfolio", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contact: {
            email,
            linkedin,
            github,
            twitter,
          },
        }),
      })

      if (!res.ok) {
        throw new Error("Failed to update contact information")
      }

      toast({
        title: "Success",
        description: "Your contact information has been updated.",
      })

      router.refresh()
    } catch (error) {
      console.error("Error updating contact information:", error)
      toast({
        title: "Error",
        description: "Failed to update contact information. Please try again.",
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
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>
            Add your contact details so visitors can reach out to you. These will be displayed in the contact section of
            your portfolio.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" /> Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
            />
            <p className="text-xs text-muted-foreground">Your primary contact email address.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedin" className="flex items-center gap-2">
              <Linkedin className="h-4 w-4" /> LinkedIn Profile
            </Label>
            <Input
              id="linkedin"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              placeholder="https://linkedin.com/in/yourprofile"
              type="url"
            />
            <p className="text-xs text-muted-foreground">Full URL to your LinkedIn profile.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="github" className="flex items-center gap-2">
              <Github className="h-4 w-4" /> GitHub Profile
            </Label>
            <Input
              id="github"
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              placeholder="https://github.com/yourusername"
              type="url"
            />
            <p className="text-xs text-muted-foreground">Full URL to your GitHub profile.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="twitter" className="flex items-center gap-2">
              <Twitter className="h-4 w-4" /> Twitter/X Profile
            </Label>
            <Input
              id="twitter"
              value={twitter}
              onChange={(e) => setTwitter(e.target.value)}
              placeholder="https://twitter.com/yourusername"
              type="url"
            />
            <p className="text-xs text-muted-foreground">Full URL to your Twitter/X profile.</p>
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
