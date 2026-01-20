import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import connectDB from "@/lib/db"
import Portfolio from "@/models/Portfolio"
import {
  Briefcase,
  ExternalLink,
  FolderKanban,
  GraduationCap,
  Image,
  Mail,
  Palette,
  User
} from "lucide-react"
import { getServerSession } from "next-auth/next"
import Link from "next/link"
import { redirect } from "next/navigation"

const quickActions = [
  {
    title: "Hero Section",
    description: "Customize your hero banner and introduction",
    href: "/dashboard/hero",
    icon: Image,
  },
  {
    title: "About",
    description: "Tell your story and highlight your skills",
    href: "/dashboard/about",
    icon: User,
  },
  {
    title: "Projects",
    description: "Showcase your best work and achievements",
    href: "/dashboard/projects",
    icon: FolderKanban,
  },
  {
    title: "Experience",
    description: "Add your professional work history",
    href: "/dashboard/experience",
    icon: Briefcase,
  },
  {
    title: "Education",
    description: "List your academic qualifications",
    href: "/dashboard/education",
    icon: GraduationCap,
  },
  {
    title: "Contact",
    description: "Set up how people can reach you",
    href: "/dashboard/contact",
    icon: Mail,
  },
  {
    title: "Theme",
    description: "Customize colors and appearance",
    href: "/dashboard/theme",
    icon: Palette,
  },
]

export default async function DashboardOverview() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  await connectDB()
  const portfolio = await Portfolio.findOne({ user: session.user.id })

  if (!portfolio) {
    redirect("/dashboard")
  }

  const projectCount = portfolio.projects?.length || 0
  const experienceCount = portfolio.experiences?.length || 0
  const educationCount = portfolio.education?.length || 0

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight md:text-2xl">
            Welcome back, {session.user.name?.split(" ")[0] || "there"}! 👋
          </h1>
          <p className="text-muted-foreground">
            Manage your portfolio and make it shine.
          </p>
        </div>
        <Link href={`/${session.user.username}`} target="_blank">
          <Button className="gap-2">
            <ExternalLink className="h-4 w-4" />
            View Portfolio
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projects</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{projectCount}</div>
            <p className="text-xs text-muted-foreground">
              Portfolio projects
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Experience</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{experienceCount}</div>
            <p className="text-xs text-muted-foreground">
              Work experiences
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Education</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{educationCount}</div>
            <p className="text-xs text-muted-foreground">
              Academic entries
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <Card className="h-full transition-colors hover:bg-muted/50">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <action.icon className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base">{action.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{action.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
