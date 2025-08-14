"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { format, parseISO } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useRef } from "react";

interface Experience {
  _id?: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string;
  description: string;
}

interface ExperienceFormProps {
  experiences: Experience[];
}

export function ExperienceForm({ experiences: initialExperiences }: ExperienceFormProps) {
  const [experiences, setExperiences] = useState<Experience[]>(initialExperiences || []);
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);
  const [currentExperience, setCurrentExperience] = useState<Experience>({
    title: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    description: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation for required fields
    if (!currentExperience.title.trim()) {
      toast.error("Title is required.");
      return;
    }

    if (!currentExperience.company.trim()) {
      toast.error("Company is required.");
      return;
    }
    if (!currentExperience.location.trim()) {
      toast.error("location is required.");
      return;
    }

    if (!currentExperience.startDate.trim()) {
      toast.error("Start Date is required.");
      return;
    }

    if (!currentExperience.description.trim()) {
      toast.error("Description is required.");
      return;
    }

    if (currentExperience.endDate && new Date(currentExperience.endDate) < new Date(currentExperience.startDate)) {
      toast.error("End Date cannot be earlier than Start Date.");
      return;
    }

    setIsLoading(true);

    try {
      const method = isEditing ? "PUT" : "POST";
      const endpoint = isEditing ? `/api/portfolio/experiences` : "/api/portfolio/experiences";
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentExperience),
      });

      if (!res.ok) {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to save experience");
        } else {
          throw new Error("Unexpected response format");
        }
      }

      const data = await res.json();
      toast.success(data.message);

      if (isEditing) {
        setExperiences((prev: Experience[]) =>
          prev.map((exp: Experience) => (exp._id === currentExperience._id ? data.experience : exp))
        );
      } else {
        setExperiences((prev: Experience[]) => [...prev, data.experience]);
      }

      setCurrentExperience({
        title: "",
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        description: "",
      });
      setIsEditing(false);
    } catch (error: any) {
      console.error("Error submitting experience:", error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experience?")) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/portfolio/experiences", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete experience");
      }

      const data = await res.json();
      toast.success(data.message);
      setExperiences((prev) => prev.filter((exp) => exp._id !== id));
    } catch (error: any) {
      console.error("Error deleting experience:", error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isEditing == true) {
    window.scroll(0, 10);
  }
  return (
    <div className="space-y-6 mx-auto">
      <form onSubmit={handleSubmit} ref={formRef} className=" mx-auto max-w-2xl ">
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-semibold">Experience Section</h2>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label>Title</Label>
              <Input
                value={currentExperience.title}
                onChange={(e) => setCurrentExperience({ ...currentExperience, title: e.target.value })}
                placeholder="Enter your job title"
              />
            </div>
            <div>
              <Label>Company</Label>
              <Input
                value={currentExperience.company}
                onChange={(e) => setCurrentExperience({ ...currentExperience, company: e.target.value })}
                placeholder="Enter company name"
              />
            </div>
            <div>
              <Label>Location</Label>
              <Input
                value={currentExperience.location}
                onChange={(e) => setCurrentExperience({ ...currentExperience, location: e.target.value })}
                placeholder="Enter location"
              />
            </div>
            <div>
              <Label>Start Date</Label>
              <Popover >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={
                      "w-full justify-start text-left font-normal" +
                      (currentExperience.startDate ? "" : " text-muted-foreground")
                    }
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {currentExperience.startDate
                      ? format(parseISO(currentExperience.startDate), "yyyy-MM-dd")
                      : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-auto p-0 bg-background">
                  <Calendar
                    mode="single"
                    selected={currentExperience.startDate ? parseISO(currentExperience.startDate) : undefined}
                    onSelect={(date) => {
                      setCurrentExperience((prev) => ({
                        ...prev,
                        startDate: date ? format(date, "yyyy-MM-dd") : "",
                      }));
                    }}
                    initialFocus
                    captionLayout="dropdown" // Enables quick selection of month and year
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={
                      "w-full justify-start text-left font-normal" +
                      (currentExperience.endDate ? "" : " text-muted-foreground")
                    }
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {currentExperience.endDate
                      ? format(parseISO(currentExperience.endDate), "yyyy-MM-dd")
                      : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-auto p-0 bg-background">
                  <Calendar
                    mode="single"
                    selected={currentExperience.endDate ? parseISO(currentExperience.endDate) : undefined}
                    onSelect={(date) => {
                      setCurrentExperience((prev) => ({
                        ...prev,
                        endDate: date ? format(date, "yyyy-MM-dd") : "",
                      }));
                    }}
                    initialFocus
                    captionLayout="dropdown"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={currentExperience.description}
                onChange={(e) => setCurrentExperience({ ...currentExperience, description: e.target.value })}
                placeholder="Describe your role and responsibilities"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : isEditing ? "Update Experience" : "Add Experience"}
            </Button>
          </CardFooter>
        </Card>
      </form>

      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        {experiences.map((exp) => (
          <li key={exp._id} className="rounded border p-4">
            <h3 className="text-lg font-bold">{exp.title}</h3>
            <p className="text-sm text-muted-foreground">
              {exp.company} - {exp.location}
            </p>
            <p className="text-sm text-muted-foreground">
              {new Date(exp.startDate).toLocaleDateString()} -{" "}
              {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : "Present"}
            </p>
            <p className="mt-2 text-muted-foreground">{exp.description}</p>
            <div className="mt-2 flex gap-2 flex-wrap">
              <Button
               
                onClick={() => {
                  if (isEditing && currentExperience._id !== exp._id) {
                    const confirmSwitch = confirm("You have unsaved changes. Do you want to discard and edit another?");
                    if (!confirmSwitch) return;
                  }

                  setCurrentExperience(exp);
                  setIsEditing(true);

                  setTimeout(() => {
                    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }, 0);
                }}

              >
                Edit
              </Button>

              <Button
              className="bg-red-700 hover:bg-red-800 dark:text-white"
                onClick={() => handleDelete(exp._id!)}
              >
                Delete
              </Button>
            </div>
          </li>
        ))}
      </ul>

    </div>
  );
}