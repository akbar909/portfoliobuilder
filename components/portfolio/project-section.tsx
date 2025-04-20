import Image from "next/image"
import Link from "next/link"
import { ExternalLink, Github, ArrowRight } from "lucide-react"
import placeholderImage from "@/public/project.jpg"
interface Project {
  _id: string
  title: string
  description: string
  image?: string
  link?: string
  github?: string
  technologies: string[]
  featured: boolean
}

interface ProjectSectionProps {
  projects: Project[]
  primaryColor: string
}

export function ProjectSection({ projects, primaryColor }: ProjectSectionProps) {
  // Separate featured projects
  const featuredProjects = projects.filter((project) => project.featured)
  const regularProjects = projects.filter((project) => !project.featured)

  // Combine them with featured projects first
  const sortedProjects = [...featuredProjects, ...regularProjects]

  return (
    <div className="space-y-12">
      {sortedProjects.length === 0 ? (
        <p className="text-center text-muted-foreground">No projects added yet.</p>
      ) : (
        <div className="grid gap-8 md:gap-12">
          {featuredProjects.length > 0 && (
            <div className="space-y-8">
              <h3 className="text-xl font-semibold">Featured Projects</h3>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {featuredProjects.map((project) => (
                  <FeaturedProjectCard key={project._id} project={project} primaryColor={primaryColor} />
                ))}
              </div>
            </div>
          )}

          {regularProjects.length > 0 && (
            <div className="space-y-8">
              {featuredProjects.length > 0 && <h3 className="text-xl font-semibold">Other Projects</h3>}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {regularProjects.map((project) => (
                  <ProjectCard key={project._id} project={project} primaryColor={primaryColor} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

interface ProjectCardProps {
  project: Project
  primaryColor: string
}

function FeaturedProjectCard({ project, primaryColor }: ProjectCardProps) {
  return (
    <div className="group overflow-hidden rounded-lg border bg-card shadow-sm transition-all hover:shadow-md">
      {project.image && (
        <div className="relative aspect-video w-full overflow-hidden">
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
        <p className="mb-4 text-muted-foreground">{project.description}</p>

        <div className="mb-4 flex flex-wrap gap-2">
          {project.technologies.map((tech, index) => (
            <span
              key={index}
              className="rounded-full px-3 py-1 text-xs"
              style={{
                backgroundColor: `${primaryColor}15`,
                color: primaryColor,
              }}
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {project.link && (
            <Link
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-medium"
              style={{ color: primaryColor }}
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
              style={{ color: primaryColor }}
            >
              GitHub <Github className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

function ProjectCard({ project, primaryColor }: ProjectCardProps) {
  return (
    <div className="group overflow-hidden rounded-lg border bg-card shadow-sm transition-all hover:shadow-md">
      {project.image && (
        <div className="relative aspect-video w-full overflow-hidden">
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
        <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">{project.description}</p>

        <div className="mb-3 flex flex-wrap gap-1">
          {(project.technologies || []).slice(0, 3).map((tech, index) => (
            <span
              key={index}
              className="rounded-full px-2 py-0.5 text-xs"
              style={{
                backgroundColor: `${primaryColor}15`,
                color: primaryColor,
              }}
            >
              {tech}
            </span>
          ))}
          {(project.technologies?.length || 0) > 3 && (
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
              +{project.technologies.length - 3}
            </span>
          )}
        </div>


        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {project.link && (
              <Link
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted"
                style={{ color: primaryColor }}
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
                style={{ color: primaryColor }}
              >
                <Github className="h-3.5 w-3.5" />
                <span className="sr-only">GitHub</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
