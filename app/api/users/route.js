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
  // Optional: filter by verification status
  const { searchParams } = new URL(request.url);
  const verifiedFilter = searchParams.get("verified");
  let userQuery = {};
  if (verifiedFilter === "true") userQuery.verified = true;
  if (verifiedFilter === "false") userQuery.verified = false;
  // Get all users (with verified field)
  const users = await User.find(userQuery, "_id name email username image role createdAt verified").lean();
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
  const { userId, name, email, username, role, verified } = await request.json();
  if (!userId) {
    return NextResponse.json({ error: "User ID required" }, { status: 400 });
  }
  const update = {};
  if (name) update.name = name;
  if (email) update.email = email;
  if (username) update.username = username;
  if (role) update.role = role;
  if (verified !== undefined) update.verified = verified;
  const updatedUser = await User.findByIdAndUpdate(userId, update, { new: true });
  return NextResponse.json({ message: "User updated", user: updatedUser });
} 