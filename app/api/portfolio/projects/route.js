import connectDB from "@/lib/db"
import Portfolio from "@/models/Portfolio"
import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
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

    await connectDB()

    const portfolio = await Portfolio.findOne({ user: session.user.id })

    if (!portfolio) {
      return NextResponse.json({ error: "Portfolio not found" }, { status: 404 })
    }

    // Ensure technologies is an array for development, otherwise ignore
    let technologies = []
    if (type === "development") {
      technologies = Array.isArray(projectData.technologies) ? projectData.technologies : []
    }

    // Ensure other fields have default values if not provided
    const newProject = {
      title: projectData.title,
      description: projectData.description,
      type,
      image: projectData.image || "",
      link: type === "development" ? (projectData.link || "") : undefined,
      github: type === "development" ? (projectData.github || "") : undefined,
      technologies,
      featured: Boolean(projectData.featured),
      order: typeof projectData.order === "number" ? projectData.order : portfolio.projects.length,
    }
    // Remove undefined fields for design/other
    Object.keys(newProject).forEach(key => newProject[key] === undefined && delete newProject[key])

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
