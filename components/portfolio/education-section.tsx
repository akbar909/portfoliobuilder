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
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {education.map((edu) => {
          // Get institution initials for avatar
          const initials = edu.institution
            ? edu.institution
                .split(" ")
                .map((w) => w[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()
            : "?";
          return (
            <div
              key={edu._id}
              className="relative flex flex-col rounded-xl bg-card shadow-sm border overflow-hidden group transition-all hover:shadow-lg"
              style={{ borderLeft: `6px solid ${primaryColor}` }}
            >
              {/* Avatar */}
              <div className="flex items-center gap-3 mb-4 mt-2 px-4">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold shadow"
                  style={{ backgroundColor: `${primaryColor}22`, color: primaryColor }}
                >
                  {initials}
                </div>
                <div>
                  <h3 className="text-lg font-semibold leading-tight" style={{ color: primaryColor }}>{edu.degree}</h3>
                  <p className="text-sm text-muted-foreground font-medium">{edu.institution}</p>
                </div>
              </div>
              {/* Dates & Location */}
              <div className="px-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground mb-2">
                <span>
                  {new Date(edu.startDate).toLocaleDateString()} - {edu.endDate ? new Date(edu.endDate).toLocaleDateString() : "Present"}
                </span>
                {edu.location && <span className="hidden sm:inline">• {edu.location}</span>}
              </div>
              {/* Description */}
              {edu.description && (
                <div className="px-4 pb-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">{edu.description}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
} 