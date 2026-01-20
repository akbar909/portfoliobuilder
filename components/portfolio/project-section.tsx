"use client"
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

export function ProjectSection({
  projects,
  primaryColor,
  backgroundColor,
  backgroundColorDark,
  foregroundColor,
  foregroundColorDark,
  linkColor,
  linkColorDark
}: ProjectSectionProps) {

  // CSS variables for theme-aware styling (no JS theme detection needed)
  const cssVars = {
    '--proj-bg': backgroundColor,
    '--proj-bg-dark': backgroundColorDark,
    '--proj-fg': foregroundColor,
    '--proj-fg-dark': foregroundColorDark,
    '--proj-link': linkColor,
    '--proj-link-dark': linkColorDark,
    '--proj-card-bg': 'var(--card-background)',
    '--proj-card-bg-dark': 'var(--card-background-dark)',
    '--proj-tag-bg': `${primaryColor}15`,
    '--proj-tag-bg-dark': `${primaryColor}33`,
    '--proj-primary': primaryColor,
  } as React.CSSProperties;

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
    <section
      id="projects"
      className="mb-12 pt-16 -mt-16 bg-[var(--proj-bg)] text-[var(--proj-fg)] dark:bg-[var(--proj-bg-dark)] dark:text-[var(--proj-fg-dark)]"
      style={cssVars}
    >
      <div className="container py-12">
        <h2 className="mb-8 text-2xl font-bold">Projects</h2>
        {/* Featured Development Projects */}
        {featuredDevProjects.length > 0 && (
          <div className="space-y-8">
            <h3 className="text-xl font-semibold">Featured Development Projects</h3>
            <div className="grid gap-8 md:gap-12 md:grid-cols-2 lg:grid-cols-3">
              {featuredDevProjects.map((project) => (
                <FeaturedProjectCard key={project._id} project={project} primaryColor={primaryColor} />
              ))}
            </div>
          </div>
        )}
        {/* Other Development Projects */}
        {otherDevProjects.length > 0 && (
          <div className="space-y-8">
            <h3 className="text-xl font-semibold">Development Projects</h3>
            <div className="grid gap-8 md:gap-12 md:grid-cols-2 lg:grid-cols-3">
              {otherDevProjects.map((project) => (
                <ProjectCard key={project._id} project={project} primaryColor={primaryColor} />
              ))}
            </div>
          </div>
        )}
        {/* Design & Other Projects */}
        {designOtherProjects.length > 0 && (
          <div className="space-y-8">
            <h3 className="text-xl font-semibold">Design & Other Projects</h3>
            <div className="grid gap-8 md:gap-12 md:grid-cols-2 lg:grid-cols-3">
              {designOtherProjects.map((project) => (
                <ProjectCard key={project._id} project={project} primaryColor={primaryColor} />
              ))}
            </div>
          </div>
        )}
        {featuredDevProjects.length === 0 && otherDevProjects.length === 0 && designOtherProjects.length === 0 && (
          <p className="text-center text-muted-foreground">No projects added yet.</p>
        )}
      </div>
    </section>
  )
}

interface ProjectCardProps {
  project: Project
  primaryColor: string
}

function FeaturedProjectCard({ project, primaryColor }: ProjectCardProps) {
  const isDev = project.type === "development"

  return (
    <div
      className="group overflow-hidden rounded-lg border shadow-sm transition-all hover:shadow-md bg-[var(--proj-card-bg)] dark:bg-[var(--proj-card-bg-dark)]"
    >
      {project.image && (
        <div className="relative aspect-video w-full overflow-hidden">
          <div
            className="absolute left-2 top-2 z-10 rounded-full px-2 py-1 text-xs font-medium capitalize bg-[var(--proj-tag-bg)] dark:bg-[var(--proj-tag-bg-dark)]"
            style={{ color: primaryColor }}
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
        <h3 className="mb-2 text-xl font-bold">{project.title}</h3>
        <p className={`text-muted-foreground ${isDev ? "mb-4" : ""}`}>{project.description}</p>

        {isDev && project.technologies.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {project.technologies.map((tech, index) => (
              <span
                key={index}
                className="rounded-full px-3 py-1 text-xs bg-[var(--proj-tag-bg)] dark:bg-[var(--proj-tag-bg-dark)]"
                style={{ color: primaryColor }}
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
                className="inline-flex items-center gap-1 text-sm font-medium text-[var(--proj-link)] dark:text-[var(--proj-link-dark)]"
              >
                Live Demo <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            )}
            {project.github && (
              <Link
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm font-medium text-[var(--proj-link)] dark:text-[var(--proj-link-dark)]"
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

function ProjectCard({ project, primaryColor }: ProjectCardProps) {
  const isDev = project.type === "development"

  return (
    <div
      className="group overflow-hidden rounded-lg border shadow-sm transition-all hover:shadow-md bg-[var(--proj-card-bg)] dark:bg-[var(--proj-card-bg-dark)]"
    >
      {project.image && (
        <div className="relative aspect-video w-full overflow-hidden">
          <div
            className="absolute left-2 top-2 z-10 rounded-full px-2 py-1 text-xs font-medium capitalize bg-[var(--proj-tag-bg)] dark:bg-[var(--proj-tag-bg-dark)]"
            style={{ color: primaryColor }}
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
        <h3 className="mb-1 font-semibold">{project.title}</h3>
        <p className={`text-sm text-muted-foreground ${isDev ? "mb-3" : ""}`}>
          {project.description}
        </p>

        {isDev && project.technologies.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1">
            {project.technologies.slice(0, 3).map((tech, index) => (
              <span
                key={index}
                className="rounded-full px-2 py-0.5 text-xs bg-[var(--proj-tag-bg)] dark:bg-[var(--proj-tag-bg-dark)]"
                style={{ color: primaryColor }}
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
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted text-[var(--proj-link)] dark:text-[var(--proj-link-dark)]"
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
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted text-[var(--proj-link)] dark:text-[var(--proj-link-dark)]"
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
