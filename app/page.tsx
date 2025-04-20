import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Build Your Professional Portfolio
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Create a stunning portfolio website in minutes. Showcase your work, skills, and experience.
              </p>
            </div>
            <div className="space-x-4">
              <Link href="/auth/signup">
                <Button size="lg">Get Started</Button>
              </Link>
              <Link href="/auth/signin">
                <Button variant="outline" size="lg">
                  Sign In
                </Button>
              </Link>
            </div>
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
