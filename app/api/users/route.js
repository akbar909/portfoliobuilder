import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import Portfolio from "@/models/Portfolio";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const user = await User.findById(session.user.id);
  if (!user || user.role !== "superadmin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  // Get all users
  const users = await User.find({}, "_id name email username image role createdAt").lean();
  // Get all portfolios
  const portfolios = await Portfolio.find({}).lean();
  // Map portfolios to users
  const usersWithPortfolios = users.map((u) => ({
    ...u,
    portfolio: portfolios.find((p) => p.user.toString() === u._id.toString()) || null,
  }));
  return NextResponse.json({ users: usersWithPortfolios });
}

export async function DELETE(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const user = await User.findById(session.user.id);
  if (!user || user.role !== "superadmin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { userId } = await request.json();
  if (!userId) {
    return NextResponse.json({ error: "User ID required" }, { status: 400 });
  }
  // Delete user
  await User.findByIdAndDelete(userId);
  // Delete user's portfolio
  await Portfolio.deleteOne({ user: userId });
  return NextResponse.json({ message: "User and portfolio deleted" });
}

export async function PUT(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const user = await User.findById(session.user.id);
  if (!user || user.role !== "superadmin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { userId, name, email, username, role } = await request.json();
  if (!userId) {
    return NextResponse.json({ error: "User ID required" }, { status: 400 });
  }
  const update = {};
  if (name) update.name = name;
  if (email) update.email = email;
  if (username) update.username = username;
  if (role) update.role = role;
  const updatedUser = await User.findByIdAndUpdate(userId, update, { new: true });
  return NextResponse.json({ message: "User updated", user: updatedUser });
} 