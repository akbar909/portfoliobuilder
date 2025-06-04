"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ExternalLink, Github, ImagePlus, Plus, Trash2, X } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

interface Project {
  _id?: string
  title: string
  description: string
  image?: string
  link?: string
  github?: string
  technologies: string[]
  featured: boolean
  order: number
  type?: "development" | "design" | "other"
}

interface ProjectFormProps {
  projects: Project[]
}

export function ProjectForm({ projects: initialProjects }: ProjectFormProps) {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>(initialProjects || [])
  const [isLoading, setIsLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentProject, setCurrentProject] = useState<Project>({
    title: "",
    description: "",
    image: "",
    link: "",
    github: "",
    technologies: [],
    featured: false,
    order: 0,
    type: "development",
  })
  const [newTechnology, setNewTechnology] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  const resetForm = () => {
    setCurrentProject({
      title: "",
      description: "",
      image: "",
      link: "",
      github: "",
      technologies: [],
      featured: false,
      order: projects.length,
      type: "development",
    })
    setImageFile(null)
    setNewTechnology("")
    setIsEditing(false)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      // Create a preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setCurrentProject({ ...currentProject, image: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }
  const addTechnology = () => {
    const trimmedTech = newTechnology.trim();

    if (
      trimmedTech &&
      Array.isArray(currentProject.technologies) &&
      !currentProject.technologies.includes(trimmedTech)
    ) {
      setCurrentProject({
        ...currentProject,
        technologies: [...currentProject.technologies, trimmedTech],
      });
      setNewTechnology("");
    }
  };


  const removeTechnology = (tech: string) => {
    setCurrentProject({
      ...currentProject,
      technologies: currentProject.technologies.filter((t) => t !== tech),
    })
  }

  const handleEditProject = (project: Project) => {
    setCurrentProject({
      ...project,
      type: project.type ? project.type : "development",
    })
    setIsEditing(true)
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      let imageUrl = currentProject.image

      // Upload image if there's a new file
      if (imageFile) {
        const formData = new FormData()
        formData.append("file", imageFile)

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!uploadRes.ok) {
          throw new Error("Failed to upload image")
        }

        const { url } = await uploadRes.json()
        imageUrl = url
      }

      const projectData = {
        ...currentProject,
        image: imageUrl,
      }

      let res
      let updatedProjects: Project[] = []

      if (isEditing && currentProject._id) {
        // Update existing project
        res = await fetch(`/api/portfolio/projects/${currentProject._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(projectData),
        })
        if (!res.ok) throw new Error("Failed to update project")
        const data = await res.json()
        updatedProjects = projects.map((p) => (p._id === currentProject._id ? data.project : p))
        setProjects(updatedProjects)
        toast.success("Project updated successfully")
      } else {
        // Create new project
        res = await fetch("/api/portfolio/projects", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(projectData),
        })
        if (!res.ok) throw new Error("Failed to add project")
        const data = await res.json()
        updatedProjects = [...projects, data.project]
        setProjects(updatedProjects)
        toast.success("Project added successfully")
      }

      // Close dialog and reset form
      setIsDialogOpen(false)
      resetForm()
      router.refresh()
    } catch (error: any) {
      console.error("Error saving project:", error)
      toast.error(error.message || "Failed to save project. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) {
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch(`/api/portfolio/projects/${id}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        throw new Error("Failed to delete project")
      }

      setProjects(projects.filter((p) => p._id !== id))
      toast.success("Project deleted successfully")
      router.refresh()
    } catch (error: any) {
      console.error("Error deleting project:", error)
      toast.error(error.message || "Failed to delete project. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Projects</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>Add Project</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>{isEditing ? "Edit Project" : "Add New Project"}</DialogTitle>
                <DialogDescription>
                  {isEditing
                    ? "Update your project details below."
                    : "Fill in the details below to add a new project to your portfolio."}
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Left Side */}
                <div className="space-y-4">
                  {/* Project Type */}
                  <div className="space-y-2">
                    <Label htmlFor="type">Project Type *</Label>
                    <select
                      id="type"
                      title="Project Type"
                      value={currentProject.type || "development"}
                      onChange={e => setCurrentProject({ ...currentProject, type: e.target.value as Project["type"] })}
                      className="bg-background dark:bg-background  w-full rounded-md border px-3 py-2"
                      required
                    >
                      <option value="development">Development</option>
                      <option value="design">Design</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title">Project Title *</Label>
                    <Input
                      id="title"
                      value={currentProject.title}
                      onChange={(e) => setCurrentProject({ ...currentProject, title: e.target.value })}
                      placeholder="e.g. E-commerce Website"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={currentProject.description}
                      onChange={(e) => setCurrentProject({ ...currentProject, description: e.target.value })}
                      placeholder="Describe your project, its features, and technologies used"
                      rows={4}
                      required
                    />
                  </div>

                  {/* Project Image */}
                  <div className="space-y-2">
                    <Label htmlFor="projectImage">Project Image{["design","other"].includes(currentProject.type || "") ? " *" : ""}</Label>
                    {currentProject.image ? (
                      <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                        <Image
                          src={currentProject.image || "/placeholder.svg"}
                          alt="Project preview"
                          fill
                          className="object-cover"
                        />
                        <Button
                          type="button"
                         
                          size="icon"
                          className="absolute right-2 top-2 bg-red-700 hover:bg-red-800 dark:text-white"
                          onClick={() => {
                            setCurrentProject({ ...currentProject, image: "" })
                            setImageFile(null)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex aspect-video w-full flex-col items-center justify-center rounded-lg border border-dashed p-4">
                        <ImagePlus className="mb-2 h-8 w-8 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Upload an image for your project</p>
                        <div className="mt-4">
                          <Input
                            id="projectImage"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="cursor-pointer"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Side */}
                <div className="space-y-4">
                  {/* Only show these fields for development type */}
                  {currentProject.type === "development" && (
                    <>
                      {/* Live Demo and GitHub */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="link">Live Demo URL</Label>
                          <Input
                            id="link"
                            value={currentProject.link || ""}
                            onChange={(e) => setCurrentProject({ ...currentProject, link: e.target.value })}
                            placeholder="https://example.com"
                            type="url"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="github">GitHub Repository</Label>
                          <Input
                            id="github"
                            value={currentProject.github || ""}
                            onChange={(e) => setCurrentProject({ ...currentProject, github: e.target.value })}
                            placeholder="https://github.com/username/repo"
                            type="url"
                          />
                        </div>
                      </div>

                      {/* Technologies */}
                      <div className="space-y-2">
                        <Label>Technologies Used</Label>
                        <div className="flex items-end gap-2">
                          <div className="flex-1">
                            <Input
                              value={newTechnology}
                              onChange={(e) => setNewTechnology(e.target.value)}
                              placeholder="e.g. React, Node.js, MongoDB"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault()
                                  addTechnology()
                                }
                              }}
                            />
                          </div>
                          <Button type="button" onClick={addTechnology}>
                            Add
                          </Button>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-2">
                          {currentProject?.technologies?.length > 0 ? (
                            currentProject.technologies.map((tech, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
                              >
                                {tech}
                                <button
                                  type="button"
                                  title={`Remove ${tech}`}
                                  onClick={() => removeTechnology(tech)}
                                  className="ml-1 rounded-full p-1 hover:bg-primary/20"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground">No technologies added yet.</p>
                          )}
                        </div>
                      </div>

                      {/* Featured Project */}
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="featured"
                          checked={currentProject.featured}
                          onCheckedChange={(checked) => setCurrentProject({ ...currentProject, featured: checked })}
                        />
                        <Label htmlFor="featured">Featured Project</Label>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : isEditing ? "Update Project" : "Add Project"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {projects.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="rounded-full bg-primary/10 p-3">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-4 text-lg font-medium">No projects yet</h3>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Add your first project to showcase your work to visitors.
            </p>
            <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>
              Add Your First Project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Projects</TabsTrigger>
            <TabsTrigger value="featured">Featured</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  onEdit={() => handleEditProject(project)}
                  onDelete={() => project._id && handleDeleteProject(project._id)}
                />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="featured" className="mt-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects
                .filter((project) => project.featured)
                .map((project) => (
                  <ProjectCard
                    key={project._id}
                    project={project}
                    onEdit={() => handleEditProject(project)}
                    onDelete={() => project._id && handleDeleteProject(project._id)}
                  />
                ))}
            </div>
            {projects.filter((project) => project.featured).length === 0 && (
              <p className="text-center text-muted-foreground">No featured projects yet.</p>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

interface ProjectCardProps {
  project: Project
  onEdit: () => void
  onDelete: () => void
}

function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  return (
    <Card className="overflow-hidden">
      {project.image && (
        <div className="relative aspect-video w-full overflow-hidden">
          {/* Project Type Tag */}
          <div className="absolute left-2 top-2 z-10 rounded-full bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground capitalize">
            {project.type ? project.type : "development"}
          </div>
          <Image
            src={project.image || "/placeholder.svg"}
            alt={project.title}
            fill
            className="object-cover transition-transform hover:scale-105"
          />
          {project.featured && (
            <div className="absolute left-2 top-10 rounded-full bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
              Featured
            </div>
          )}
        </div>
      )}
      <CardHeader>
        <CardTitle className="line-clamp-1">{project.title}</CardTitle>
        <CardDescription className="line-clamp-2">{project.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {project.technologies?.slice(0, 3).map((tech, index) => (
          <span
            key={index}
            className="rounded-full px-2 py-0.5 text-xs"
          >
            {tech}
          </span>
        ))}

        {project.technologies?.length > 3 && (
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
            +{project.technologies.length - 3}
          </span>
        )}

      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex space-x-2">
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md border text-muted-foreground transition-colors hover:bg-muted"
            >
              <ExternalLink className="h-4 w-4" />
              <span className="sr-only">Visit live site</span>
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md border text-muted-foreground transition-colors hover:bg-muted"
            >
              <Github className="h-4 w-4" />
              <span className="sr-only">View source code</span>
            </a>
          )}
        </div>
        <div className="flex space-x-2">
          <Button  size="sm" onClick={onEdit}>
            Edit
          </Button>
          <Button size="sm" onClick={onDelete} className="bg-red-700 hover:bg-red-800 dark:text-white">
            Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
