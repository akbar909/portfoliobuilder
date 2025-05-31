import connectDB from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { email, code } = await request.json();
    await connectDB();
    const user = await User.findOne({ email });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    if (user.verified) return NextResponse.json({ message: "Already verified" }, { status: 200 });

    if (
      user.verificationCode !== code ||
      !user.verificationCodeExpires ||
      user.verificationCodeExpires < new Date()
    ) {
      return NextResponse.json({ error: "Invalid or expired code" }, { status: 400 });
    }

    user.verified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();

    return NextResponse.json({ success: true, message: "Email verified successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
} 