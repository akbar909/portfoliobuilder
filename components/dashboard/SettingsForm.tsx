"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

export default function SettingsForm({ user }: { user: any }) {
  const [isSaving, setIsSaving] = useState(false);
  const [profileImage, setProfileImage] = useState(user.image || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { update } = useSession();
  const { refetch } = useCurrentUser();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get("name");
    const email = formData.get("email");
    let imageUrl = profileImage;
    try {
      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append("file", imageFile);
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadData,
        });
        if (!uploadRes.ok) throw new Error("Image upload failed");
        const uploadJson = await uploadRes.json();
        imageUrl = uploadJson.url;
      }
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, image: imageUrl }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.error && data.error.includes("Email already in use")) {
          toast.error("This email is already in use. Please use a different email.");
        } else if (data.error) {
          toast.error(data.error);
        } else {
          toast.error("An unexpected error occurred. Please try again.");
        }
        setIsSaving(false);
        return;
      }
      toast.success("Settings updated successfully.");
      // Refresh session so avatar updates instantly
      if (typeof update === "function") {
        await update();
      } else {
        await signIn(undefined, { redirect: false });
      }
      if (typeof refetch === "function") {
        refetch();
      }
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("Failed to update settings. Please try again.");
    }
    setIsSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold">Account Settings</h2>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Name */}
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              defaultValue={user.name}
              placeholder="Enter your name"
            />
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={user.email}
              placeholder="Enter your email"
            />
          </div>

          {/* Profile Image */}
          <div>
            <Label htmlFor="profileImage">Profile Image</Label>
            {profileImage && (
              <div className="relative w-32 h-32 my-2">
                <Image
                  src={profileImage}
                  alt="Profile"
                  fill
                  className="object-cover rounded-full"
                />
              </div>
            )}
            <Input
              id="profileImage"
              name="profileImage"
              type="file"
              accept="image/*"
              className="cursor-pointer"
              onChange={handleImageChange}
            />
          </div>
        </CardContent>

        <CardFooter>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}