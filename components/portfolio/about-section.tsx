import Image from "next/image";
import { MapPin } from "lucide-react";

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
    <div className="space-y-10 p-6  md:p-10">
      {/* Profile Section */}
      <div className="flex flex-col items-center gap-10 md:flex-row md:items-start">
        {aboutProfileImage && (
          <div className="relative h-80 w-80 rounded-lg shadow-sm">
            <Image
              src={aboutProfileImage || "/placeholder.svg"}
              alt="Profile"
              fill
              className="object-contain rounded-lg"
            />
          </div>
        )}


        <div className="space-y-5 text-center md:text-left">
          {aboutTitle && (
            <h3 className="text-3xl font-extrabold">{aboutTitle}</h3>
          )}

          {aboutLocation && (
            <div
              className="flex items-center justify-center gap-2 text-sm md:justify-start"
              style={{ color: primaryColor }}
            >
              <MapPin className="h-4 w-4" />
              <span>{aboutLocation}</span>
            </div>
          )}

          <p className="max-w-2xl text-lg ">{aboutDescription}</p>

          {aboutBio && (
            <p className="max-w-2xl text-base text-gray-500">{aboutBio}</p>
          )}
        </div>
      </div>

      {/* Skills Section */}
      {skills && skills.length > 0 && (
        <div className="space-y-5">
          <h3 className="text-2xl font-bold ">Skills</h3>
          <div className="flex flex-wrap gap-4">
            {skills.map((skill, index) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-lg border  px-4 py-2 shadow-sm"
              >
                {skill.image && (
                  <div className="relative h-8 w-8">
                    <Image
                      src={skill.image}
                      alt={skill.name}
                      fill
                      className="object-contain"
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
