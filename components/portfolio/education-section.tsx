'use client'

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

    // CSS variables for theme-aware styling (no JS theme detection needed)
    const cssVars = {
        '--edu-bg': backgroundColor,
        '--edu-bg-dark': backgroundColorDark,
        '--edu-fg': foregroundColor,
        '--edu-fg-dark': foregroundColorDark,
        '--edu-card-bg': 'var(--card-background)',
        '--edu-card-bg-dark': 'var(--card-background-dark)',
        '--edu-avatar-bg': `${primaryColor}15`,
        '--edu-avatar-bg-dark': `${primaryColor}33`,
        '--edu-primary': primaryColor,
    } as React.CSSProperties;

    return (
        <section
            id="education"
            className="mb-12 pt-16 -mt-16 bg-[var(--edu-bg)] text-[var(--edu-fg)] dark:bg-[var(--edu-bg-dark)] dark:text-[var(--edu-fg-dark)]"
            style={cssVars}
        >
            <div className="container py-12">
                <h2 className="mb-8 text-2xl font-bold">Education</h2>
                {education.length === 0 && (
                    <p className="text-center text-muted-foreground">No education added yet.</p>
                )}
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
                                className="relative flex flex-col rounded-xl bg-card shadow-sm border overflow-hidden group transition-all hover:shadow-lg bg-[var(--edu-card-bg)] dark:bg-[var(--edu-card-bg-dark)]"
                                style={{ borderLeft: `6px solid ${primaryColor}` }}
                            >
                                {/* Avatar */}
                                <div className="flex items-center gap-3 mb-4 mt-2 px-4">
                                    <div
                                        className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold shadow bg-[var(--edu-avatar-bg)] dark:bg-[var(--edu-avatar-bg-dark)]"
                                        style={{ color: primaryColor }}
                                    >
                                        {initials}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold leading-tight" style={{ color: primaryColor }}>{edu.degree}</h3>
                                        <p className="text-sm font-medium">{edu.institution}</p>
                                    </div>
                                </div>
                                {/* Dates & Location */}
                                <div className="px-4 flex flex-wrap items-center gap-2 text-xs mb-2">
                                    <span>
                                        {new Date(edu.startDate).toLocaleDateString()} - {edu.endDate ? new Date(edu.endDate).toLocaleDateString() : "Present"}
                                    </span>
                                    {edu.location && <span className="hidden sm:inline">• {edu.location}</span>}
                                </div>
                                {/* Description */}
                                {edu.description && (
                                    <div className="px-4 pb-4">
                                        <p className="text-sm leading-relaxed">{edu.description}</p>
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