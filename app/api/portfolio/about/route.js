import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import connectDB from "@/lib/db"
import Portfolio from "@/models/Portfolio"
import { authOptions } from "../../auth/[...nextauth]/route"

export async function GET(request) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("user")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const portfolio = await Portfolio.findOne({ user: userId })

    if (!portfolio) {
      return NextResponse.json({ error: "Portfolio not found" }, { status: 404 })
    }

    return NextResponse.json({
      aboutDescription: portfolio.aboutDescription,
      aboutProfileImage: portfolio.aboutProfileImage,
      aboutTitle: portfolio.aboutTitle,
      aboutLocation: portfolio.aboutLocation,
      aboutBio: portfolio.aboutBio,
      skills: portfolio.skills || []
    })
  } catch (error) {
    console.error("Error fetching about section:", error)
    return NextResponse.json({ error: "Failed to fetch about section" }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    await connectDB()

    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized - Please log in" },
        { status: 401 }
      )
    }

    const data = await request.json()


    const updateData = {
      updatedAt: Date.now(),
      aboutDescription: data.aboutDescription || "",
      aboutProfileImage: data.aboutProfileImage || "",
      aboutTitle: data.aboutTitle || "",
      aboutLocation: data.aboutLocation || "",
      aboutBio: data.aboutBio || "",
      skills: Array.isArray(data.skills) ? data.skills : []
    }

    const portfolio = await Portfolio.findOneAndUpdate(
      { user: session.user.id },
      { $set: updateData },
      {
        new: true,
        runValidators: true
      }
    )

    if (!portfolio) {
      return NextResponse.json(
        { error: "Portfolio not found for this user" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      portfolio: {
        aboutDescription: portfolio.aboutDescription,
        aboutProfileImage: portfolio.aboutProfileImage,
        aboutTitle: portfolio.aboutTitle,
        aboutLocation: portfolio.aboutLocation,
        aboutBio: portfolio.aboutBio,
        skills: portfolio.skills || []
      }
    })

  } catch (error) {
    console.error("Error in PUT /api/portfolio/about:", error)
    return NextResponse.json(
      {
        error: error.message || "Server error during update",
        details: error.errors || null
      },
      { status: 500 }
    )
  }
}
