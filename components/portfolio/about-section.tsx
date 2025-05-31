import { MapPin } from "lucide-react";
import Image from "next/image";

interface Skill {
  name: string;
  image: string;
}

interface AboutSectionProps {
  aboutDescription: string;
  aboutProfileImage?: string;
  aboutTitle?: string;
  aboutLocation?: string;
  aboutBio?: string;
  skills?: Skill[];
  primaryColor: string;
}

export function AboutSection({
  aboutDescription,
  aboutProfileImage,
  aboutTitle,
  aboutLocation,
  aboutBio,
  skills,
  primaryColor,
}: AboutSectionProps) {
  return (
    <div className="relative mx-auto max-w-4xl rounded-2xl bg-white/80 dark:bg-background/80 shadow-xl p-6 md:p-10 backdrop-blur-md border border-border">
      {/* Profile & Info */}
      <div className="flex flex-col items-center gap-10 md:flex-row md:items-center">
        {/* Profile Image */}
        {aboutProfileImage && (
          <div
            className="relative h-40 w-40 md:h-56 md:w-56 rounded-full border-4 shadow-lg transition-transform duration-300 hover:scale-105"
            style={{ borderColor: primaryColor }}
          >
            <Image
              src={aboutProfileImage || "/placeholder.svg"}
              alt="Profile"
              fill
              className="object-cover rounded-full"
            />
          </div>
        )}

        {/* Text Content */}
        <div className="flex-1 space-y-4 text-center md:text-left">
          {aboutTitle && (
            <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-1">
              {aboutTitle}
            </h3>
          )}

          {aboutLocation && (
            <div
              className="flex items-center justify-center md:justify-start gap-2 text-sm font-medium"
              style={{ color: primaryColor }}
            >
              <MapPin className="h-4 w-4" />
              <span>{aboutLocation}</span>
            </div>
          )}

          <p className="max-w-2xl mx-auto md:mx-0 text-lg leading-relaxed text-muted-foreground">
            {aboutDescription}
          </p>

          {aboutBio && (
            <p className="max-w-2xl mx-auto md:mx-0 text-base text-gray-500 dark:text-gray-400 leading-relaxed">
              {aboutBio}
            </p>
          )}
        </div>
      </div>

      {/* Skills Section */}
      {skills && skills.length > 0 && (
        <div className="mt-10 space-y-4">
          <h3 className="text-2xl font-bold text-center md:text-left">Skills</h3>
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
            {skills.map((skill, index) => (
              <div
                key={index}
                className="flex items-center gap-2 rounded-full border px-4 py-2 bg-white/70 dark:bg-background/70 shadow-sm transition-transform duration-200 hover:scale-105 hover:shadow-md"
                style={{ borderColor: primaryColor }}
              >
                {skill.image && (
                  <div className="relative h-7 w-7">
                    <Image
                      src={skill.image}
                      alt={skill.name}
                      fill
                      className="object-contain rounded-full"
                    />
                  </div>
                )}
                <span
                  className="text-md font-medium"
                  style={{ color: primaryColor }}
                >
                  {skill.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
