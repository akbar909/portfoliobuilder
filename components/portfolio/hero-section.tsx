import Hero1 from "./hero/Hero1"
import Hero2 from "./hero/Hero2"
import Hero3 from "./hero/Hero3"

interface HeroSectionProps {
  heroTemplate?: "hero1" | "hero2" | "hero3"
  title: string
  subtitle: string
  imageUrl?: string
}

const heroTemplates = {
  hero1: Hero1,
  hero2: Hero2,
  hero3: Hero3,
}

export function HeroSection({ heroTemplate = "hero1", title, subtitle, imageUrl }: HeroSectionProps) {
  const HeroComponent = heroTemplates[heroTemplate] || Hero1
  return <HeroComponent title={title} subtitle={subtitle} image={imageUrl} />
}
