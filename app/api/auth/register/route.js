import connectDB from "@/lib/db"
import Portfolio from "@/models/Portfolio"
import User from "@/models/User"
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

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

    // Generate verification code and expiry
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const codeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Create new user (unverified, with code)
    const user = await User.create({
      name,
      email,
      username,
      password: hashedPassword,
      role: role || "user",
      verified: false,
      verificationCode,
      verificationCodeExpires: codeExpires,
    })

    // Send verification code email
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    await transporter.sendMail({
      from: `"Portfolio Builder" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Verify Your Portfolio Builder Account",
      html: `
        <!DOCTYPE html>
        <html>
          <body style="margin: 0; padding: 20px; background-color: #f6f9fc; font-family: Arial, sans-serif;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; padding: 40px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <img src="https://img.freepik.com/free-vector/portfolio-management-previous-projects-samples-works-catalog-skills-presentation-successful-business-projects-completion-vector-isolated-concept-metaphor-illustration_335657-2952.jpg" alt="Portfolio Builder Logo" style="display: block; margin: 0 auto 30px; max-width: 200px;">
              <h1 style="color: #1a1a1a; font-size: 24px; margin: 0 0 20px; text-align: center;">Welcome to Portfolio Builder!</h1>
              <p style="color: #4a5568; font-size: 16px; line-height: 24px; margin-bottom: 30px;">Hi ${name},</p>
              <p style="color: #4a5568; font-size: 16px; line-height: 24px;">Thank you for creating an account. To complete your registration, please use the verification code below:</p>
              <div style="background-color: #f8fafc; border-radius: 6px; padding: 20px; margin: 30px 0; text-align: center;">
                <span style="font-family: monospace; font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 4px;">${verificationCode}</span>
              </div>
              <p style="color: #64748b; font-size: 14px; text-align: center;">This code will expire in 15 minutes.</p>
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
              <p style="color: #64748b; font-size: 14px; text-align: center;">If you didn't create an account with Portfolio Builder, please ignore this email.</p>
            </div>
          </body>
        </html>
      `,
    })

    // Create default portfolio for the user with initialized basic about fields
    await Portfolio.create({
      user: user._id,
      aboutTitle: "Creative Individual",
      aboutDescription: "I am passionate about sharing my work and connecting with others through this platform.",
    });

    return NextResponse.json({ success: true, message: "User registered. Please check your email for the verification code." }, { status: 201 })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Failed to register user" }, { status: 500 })
  }
}
