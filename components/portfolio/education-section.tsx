'use client'
import { useTheme } from "@/components/theme-provider";

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
  backgroundColor: string;
  backgroundColorDark: string;
  foregroundColor: string;
  foregroundColorDark: string;
}

export function EducationSection({
  education,
  primaryColor,
  backgroundColor,
  backgroundColorDark,
  foregroundColor,
  foregroundColorDark,
}: EducationSectionProps) {
  const { theme } = useTheme();
  const bgColor = theme === "dark" ? backgroundColorDark : backgroundColor;
  const fgColor = theme === "dark" ? foregroundColorDark : foregroundColor;
  const avatarBg = theme === "dark" ? `${primaryColor}33` : `${primaryColor}15`;

  return (
    <section id="education" className="mb-12 pt-16 -mt-16" style={{ backgroundColor: bgColor, color: fgColor }}>
      <div className="container py-12">
        <h2 className="mb-8 text-2xl font-bold" style={{ color: fgColor }}>Education</h2>
        {education.length === 0 && (
          <p className="text-center text-muted-foreground" style={{ color: fgColor }}>No education added yet.</p>
        )}
        <div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
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
                    <h3 className="text-lg font-semibold leading-tight" style={{ color: primaryColor }}>{edu.degree}</h3>
                    <p className="text-sm font-medium" style={{ color: theme === "dark" ? "var(--foreground-dark)" : "var(--foreground)" }}>{edu.institution}</p>
                  </div>
                </div>
                {/* Dates & Location */}
                <div className="px-4 flex flex-wrap items-center gap-2 text-xs mb-2" style={{ color: theme === "dark" ? "var(--foreground-dark)" : "var(--foreground)" }}>
                  <span>
                    {new Date(edu.startDate).toLocaleDateString()} - {edu.endDate ? new Date(edu.endDate).toLocaleDateString() : "Present"}
                  </span>
                  {edu.location && <span className="hidden sm:inline">• {edu.location}</span>}
                </div>
                {/* Description */}
                {edu.description && (
                  <div className="px-4 pb-4">
                    <p className="text-sm leading-relaxed" style={{ color: theme === "dark" ? "var(--foreground-dark)" : "var(--foreground)" }}>{edu.description}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}