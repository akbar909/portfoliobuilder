import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  await connectDB();
  const { email, token, password } = await req.json();
  if (!email || !token || !password) {
    return new Response(JSON.stringify({ error: "All fields are required." }), { status: 400 });
  }
  const user = await User.findOne({ email, resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
  if (!user) {
    return new Response(JSON.stringify({ error: "Invalid or expired token." }), { status: 400 });
  }
  user.password = await bcrypt.hash(password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  return new Response(JSON.stringify({ message: "Password has been reset successfully." }), { status: 200 });
} 