import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { AboutForm } from "@/components/dashboard/about-form"
import { ContactForm } from "@/components/dashboard/contact-form"
import DashboardProfileMenu from "@/components/dashboard/DashboardProfileMenu"
import { EducationForm } from "@/components/dashboard/education-form"
import { ExperienceForm } from "@/components/dashboard/experience-form"
import { HeroForm } from "@/components/dashboard/hero-form"
import { ProjectForm } from "@/components/dashboard/project-form"
import { ThemeForm } from "@/components/dashboard/theme-form"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import connectDB from "@/lib/db"
import Portfolio from "@/models/Portfolio"
import { ExternalLink } from "lucide-react"
import { getServerSession } from "next-auth/next"
import Link from "next/link"
import { redirect } from "next/navigation"
export default async function Dashboard() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  await connectDB()

  try {
    const portfolio = await Portfolio.findOne({ user: session.user.id })

    if (!portfolio) {
      // This shouldn't happen as we create a portfolio on registration
      // But just in case, redirect to a page to create one
      redirect("/dashboard")
    }

    // Convert MongoDB document to plain object and stringify/parse to handle dates and ObjectIDs
    const portfolioData = JSON.parse(JSON.stringify(portfolio))

    return (
      <div className="container py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <Link href={`/${session.user.username}`} target="_blank">
              <Button variant="outline" className="hidden md:flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                View Portfolio
              </Button>
            </Link>
            <ThemeToggle />
            {/* Profile Button Dropdown */}
            <DashboardProfileMenu />
          </div>
        </div>

        <Tabs defaultValue="hero" className="w-full">
          <TabsList className="mb-6 flex flex-wrap gap-2 overflow-x-auto whitespace-nowrap sm:justify-center">
            <TabsTrigger value="hero">Hero Section</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="theme">Theme</TabsTrigger>
          </TabsList>




          <TabsContent value="hero" className="space-y-4">
            <HeroForm portfolio={portfolioData} />
          </TabsContent>

          <TabsContent value="about" className="space-y-4">
            <AboutForm portfolio={portfolioData} />
          </TabsContent>


          <TabsContent value="projects" className="space-y-4">
            <ProjectForm projects={portfolioData.projects || []} />
          </TabsContent>

          <TabsContent value="contact" className="space-y-4">
            <ContactForm portfolio={portfolioData} />
          </TabsContent>

          <TabsContent value="theme" className="space-y-4">
            <ThemeForm portfolio={portfolioData} />
          </TabsContent>

          <TabsContent value="experience" className="space-y-4">
            <ExperienceForm experiences={portfolioData.experiences || []} />
          </TabsContent>

          <TabsContent value="education" className="space-y-4">
            <EducationForm educationList={portfolioData.education || []} />
          </TabsContent>
        </Tabs>
      </div>
    )
  } catch (error) {
    console.error("Error loading portfolio:", error)
    return (
      <div className="container py-8">
        <div className="rounded-lg border border-destructive p-8 text-center">
          <h3 className="text-lg font-medium text-destructive">loading portfolio</h3>
          <p className="mt-2 text-muted-foreground">
            There was a problem loading your portfolio data. Please try again later.
          </p>
        </div>
      </div>
    )
  }
}
