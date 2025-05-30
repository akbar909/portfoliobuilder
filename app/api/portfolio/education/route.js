import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import Portfolio from "@/models/Portfolio";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const portfolio = await Portfolio.findOne({ user: session.user.id });

    if (!portfolio) {
      return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });
    }

    return NextResponse.json({ education: portfolio.education || [] });
  } catch (error) {
    console.error("Error fetching education:", error);
    return NextResponse.json({ error: "Failed to fetch education" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const educationData = await request.json();
    if (!educationData.degree || !educationData.institution || !educationData.startDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectDB();
    const portfolio = await Portfolio.findOne({ user: session.user.id });

    if (!portfolio) {
      return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });
    }

    if (!portfolio.education) {
      portfolio.education = []; // Initialize education array if undefined
    }

    const newEducation = {
      degree: educationData.degree,
      institution: educationData.institution,
      location: educationData.location || "",
      startDate: new Date(educationData.startDate),
      endDate: educationData.endDate ? new Date(educationData.endDate) : null,
      description: educationData.description || "",
    };

    portfolio.education.push(newEducation);
    portfolio.updatedAt = Date.now();
    await portfolio.save();

    return NextResponse.json({
      message: "Education added successfully",
      education: portfolio.education[portfolio.education.length - 1],
    });
  } catch (error) {
    console.error("Error adding education:", error);
    return NextResponse.json({ error: "Failed to add education", details: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const educationData = await request.json();
    if (!educationData._id) {
      return NextResponse.json({ error: "Education ID is required" }, { status: 400 });
    }

    await connectDB();
    const portfolio = await Portfolio.findOneAndUpdate(
      { user: session.user.id, "education._id": educationData._id },
      { $set: { "education.$": educationData } },
      { new: true }
    );

    if (!portfolio) {
      return NextResponse.json({ error: "Education not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Education updated successfully" });
  } catch (error) {
    console.error("Error updating education:", error);
    return NextResponse.json({ error: "Failed to update education" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const educationId = searchParams.get("id");

    if (!educationId) {
      return NextResponse.json({ error: "Education ID is required" }, { status: 400 });
    }

    await connectDB();
    const portfolio = await Portfolio.findOneAndUpdate(
      { user: session.user.id },
      { $pull: { education: { _id: educationId } } },
      { new: true }
    );

    if (!portfolio) {
      return NextResponse.json({ error: "Education not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Education deleted successfully" });
  } catch (error) {
    console.error("Error deleting education:", error);
    return NextResponse.json({ error: "Failed to delete education" }, { status: 500 });
  }
}