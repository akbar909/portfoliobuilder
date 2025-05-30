import { AboutSection } from "@/components/portfolio/about-section"
import { ContactSection } from "@/components/portfolio/contact-section"
import { EducationSection } from "@/components/portfolio/education-section"
import { ExperienceSection } from "@/components/portfolio/experience-section"
import { HeroSection } from "@/components/portfolio/hero-section"
import { PortfolioNavbar } from "@/components/portfolio/portfolio-navbar"
import { ProjectSection } from "@/components/portfolio/project-section"
import connectDB from "@/lib/db"
import Portfolio from "@/models/Portfolio"
import User from "@/models/User"
import { notFound } from "next/navigation"
import type React from "react"

interface PortfolioPageProps {
  params: {
    username: string
  }
}

export default async function PortfolioPage({ params }: PortfolioPageProps) {
  const { username } = await params

  await connectDB()

  // Find user by username
  const user = await User.findOne({ username })

  if (!user) {
    notFound()
  }

  // Find portfolio by user ID
  const portfolio = await Portfolio.findOne({ user: user._id })

  if (!portfolio) {
    notFound()
  }

  // Ensure experiences array is initialized
  if (!portfolio.experiences) {
    portfolio.experiences = []
  }

  // console.log("Portfolio experiences:", portfolio.experiences)

  const primaryColor = portfolio.customizations?.primaryColor || "#3b82f6"

  return (
    <div
      className="min-h-screen"
      style={
        {
          "--primary": primaryColor,
          "--font-family": portfolio.customizations?.fontFamily || "Inter",
        } as React.CSSProperties
      }
    >
      <PortfolioNavbar username={user.username} />

      <section id="home">
        <HeroSection
          type={portfolio.heroType}
          title={portfolio.heroTitle}
          subtitle={portfolio.heroSubtitle}
          imageUrl={portfolio.heroImage}
        />
      </section>

      <div className="container py-12">
        <section id="about" className="mb-12 pt-16 -mt-16">
          <h2 className="mb-8 text-2xl font-bold">About Me</h2>
          <AboutSection
            aboutDescription={portfolio.aboutDescription || ""}
            aboutProfileImage={portfolio.aboutProfileImage}
            aboutTitle={portfolio.aboutTitle}
            aboutLocation={portfolio.aboutLocation}
            aboutBio={portfolio.aboutBio}
            skills={portfolio.skills}
            primaryColor={primaryColor}
          />
        </section>

        <section id="projects" className="mb-12 pt-16 -mt-16">
          <h2 className="mb-8 text-2xl font-bold">Projects</h2>
          <ProjectSection projects={portfolio.projects || []} primaryColor={primaryColor} />
        </section>

        <section id="experience" className="mb-12 pt-16 -mt-16">
          <h2 className="mb-8 text-2xl font-bold">Experience</h2>
          <ExperienceSection experiences={portfolio.experiences || []} primaryColor={primaryColor} />
        </section>

        <section id="education" className="mb-12 pt-16 -mt-16">
          <h2 className="mb-8 text-2xl font-bold">Education</h2>
          <EducationSection education={portfolio.education || []} primaryColor={primaryColor} />
        </section>

        <section id="contact" className="pt-16 -mt-16">
          <h2 className="mb-8 text-2xl font-bold">Contact</h2>
          <ContactSection
            contact={portfolio.contact || {}}
            location={portfolio.aboutLocation}
            primaryColor={primaryColor}
          />
        </section>
      </div>
    </div>
  )
}
