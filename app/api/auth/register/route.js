import connectDB from "@/lib/db"
import Portfolio from "@/models/Portfolio"
import User from "@/models/User"
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const { name, email, username, password,image, role } = await request.json()

    await connectDB()

    // Check if email already exists
    const existingEmail = await User.findOne({ email })
    if (existingEmail) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
    }

    // Check if username already exists
    const existingUsername = await User.findOne({ username })
    if (existingUsername) {
      return NextResponse.json({ error: "User with this username already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user
    const user = await User.create({
      name,
      email,
      username,
      password: hashedPassword,
      role: role || "user",
    }) 
   console.log(user)

    // Create default portfolio for the user with initialized basic about fields
    await Portfolio.create({
      user: user._id,
      aboutTitle: "Creative Individual",
      aboutDescription: "I am passionate about sharing my work and connecting with others through this platform.",
    });


    return NextResponse.json({ success: true, message: "User registered successfully" }, { status: 201 })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Failed to register user" }, { status: 500 })
  }
}
