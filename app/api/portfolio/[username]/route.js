import connectDB from "@/lib/db";
import Portfolio from "@/models/Portfolio";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { username } = await params;

    await connectDB()

    const user = await User.findOne({ username })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const portfolio = await Portfolio.findOne({ user: user._id })

    if (!portfolio) {
      return NextResponse.json({ error: "Portfolio not found" }, { status: 404 })
    }

    // console.log("Fetched portfolio experiences:", portfolio.experiences);

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
