import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { UserManagementTable } from "@/components/dashboard/UserManagementTable"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import connectDB from "@/lib/db"
import User from "@/models/User"
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"

export default async function SuperadminPage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect("/auth/signin")
    }

    // Check if user is superadmin
    if (session.user.role !== 'superadmin') {
        redirect("/dashboard")
    }

    await connectDB()

    // Fetch all users
    const users = await User.find().sort({ createdAt: -1 }).lean()
    const serializedUsers = JSON.parse(JSON.stringify(users))
    const userCount = users.length

    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-xl font-bold tracking-tight md:text-2xl">Superadmin Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                    Manage users, view their portfolios, and update roles.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="p-4">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="text-xl font-bold">{userCount}</div>
                        <p className="text-xs text-muted-foreground">
                            Registered users
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card className="overflow-hidden">
                <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-base">User Management</CardTitle>
                    <CardDescription className="text-xs">
                        View and manage all registered users.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                    <UserManagementTable users={serializedUsers} />
                </CardContent>
            </Card>
        </div>
    )
}
