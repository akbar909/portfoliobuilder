"use client";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function VerifyCodePage() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email") || "";
  const { status } = useSession();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    } else if (!email) {
      router.replace("/auth/signup");
    }
  }, [status, email, router]);

  if (status === "authenticated" || !email) {
    return null;
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/auth/verify-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });
    const data = await res.json();
    if (res.ok) {
      toast.success("Email verified! You can now sign in.");
      router.push("/auth/signin");
    } else {
      toast.error(data.error || "Verification failed.");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Enter Verification Code</h2>
      <form onSubmit={handleVerify} className="space-y-4">
        <Input
          type="text"
          placeholder="Enter code"
          value={code}
          onChange={e => setCode(e.target.value)}
          required
        />
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2"
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form>
    </div>
  );
} 