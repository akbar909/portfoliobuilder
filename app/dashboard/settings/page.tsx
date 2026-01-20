import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import SettingsForm from "@/components/dashboard/SettingsForm"
import connectDB from "@/lib/db"
import User from "@/models/User"
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"

export default async function SettingsPage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect("/auth/signin")
    }

    await connectDB()
    const user = await User.findById(session.user.id).lean()

    if (!user) {
        redirect("/dashboard")
    }

    const plainUser = JSON.parse(JSON.stringify(user))

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-xl font-bold tracking-tight md:text-2xl">Settings</h1>
                <p className="text-muted-foreground">
                    Manage your account settings and preferences.
                </p>
            </div>
            <SettingsForm user={plainUser} />
        </div>
    )
}
