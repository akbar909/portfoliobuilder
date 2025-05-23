import connectDB from "@/lib/db";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, email } = await request.json();

    await connectDB();

    const existingEmail = await User.findOne({ email });
    if (existingEmail && existingEmail._id.toString() !== session.user.id) {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 });
    }

    const user = await User.findByIdAndUpdate(
      session.user.id,
      { name, email },
      { new: true, runValidators: true }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        username: user.username,
        image: user.image,
      },
    });
  } catch (error) {
    console.error("Error updating user settings:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}