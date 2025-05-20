"use client"

import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  const { data: session } = useSession();
  return (
    <div className="flex flex-col">
      <section className="w-full py-16 md:py-28 lg:py-36 bg-gradient-to-br from-primary/5 to-background relative overflow-hidden">
        <div className="container px-4 md:px-6 flex flex-col items-center justify-center min-h-[350px]">
          <div className="absolute inset-0 pointer-events-none select-none opacity-10 flex items-center justify-center">
            {/* Decorative SVG or illustration */}
            <svg width="600" height="300" viewBox="0 0 600 300" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="300" cy="150" rx="280" ry="120" fill="url(#grad1)" />
              <defs>
                <linearGradient id="grad1" x1="0" y1="0" x2="600" y2="300" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#3b82f6" stopOpacity="0.15" />
                  <stop offset="1" stopColor="#6366f1" stopOpacity="0.10" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="relative z-10 w-full  mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
              Build Your Professional Portfolio
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Create a stunning portfolio website in minutes. Showcase your work, skills, and experience.
            </p>
            {session ? (
              <div className="mt-8 max-w-2xl mx-auto flex flex-col items-center gap-2 bg-white/80 dark:bg-black/40 rounded-xl shadow-lg p-8 border border-primary/10">
                <h2 className="text-3xl font-bold text-primary mb-2">Welcome back, {session.user.name || session.user.email}!</h2>
                <p className="text-muted-foreground mb-4">Ready to update your portfolio? Head to your dashboard to manage your projects, skills, and more.</p>
                <Link href="/dashboard">
                  <Button size="lg" className="px-8 py-2 text-lg">Go to Dashboard</Button>
                </Link>
              </div>
            ) : (
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/auth/signup">
                  <Button size="lg" className="px-8 py-2 text-lg">Get Started</Button>
                </Link>
                <Link href="/auth/signin">
                  <Button variant="outline" size="lg" className="px-8 py-2 text-lg">
                    Sign In
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Features</h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
                  Everything you need to create a professional portfolio website.
                </p>
              </div>
              <ul className="grid gap-2">
                <li className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    ✓
                  </div>
                  <span>Customizable themes and layouts</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    ✓
                  </div>
                  <span>Responsive design for all devices</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    ✓
                  </div>
                  <span>Easy image uploads with Cloudinary</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    ✓
                  </div>
                  <span>Custom domain support</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    ✓
                  </div>
                  <span>SEO optimization</span>
                </li>
              </ul>
            </div>
            <div className="mx-auto aspect-video w-full overflow-hidden rounded-xl border bg-background object-cover shadow-xl">
              <div className="h-full w-full bg-gradient-to-br from-primary to-primary/20 p-8 flex items-center justify-center text-primary-foreground">
                <span className="text-xl font-bold">Portfolio Preview</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
