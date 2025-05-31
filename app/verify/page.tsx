"use client";
import { useEffect, useState } from "react";

export default function VerifyPage() {
  const [message, setMessage] = useState("Verifying...");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (!token) {
      setMessage("No token provided.");
      return;
    }
    fetch(`/api/auth/verify?token=${token}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setMessage("Email verified successfully! You can now sign in.");
        else setMessage(data.error || data.message || "Verification failed.");
      })
      .catch(() => setMessage("Verification failed."));
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Email Verification</h2>
      <p>{message}</p>
    </div>
  );
} 