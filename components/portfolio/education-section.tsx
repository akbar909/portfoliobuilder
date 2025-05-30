
interface Education {
  _id: string;
  degree: string;
  institution: string;
  location?: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

interface EducationSectionProps {
  education: Education[];
  primaryColor: string;
}

export function EducationSection({ education, primaryColor }: EducationSectionProps) {
  if (!education.length) {
    return <p className="text-center text-muted-foreground">No education added yet.</p>;
  }

  return (
    <div className="">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        {education.map((edu) => (
          <div key={edu._id} className="rounded-lg border bg-card shadow-sm p-6 flex flex-col h-full">
            <div className="mb-2">
              <h3 className="text-lg font-semibold" style={{ color: primaryColor }}>{edu.degree}</h3>
              <div className="text-muted-foreground text-sm">{edu.institution}</div>
              {edu.location && <div className="text-xs text-muted-foreground mt-1">{edu.location}</div>}
            </div>
            <div className="text-xs text-muted-foreground mb-2">
              {new Date(edu.startDate).toLocaleDateString()} - {edu.endDate ? new Date(edu.endDate).toLocaleDateString() : "Present"}
            </div>
            {edu.description && <div className="mt-2 text-sm text-gray-700">{edu.description}</div>}
          </div>
        ))}
      </div>
    </div>
  );
} 