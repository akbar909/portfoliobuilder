import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import cloudinary from "@/lib/cloudinary"

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file")

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const fileBase64 = `data:${file.type};base64,${buffer.toString("base64")}`

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(fileBase64, {
      folder: `portfolio-builder/${session.user.id}`,
    })

    return NextResponse.json({
      url: result.secure_url,
      public_id: result.public_id,
    })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}
