import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import connectDB from "@/lib/db"
import Portfolio from "@/models/Portfolio"
import { authOptions } from "../../auth/[...nextauth]/route"

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

    return NextResponse.json({ projects: portfolio.projects || [] })
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const projectData = await request.json()

    // Validate required fields
    if (!projectData.title) {
      return NextResponse.json({ error: "Project title is required" }, { status: 400 })
    }

    if (!projectData.description) {
      return NextResponse.json({ error: "Project description is required" }, { status: 400 })
    }

    await connectDB()

    const portfolio = await Portfolio.findOne({ user: session.user.id })

    if (!portfolio) {
      return NextResponse.json({ error: "Portfolio not found" }, { status: 404 })
    }

    // Ensure technologies is an array
    if (!Array.isArray(projectData.technologies)) {
      projectData.technologies = []
    }

    // Ensure other fields have default values if not provided
    const newProject = {
      title: projectData.title,
      description: projectData.description,
      image: projectData.image || "",
      link: projectData.link || "",
      github: projectData.github || "",
      technologies: projectData.technologies,
      featured: Boolean(projectData.featured),
      order: typeof projectData.order === "number" ? projectData.order : portfolio.projects.length,
    }

    // Add the new project to the projects array
    portfolio.projects.push(newProject)
    portfolio.updatedAt = Date.now()

    await portfolio.save()

    return NextResponse.json({
      message: "Project added successfully",
      project: portfolio.projects[portfolio.projects.length - 1],
    })
  } catch (error) {
    console.error("Error adding project:", error)
    return NextResponse.json(
      {
        error: "Failed to add project",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
