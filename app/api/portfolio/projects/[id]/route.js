import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import mongoose from "mongoose"
import connectDB from "@/lib/db"
import Portfolio from "@/models/Portfolio"
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

    // Validate required fields
    if (!projectData.title) {
      return NextResponse.json({ error: "Project title is required" }, { status: 400 })
    }

    if (!projectData.description) {
      return NextResponse.json({ error: "Project description is required" }, { status: 400 })
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

    // Ensure technologies is an array
    if (!Array.isArray(projectData.technologies)) {
      projectData.technologies = []
    }

    // Prepare the update data
    const updateData = {
      "projects.$.title": projectData.title,
      "projects.$.description": projectData.description,
      "projects.$.image": projectData.image || "",
      "projects.$.link": projectData.link || "",
      "projects.$.github": projectData.github || "",
      "projects.$.technologies": projectData.technologies,
      "projects.$.featured": Boolean(projectData.featured),
      "projects.$.order": typeof projectData.order === "number" ? projectData.order : 0,
      updatedAt: Date.now(),
    }

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
