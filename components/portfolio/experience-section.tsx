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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
      {experiences.map((exp) => (
        <div key={exp._id} className="rounded-lg border p-6">
          <h3 className="text-xl font-semibold" style={{ color: primaryColor }}>{exp.title}</h3>
          <p className="text-sm text-muted-foreground">{exp.company} - {exp.location}</p>
          <p className="text-sm text-muted-foreground">
            {new Date(exp.startDate).toLocaleDateString()} - {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'Present'}
          </p>
          <p className="mt-2 text-muted-foreground">{exp.description}</p>
        </div>
      ))}
    </div>
  );
}