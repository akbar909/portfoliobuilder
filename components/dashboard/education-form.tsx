"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { format, parseISO } from "date-fns";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Education {
  _id?: string;
  degree: string;
  institution: string;
  location?: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

interface EducationFormProps {
  educationList: Education[];
}

export function EducationForm({ educationList }: EducationFormProps) {
  const [education, setEducation] = useState<Education[]>(educationList || []);
  const [currentEducation, setCurrentEducation] = useState<Education>({
    degree: "",
    institution: "",
    location: "",
    startDate: "",
    endDate: "",
    description: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch education data from backend
  const fetchEducation = async () => {
    try {
      const res = await fetch("/api/portfolio/education");
      if (!res.ok) throw new Error("Failed to fetch education data");
      const data = await res.json();
      setEducation(data.education || []);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch education data");
    }
  };

  useEffect(() => {
    fetchEducation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEducation.degree.trim() || !currentEducation.institution.trim() || !currentEducation.startDate.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setIsLoading(true);
    try {
      const method = isEditing ? "PUT" : "POST";
      const endpoint = "/api/portfolio/education";
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentEducation),
      });
      if (!res.ok) {
        throw new Error("Failed to save education entry.");
      }
      const data = await res.json();
      toast.success(data.message);
      // Refetch education list after add/edit
      await fetchEducation();
      setCurrentEducation({
        degree: "",
        institution: "",
        location: "",
        startDate: "",
        endDate: "",
        description: "",
      });
      setIsEditing(false);
    } catch (error: any) {
      console.error("Error saving education entry:", error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (edu: Education) => {
    setCurrentEducation(edu);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this education entry?")) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/portfolio/education?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Failed to delete education entry.");
      }
      toast.success("Education entry deleted successfully.");
      // Refetch education list after delete
      await fetchEducation();
    } catch (error: any) {
      console.error("Error deleting education entry:", error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6" >
      <form onSubmit={handleSubmit} className=" mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>{isEditing ? "Edit Education" : "Add Education"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label>Degree *</Label>
              <Input
                value={currentEducation.degree}
                onChange={(e) => setCurrentEducation({ ...currentEducation, degree: e.target.value })}
                placeholder="e.g. Bachelor of Science in Computer Science"
                required
              />
            </div>
            <div>
              <Label>Institution *</Label>
              <Input
                value={currentEducation.institution}
                onChange={(e) => setCurrentEducation({ ...currentEducation, institution: e.target.value })}
                placeholder="e.g. University of Example"
                required
              />
            </div>
            <div>
              <Label>Location</Label>
              <Input
                value={currentEducation.location || ""}
                onChange={(e) => setCurrentEducation({ ...currentEducation, location: e.target.value })}
                placeholder="e.g. New York, NY"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Start Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={
                        "w-full justify-start text-left font-normal" +
                        (currentEducation.startDate ? "" : " text-muted-foreground")
                      }
                    >
                      {currentEducation.startDate
                        ? format(parseISO(currentEducation.startDate), "yyyy-MM-dd")
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-auto p-0 bg-background">
                    <Calendar
                      mode="single"
                      selected={currentEducation.startDate ? parseISO(currentEducation.startDate) : undefined}
                      onSelect={(date) => {
                        setCurrentEducation((prev) => ({
                          ...prev,
                          startDate: date ? format(date, "yyyy-MM-dd") : "",
                        }));
                      }}
                      initialFocus
                      captionLayout="dropdown"
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
                        (currentEducation.endDate ? "" : " text-muted-foreground")
                      }
                    >
                      {currentEducation.endDate
                        ? format(parseISO(currentEducation.endDate), "yyyy-MM-dd")
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-auto p-0 bg-background">
                    <Calendar
                      mode="single"
                      selected={currentEducation.endDate ? parseISO(currentEducation.endDate) : undefined}
                      onSelect={(date) => {
                        setCurrentEducation((prev) => ({
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
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={currentEducation.description || ""}
                onChange={(e) => setCurrentEducation({ ...currentEducation, description: e.target.value })}
                placeholder="Describe your studies, achievements, etc."
              />
            </div>
          </CardContent>
          <CardFooter className="justify-end gap-2">
            {isEditing && (
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setCurrentEducation({
                    degree: "",
                    institution: "",
                    location: "",
                    startDate: "",
                    endDate: "",
                    description: "",
                  });
                  setIsEditing(false);
                }}
                disabled={isLoading}
              >
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (isEditing ? "Updating..." : "Adding...") : isEditing ? "Update" : "Add"}
            </Button>
          </CardFooter>
        </Card>
      </form>
      <div>
        <h3 className="text-xl font-semibold mb-4">Your Education</h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {education.length === 0 && <li className="text-muted-foreground">No education entries yet.</li>}
          {education.map((edu) => (
            <li key={edu._id || `${edu.degree}-${edu.institution}`}
                className="flex flex-col md:flex-row md:items-center justify-between gap-2 border rounded-lg p-4 bg-card">
              <div>
                <div className="font-semibold text-lg">{edu.degree}</div>
                <div className="text-muted-foreground">{edu.institution}</div>
                <p className="text-sm text-muted-foreground">
              {new Date(edu.startDate).toLocaleDateString()} -{" "}
              {edu.endDate ? new Date(edu.endDate).toLocaleDateString() : "Present"}
            </p>
                {edu.location && <div className="text-sm text-muted-foreground">{edu.location}</div>}
                {edu.description && <div className="mt-2 text-sm">{edu.description}</div>}
              </div>
              <div className="flex gap-2 mt-2 md:mt-0">
                <Button type="button"  onClick={() => handleEdit(edu)} disabled={isLoading}>
                  Edit
                </Button>
                <Button type="button" className="bg-red-700 hover:bg-red-800 dark:text-white" onClick={() => handleDelete(edu._id!)} disabled={isLoading}>
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}