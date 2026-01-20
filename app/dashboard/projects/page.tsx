import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { ProjectForm } from "@/components/dashboard/project-form"
import connectDB from "@/lib/db"
import Portfolio from "@/models/Portfolio"
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"

export default async function ProjectsPage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect("/auth/signin")
    }

    await connectDB()
    const portfolio = await Portfolio.findOne({ user: session.user.id })

    if (!portfolio) {
        redirect("/dashboard")
    }

    const portfolioData = JSON.parse(JSON.stringify(portfolio))

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-xl font-bold tracking-tight md:text-2xl">Projects</h1>
                <p className="text-muted-foreground">
                    Showcase your best work and achievements.
                </p>
            </div>
            <ProjectForm projects={portfolioData.projects || []} />
        </div>
    )
}
