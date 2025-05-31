import connectDB from "@/lib/db"
import Portfolio from "@/models/Portfolio"
import mongoose from "mongoose"
import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { authOptions } from "../../../auth/[...nextauth]/route"

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 })
    }

    await connectDB()

    const portfolio = await Portfolio.findOne({
      user: session.user.id,
      "projects._id": id,
    })

    if (!portfolio) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const project = portfolio.projects.find((p) => p._id.toString() === id)

    return NextResponse.json({ project })
  } catch (error) {
    console.error("Error fetching project:", error)
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params
    const projectData = await request.json()

    // Set type, default to 'development' if not provided
    const type = projectData.type || "development"

    // Validate required fields based on type
    if (!projectData.title) {
      return NextResponse.json({ error: "Project title is required" }, { status: 400 })
    }
    if (!projectData.description) {
      return NextResponse.json({ error: "Project description is required" }, { status: 400 })
    }
    if ((type === "design" || type === "other") && !projectData.image) {
      return NextResponse.json({ error: "Project image is required for design/other projects" }, { status: 400 })
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 })
    }

    await connectDB()

    const portfolio = await Portfolio.findOne({
      user: session.user.id,
      "projects._id": id,
    })

    if (!portfolio) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Ensure technologies is an array for development, otherwise ignore
    let technologies = []
    if (type === "development") {
      technologies = Array.isArray(projectData.technologies) ? projectData.technologies : []
    }

    // Prepare the update data
    const updateData = {
      "projects.$.title": projectData.title,
      "projects.$.description": projectData.description,
      "projects.$.type": type,
      "projects.$.image": projectData.image || "",
      "projects.$.link": type === "development" ? (projectData.link || "") : undefined,
      "projects.$.github": type === "development" ? (projectData.github || "") : undefined,
      "projects.$.technologies": technologies,
      "projects.$.featured": Boolean(projectData.featured),
      "projects.$.order": typeof projectData.order === "number" ? projectData.order : 0,
      updatedAt: Date.now(),
    }
    // Remove undefined fields for design/other
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key])

    // Update the project
    const updatedPortfolio = await Portfolio.findOneAndUpdate(
      {
        user: session.user.id,
        "projects._id": id,
      },
      { $set: updateData },
      { new: true },
    )

    const updatedProject = updatedPortfolio.projects.find((p) => p._id.toString() === id)

    return NextResponse.json({
      message: "Project updated successfully",
      project: updatedProject,
    })
  } catch (error) {
    console.error("Error updating project:", error)
    return NextResponse.json(
      {
        error: "Failed to update project",
        details: error.message,
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 })
    }

    await connectDB()

    const portfolio = await Portfolio.findOne({
      user: session.user.id,
      "projects._id": id,
    })

    if (!portfolio) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Remove the project
    await Portfolio.findOneAndUpdate(
      { user: session.user.id },
      {
        $pull: { projects: { _id: id } },
        $set: { updatedAt: Date.now() },
      },
    )

    return NextResponse.json({ message: "Project deleted successfully" })
  } catch (error) {
    console.error("Error deleting project:", error)
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 })
  }
}
