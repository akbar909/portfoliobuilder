"use client"
import { useTheme } from "@/components/theme-provider"
import placeholderImage from "@/public/project.jpg"
import { ExternalLink, Github } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Project {
  _id: string
  title: string
  description: string
  image?: string
  link?: string
  github?: string
  technologies: string[]
  featured: boolean
  type?: string
}

interface ProjectSectionProps {
  projects: Project[]
  primaryColor: string
  backgroundColor: string
  backgroundColorDark: string
  foregroundColor: string
  foregroundColorDark: string
  linkColor: string;
  linkColorDark: string;
}

export function ProjectSection({ projects, primaryColor, backgroundColor, backgroundColorDark, foregroundColor, foregroundColorDark, linkColor, linkColorDark }: ProjectSectionProps) {
  const { theme } = useTheme();
  const bgColor = theme === "dark" ? backgroundColorDark : backgroundColor;
  const fgColor = theme === "dark" ? foregroundColorDark : foregroundColor;
  const linkFg = theme === "dark" ? linkColorDark : linkColor;

  // 1. Featured Development Projects
  const featuredDevProjects = projects.filter(
    (p) => (p.type || 'development') === 'development' && p.featured
  )
  // 2. Other Development Projects
  const otherDevProjects = projects.filter(
    (p) => (p.type || 'development') === 'development' && !p.featured
  )
  // 3. Design & Other Projects
  const designOtherProjects = projects.filter(
    (p) => (p.type || 'development') !== 'development'
  )

  return (
    <section id="projects"
      className="mb-12 pt-16 -mt-16"
      style={{ backgroundColor: bgColor, color: fgColor }}
    >
      <div className="container py-12">
        <h2 className="mb-8 text-2xl font-bold" style={{ color: fgColor }}>Projects</h2>
        {/* Featured Development Projects */}
        {featuredDevProjects.length > 0 && (
          <div className="space-y-8">
            <h3 className="text-xl font-semibold" style={{ color: fgColor }}>Featured Development Projects</h3>
            <div className="grid gap-8 md:gap-12 md:grid-cols-2 lg:grid-cols-3">
              {featuredDevProjects.map((project) => (
                <FeaturedProjectCard key={project._id} project={project} primaryColor={primaryColor} fgColor={fgColor} linkColor={linkFg} />
              ))}
            </div>
          </div>
        )}
        {/* Other Development Projects */}
        {otherDevProjects.length > 0 && (
          <div className="space-y-8">
            <h3 className="text-xl font-semibold" style={{ color: fgColor }}>Development Projects</h3>
            <div className="grid gap-8 md:gap-12 md:grid-cols-2 lg:grid-cols-3">
              {otherDevProjects.map((project) => (
                <ProjectCard key={project._id} project={project} primaryColor={primaryColor} fgColor={fgColor} linkColor={linkFg} />
              ))}
            </div>
          </div>
        )}
        {/* Design & Other Projects */}
        {designOtherProjects.length > 0 && (
          <div className="space-y-8">
            <h3 className="text-xl font-semibold" style={{ color: fgColor }}>Design & Other Projects</h3>
            <div className="grid gap-8 md:gap-12 md:grid-cols-2 lg:grid-cols-3">
              {designOtherProjects.map((project) => (
                <ProjectCard key={project._id} project={project} primaryColor={primaryColor} fgColor={fgColor} linkColor={linkFg} />
              ))}
            </div>
          </div>
        )}
        {featuredDevProjects.length === 0 && otherDevProjects.length === 0 && designOtherProjects.length === 0 && (
          <p className="text-center text-muted-foreground" style={{ color: fgColor }}>No projects added yet.</p>
        )}
      </div>
    </section>
  )
}

interface ProjectCardProps {
  project: Project
  primaryColor: string
  fgColor: string
  linkColor: string
}

function FeaturedProjectCard({ project, primaryColor, fgColor, linkColor }: ProjectCardProps) {
  const isDev = project.type === "development"
  const { theme } = useTheme();
  const tagBg = theme === "dark" ? `${primaryColor}33` : `${primaryColor}15`;
  const typeBg = theme === "dark" ? `${primaryColor}33` : `${primaryColor}15`;
  const typeColor = primaryColor;

  return (
    <div
      className="group overflow-hidden rounded-lg border shadow-sm transition-all hover:shadow-md"
      style={{
        backgroundColor: theme === "dark" ? "var(--card-background-dark)" : "var(--card-background)",
        color: theme === "dark" ? "var(--foreground-dark)" : "var(--foreground)",
      }}
    >
      {project.image && (
        <div className="relative aspect-video w-full overflow-hidden">
          <div
            className="absolute left-2 top-2 z-10 rounded-full px-2 py-1 text-xs font-medium capitalize"
            style={{ backgroundColor: typeBg, color: typeColor }}
          >
            {project.type || "development"}
          </div>
          <Image
            src={project.image || placeholderImage}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
      )}
      <div className="p-5">
        <h3 className="mb-2 text-xl font-bold" style={{ color: theme === "dark" ? "var(--foreground-dark)" : "var(--foreground)" }}>{project.title}</h3>
        <p className={`text-muted-foreground ${isDev ? "mb-4" : ""}`} style={{ color: theme === "dark" ? "var(--foreground-dark)" : "var(--foreground)" }}>{project.description}</p>

        {isDev && project.technologies.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {project.technologies.map((tech, index) => (
              <span
                key={index}
                className="rounded-full px-3 py-1 text-xs"
                style={{
                  backgroundColor: tagBg,
                  color: primaryColor,
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {isDev && (project.link || project.github) && (
          <div className="flex items-center gap-4">
            {project.link && (
              <Link
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm font-medium"
                style={{ color: linkColor }}
              >
                Live Demo <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            )}
            {project.github && (
              <Link
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm font-medium"
                style={{ color: linkColor }}
              >
                GitHub <Github className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function ProjectCard({ project, primaryColor, fgColor, linkColor }: ProjectCardProps) {
  const isDev = project.type === "development"
  const { theme } = useTheme();
  const tagBg = theme === "dark" ? `${primaryColor}33` : `${primaryColor}15`;
  const typeBg = theme === "dark" ? `${primaryColor}33` : `${primaryColor}15`;
  const typeColor = primaryColor;

  return (
    <div
      className="group overflow-hidden rounded-lg border shadow-sm transition-all hover:shadow-md"
      style={{
        backgroundColor: theme === "dark" ? "var(--card-background-dark)" : "var(--card-background)",
        color: theme === "dark" ? "var(--foreground-dark)" : "var(--foreground)",
      }}
    >
      {project.image && (
        <div className="relative aspect-video w-full overflow-hidden">
          <div
            className="absolute left-2 top-2 z-10 rounded-full px-2 py-1 text-xs font-medium capitalize"
            style={{ backgroundColor: typeBg, color: typeColor }}
          >
            {project.type || "development"}
          </div>
          <Image
            src={project.image || placeholderImage}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-4">
        <h3 className="mb-1 font-semibold" style={{ color: theme === "dark" ? "var(--foreground-dark)" : "var(--foreground)" }}>{project.title}</h3>
        <p className={`text-sm text-muted-foreground ${isDev ? "mb-3" : ""}`} style={{ color: theme === "dark" ? "var(--foreground-dark)" : "var(--foreground)" }}>
          {project.description}
        </p>

        {isDev && project.technologies.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1">
            {project.technologies.slice(0, 3).map((tech, index) => (
              <span
                key={index}
                className="rounded-full px-2 py-0.5 text-xs"
                style={{
                  backgroundColor: tagBg,
                  color: primaryColor,
                }}
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 3 && (
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                +{project.technologies.length - 3}
              </span>
            )}
          </div>
        )}

        {isDev && (project.link || project.github) && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {project.link && (
                <Link
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted"
                  style={{ color: linkColor }}
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span className="sr-only">Live Demo</span>
                </Link>
              )}
              {project.github && (
                <Link
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted"
                  style={{ color: linkColor }}
                >
                  <Github className="h-3.5 w-3.5" />
                  <span className="sr-only">GitHub</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
