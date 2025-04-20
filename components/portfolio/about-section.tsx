import Image from "next/image"
import { MapPin } from "lucide-react"

interface Skill {
  name: string
  image: string
}

interface AboutSectionProps {
  aboutDescription: string
  aboutProfileImage?: string
  aboutTitle?: string
  aboutLocation?: string
  aboutBio?: string
  skills?: Skill[]
  primaryColor: string
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
    <div className="space-y-8">
      {/* Profile Section */}
      <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
        {aboutProfileImage && (
          <div className="relative h-48 w-48 shrink-0 overflow-hidden rounded-full border md:h-64 md:w-64">
            <Image src={aboutProfileImage || "/placeholder.svg"} alt="Profile" fill className="object-cover" />
          </div>
        )}
        <div className="space-y-4 text-center md:text-left">
          {aboutTitle && <h3 className="text-2xl font-bold">{aboutTitle}</h3>}
          {aboutLocation && (
            <div  style={{ color: primaryColor }} className="flex items-center justify-center  gap-1 text-muted-foreground md:justify-start">
              <MapPin className="h-4 w-4" />
              <span >{aboutLocation}</span>
            </div>
          )}
          <p className="max-w-2xl">{aboutDescription}</p>
          {aboutBio && <p className="max-w-2xl text-muted-foreground">{aboutBio}</p>}
        </div>
      </div>

      {/* Skills Section */}
      {skills && skills.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Skills</h3>
          <div className="flex flex-wrap gap-4">
            {skills.map((skill, index) => (
              <div key={index} className="flex items-center gap-2 rounded-full bg-muted px-4 py-2">
                {skill.image && (
                  <div className="relative h-6 w-6">
                    <Image src={skill.image} alt={skill.name} fill className="object-contain" />
                  </div>
                )}
                <span  style={{ color: primaryColor }}>{skill.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}