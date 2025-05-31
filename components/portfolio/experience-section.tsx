interface Experience {
  _id: string;
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  description: string;
}

interface ExperienceSectionProps {
  experiences: Experience[];
  primaryColor: string;
}

export function ExperienceSection({ experiences, primaryColor }: ExperienceSectionProps) {
  if (!experiences.length) {
    return <p className="text-center text-muted-foreground">No experiences added yet.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {experiences.map((exp) => {
        // Get company initials for avatar
        const initials = exp.company
          ? exp.company
              .split(" ")
              .map((w) => w[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()
          : "?";
        return (
          <div
            key={exp._id}
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
                <h3 className="text-lg font-semibold leading-tight" style={{ color: primaryColor }}>{exp.title}</h3>
                <p className="text-sm text-muted-foreground font-medium">{exp.company}</p>
              </div>
            </div>
            {/* Dates & Location */}
            <div className="px-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground mb-2">
              <span>
                {new Date(exp.startDate).toLocaleDateString()} - {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'Present'}
              </span>
              {exp.location && <span className="hidden sm:inline">• {exp.location}</span>}
            </div>
            {/* Description */}
            <div className="px-4 pb-4">
              <p className="text-sm text-muted-foreground leading-relaxed">{exp.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}