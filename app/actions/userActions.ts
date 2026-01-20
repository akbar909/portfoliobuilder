"use server"

import connectDB from "@/lib/db"
import Portfolio from "@/models/Portfolio"
import User from "@/models/User"
import { revalidatePath } from "next/cache"

export async function deleteUser(userId: string) {
    try {
        await connectDB()

        // Delete user's portfolio first
        await Portfolio.findOneAndDelete({ user: userId })

        // Delete the user
        await User.findByIdAndDelete(userId)

        revalidatePath("/dashboard/superadmin")
        return { success: true }
    } catch (error) {
        console.error("Error deleting user:", error)
        return { success: false, error: "Failed to delete user" }
    }
}

export async function updateUserRole(userId: string, newRole: "user" | "superadmin") {
    try {
        await connectDB()

        await User.findByIdAndUpdate(userId, { role: newRole })

        revalidatePath("/dashboard/superadmin")
        return { success: true }
    } catch (error) {
        console.error("Error updating user role:", error)
        return { success: false, error: "Failed to update user role" }
    }
}
