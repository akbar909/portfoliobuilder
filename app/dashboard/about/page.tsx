import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { AboutForm } from "@/components/dashboard/about-form"
import connectDB from "@/lib/db"
import Portfolio from "@/models/Portfolio"
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"

export default async function AboutPage() {
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
                <h1 className="text-xl font-bold tracking-tight md:text-2xl">About Me</h1>
                <p className="text-muted-foreground">
                    Tell your story and highlight your skills and expertise.
                </p>
            </div>
            <AboutForm portfolio={portfolioData} />
        </div>
    )
}
