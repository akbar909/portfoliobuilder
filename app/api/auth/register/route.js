import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import connectDB from "@/lib/db"
import User from "@/models/User"
import Portfolio from "@/models/Portfolio"

export async function POST(request) {
  try {
    const { name, email, username, password } = await request.json()

    await connectDB()

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    })

    if (existingUser) {
      return NextResponse.json({ error: "User with this email or username already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user
    const user = await User.create({
      name,
      email,
      username,
      password: hashedPassword,
    })

    // Create default portfolio for the user with initialized basic about fields
    await Portfolio.create({
      user: user._id,
      aboutDescription: "I am a developer passionate about building web applications.",
      aboutTitle: "Full Stack Developer",
    })

    return NextResponse.json({ success: true, message: "User registered successfully" }, { status: 201 })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Failed to register user" }, { status: 500 })
  }
}
