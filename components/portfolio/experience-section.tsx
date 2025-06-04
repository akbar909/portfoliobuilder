'use client'
import { useTheme } from "@/components/theme-provider";

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
  const { theme } = useTheme();
  const bgColor = theme === "dark" ? backgroundColorDark : backgroundColor;
  const fgColor = theme === "dark" ? foregroundColorDark : foregroundColor;
  const avatarBg = theme === "dark" ? `${primaryColor}33` : `${primaryColor}15`;

  if (!experiences.length) {
    return <p className="text-center text-muted-foreground" style={{ color: fgColor }}>No experiences added yet.</p>;
  }

  return (
    <section id="experience" className="mb-12 pt-16 -mt-16" style={{ backgroundColor: bgColor, color: fgColor }}>
      <div className="container py-12">
        <h2 className="mb-8 text-2xl font-bold" style={{ color: fgColor }}>Experience</h2>
        <div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
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
                className="relative flex flex-col rounded-xl shadow-sm border overflow-hidden group transition-all hover:shadow-lg"
                style={{
                  borderLeft: `6px solid ${primaryColor}`,
                  backgroundColor: theme === "dark" ? "var(--card-background-dark)" : "var(--card-background)",
                  color: theme === "dark" ? "var(--foreground-dark)" : "var(--foreground)",
                }}
              >
                {/* Avatar */}
                <div className="flex items-center gap-3 mb-4 mt-2 px-4">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold shadow"
                    style={{ backgroundColor: avatarBg, color: primaryColor }}
                  >
                    {initials}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold leading-tight" style={{ color: primaryColor }}>{exp.title}</h3>
                    <p className="text-sm font-medium" style={{ color: theme === "dark" ? "var(--foreground-dark)" : "var(--foreground)" }}>{exp.company}</p>
                  </div>
                </div>
                {/* Dates & Location */}
                <div className="px-4 flex flex-wrap items-center gap-2 text-xs mb-2" style={{ color: theme === "dark" ? "var(--foreground-dark)" : "var(--foreground)" }}>
                  <span>
                    {new Date(exp.startDate).toLocaleDateString()} - {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'Present'}
                  </span>
                  {exp.location && <span className="hidden sm:inline">• {exp.location}</span>}
                </div>
                {/* Description */}
                <div className="px-4 pb-4">
                  <p className="text-sm leading-relaxed" style={{ color: theme === "dark" ? "var(--foreground-dark)" : "var(--foreground)" }}>{exp.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}