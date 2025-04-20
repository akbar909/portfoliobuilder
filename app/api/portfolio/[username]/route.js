import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import User from "@/models/User"
import Portfolio from "@/models/Portfolio"

export async function GET(request, { params }) {
  try {
    const { username } = params

    await connectDB()

    const user = await User.findOne({ username })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const portfolio = await Portfolio.findOne({ user: user._id })

    if (!portfolio) {
      return NextResponse.json({ error: "Portfolio not found" }, { status: 404 })
    }

    // Remove sensitive information
    const safePortfolio = {
      ...portfolio.toObject(),
      user: {
        name: user.name,
        username: user.username,
        image: user.image,
      },
    }

    return NextResponse.json(safePortfolio)
  } catch (error) {
    console.error("Error fetching portfolio by username:", error)
    return NextResponse.json({ error: "Failed to fetch portfolio" }, { status: 500 })
  }
}
