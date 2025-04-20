import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import connectDB from "@/lib/db"
import Portfolio from "@/models/Portfolio"
import { authOptions } from "../auth/[...nextauth]/route"

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const portfolio = await Portfolio.findOne({ user: session.user.id })

    if (!portfolio) {
      return NextResponse.json({ error: "Portfolio not found" }, { status: 404 })
    }

    return NextResponse.json(portfolio)
  } catch (error) {
    console.error("Error fetching portfolio:", error)
    return NextResponse.json({ error: "Failed to fetch portfolio" }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    await connectDB()

    // Create update object with only the fields that are provided
    const updateData = {
      updatedAt: Date.now(),
    }

    // Handle hero section fields
    if (data.heroType !== undefined) updateData.heroType = data.heroType
    if (data.heroTitle !== undefined) updateData.heroTitle = data.heroTitle
    if (data.heroSubtitle !== undefined) updateData.heroSubtitle = data.heroSubtitle
    if (data.heroImage !== undefined) updateData.heroImage = data.heroImage

    // Handle about section fields
    if (data.aboutDescription !== undefined) updateData.aboutDescription = data.aboutDescription
    if (data.aboutProfileImage !== undefined) updateData.aboutProfileImage = data.aboutProfileImage
    if (data.aboutTitle !== undefined) updateData.aboutTitle = data.aboutTitle
    if (data.aboutLocation !== undefined) updateData.aboutLocation = data.aboutLocation
    if (data.aboutBio !== undefined) updateData.aboutBio = data.aboutBio

    // Handle arrays
    if (data.skills !== undefined) updateData.skills = data.skills
    if (data.experiences !== undefined) updateData.experiences = data.experiences
    if (data.education !== undefined) updateData.education = data.education
    if (data.projects !== undefined) updateData.projects = data.projects

    // Handle other objects
    if (data.contact !== undefined) updateData.contact = data.contact
    if (data.customizations !== undefined) updateData.customizations = data.customizations
    if (data.theme !== undefined) updateData.theme = data.theme

    const portfolio = await Portfolio.findOneAndUpdate(
      { user: session.user.id },
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      }
    )
    

    if (!portfolio) {
      return NextResponse.json({ error: "Portfolio not found" }, { status: 404 })
    }

    return NextResponse.json(portfolio)
  } catch (error) {
    console.error("Error updating portfolio:", error)
    return NextResponse.json({ error: "Failed to update portfolio" }, { status: 500 })
  }
}
