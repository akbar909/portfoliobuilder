import connectDB from "@/lib/db";
import Portfolio from "@/models/Portfolio";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const userPortfolio = await Portfolio.findOne({ user: session.user.id });

    if (!userPortfolio) {
      return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });
    }

    return NextResponse.json({ experiences: userPortfolio.experiences || [] });
  } catch (error) {
    console.error("Error fetching experiences:", error);
    return NextResponse.json({ error: "Failed to fetch experiences" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const experienceData = await request.json();
    // console.log("Received experience data:", experienceData);

    if (!experienceData.title || !experienceData.company || !experienceData.startDate) {
      // console.log("Validation failed: Missing required fields", experienceData);
      return NextResponse.json({ error: "Title, company, and start date are required" }, { status: 400 });
    }

    await connectDB();

    const userPortfolio = await Portfolio.findOne({ user: session.user.id });

    if (!userPortfolio) {
      // console.log("Portfolio not found for user", session.user.id);
      return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });
    }

    if (!userPortfolio.experiences) {
      userPortfolio.experiences = []; // Initialize experiences array if undefined
    }

    const newExperience = {
      title: experienceData.title,
      company: experienceData.company,
      location: experienceData.location || "",
      startDate: new Date(experienceData.startDate),
      endDate: experienceData.endDate ? new Date(experienceData.endDate) : null,
      description: experienceData.description || "",
    };

    userPortfolio.experiences.push(newExperience);
    userPortfolio.updatedAt = Date.now();

    await userPortfolio.save();

    // console.log("Experience added successfully", newExperience);

    return NextResponse.json({
      message: "Experience added successfully",
      experience: userPortfolio.experiences[userPortfolio.experiences.length - 1],
    });
  } catch (error) {
    console.error("Error adding experience:", error);
    return NextResponse.json({ error: "Failed to add experience", details: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    // console.log("Received data for update:", data);

    if (!data._id) {
      return NextResponse.json({ error: "Experience ID is required" }, { status: 400 });
    }

    await connectDB();

    const portfolio = await Portfolio.findOneAndUpdate(
      { user: session.user.id, "experiences._id": data._id },
      { $set: { "experiences.$": data } },
      { new: true }
    );

    if (!portfolio) {
      // console.log("Experience not found for update", data._id);
      return NextResponse.json({ error: "Experience not found" }, { status: 404 });
    }

    const updatedExperience = portfolio.experiences.find((exp) => exp._id.toString() === data._id);
    // console.log("Updated experience:", updatedExperience);

    return NextResponse.json({ message: "Experience updated successfully", experience: updatedExperience });
  } catch (error) {
    console.error("Error updating experience:", error);
    return NextResponse.json({ error: "Failed to update experience", details: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await request.json();
    // console.log("Received ID for deletion:", id);

    await connectDB();

    const portfolio = await Portfolio.findOneAndUpdate(
      { user: session.user.id },
      { $pull: { experiences: { _id: id } } },
      { new: true }
    );

    if (!portfolio) {
      // console.log("Experience not found for deletion", id);
      return NextResponse.json({ error: "Experience not found" }, { status: 404 });
    }

    // console.log("Experience deleted successfully", id);
    return NextResponse.json({ message: "Experience deleted successfully" });
  } catch (error) {
    console.error("Error deleting experience:", error);
    return NextResponse.json({ error: "Failed to delete experience" }, { status: 500 });
  }
}