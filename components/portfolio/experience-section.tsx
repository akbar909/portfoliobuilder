'use client'

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
  backgroundColor: string;
  backgroundColorDark: string;
  foregroundColor: string;
  foregroundColorDark: string;
}

export function ExperienceSection({
  experiences,
  primaryColor,
  backgroundColor,
  backgroundColorDark,
  foregroundColor,
  foregroundColorDark,
}: ExperienceSectionProps) {

  // CSS variables for theme-aware styling (no JS theme detection needed)
  const cssVars = {
    '--exp-bg': backgroundColor,
    '--exp-bg-dark': backgroundColorDark,
    '--exp-fg': foregroundColor,
    '--exp-fg-dark': foregroundColorDark,
    '--exp-card-bg': 'var(--card-background)',
    '--exp-card-bg-dark': 'var(--card-background-dark)',
    '--exp-avatar-bg': `${primaryColor}15`,
    '--exp-avatar-bg-dark': `${primaryColor}33`,
    '--exp-primary': primaryColor,
  } as React.CSSProperties;

  return (
    <section
      id="experience"
      className="mb-12 pt-16 -mt-16 bg-[var(--exp-bg)] text-[var(--exp-fg)] dark:bg-[var(--exp-bg-dark)] dark:text-[var(--exp-fg-dark)]"
      style={cssVars}
    >
      <div className="container py-12">
        <h2 className="mb-8 text-2xl font-bold">Experience</h2>
        {experiences.length === 0 && (
          <p className="text-center text-muted-foreground">No experiences added yet.</p>
        )}
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
                className="relative flex flex-col rounded-xl shadow-sm border overflow-hidden group transition-all hover:shadow-lg bg-[var(--exp-card-bg)] dark:bg-[var(--exp-card-bg-dark)]"
                style={{ borderLeft: `6px solid ${primaryColor}` }}
              >
                {/* Avatar */}
                <div className="flex items-center gap-3 mb-4 mt-2 px-4">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold shadow bg-[var(--exp-avatar-bg)] dark:bg-[var(--exp-avatar-bg-dark)]"
                    style={{ color: primaryColor }}
                  >
                    {initials}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold leading-tight" style={{ color: primaryColor }}>{exp.title}</h3>
                    <p className="text-sm font-medium">{exp.company}</p>
                  </div>
                </div>
                {/* Dates & Location */}
                <div className="px-4 flex flex-wrap items-center gap-2 text-xs mb-2">
                  <span>
                    {new Date(exp.startDate).toLocaleDateString()} - {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'Present'}
                  </span>
                  {exp.location && <span className="hidden sm:inline">• {exp.location}</span>}
                </div>
                {/* Description */}
                <div className="px-4 pb-4">
                  <p className="text-sm leading-relaxed">{exp.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}