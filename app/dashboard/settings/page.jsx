import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import SettingsForm from "@/components/dashboard/SettingsForm";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  await connectDB();

  const user = await User.findById(session.user.id).lean(); // Convert to plain object

  if (!user) {
    redirect("/dashboard");
  }

  const plainUser = JSON.parse(JSON.stringify(user));

  return (
    <div className="container py-8">
      <h1 className="mb-8 text-3xl font-bold">Settings</h1>
      <SettingsForm user={plainUser} />
    </div>
  );
}