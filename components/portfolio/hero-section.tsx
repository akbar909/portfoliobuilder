import Image from "next/image"

interface HeroSectionProps {
  type: "text" | "image"
  title: string
  subtitle: string
  imageUrl?: string
}

export function HeroSection({ type, title, subtitle, imageUrl }: HeroSectionProps) {
  if (type === "image" && imageUrl) {
    return (
      <div className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] xl:h-[90vh] overflow-hidden flex items-center justify-center">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={title}
          fill
          className="object-contain"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white p-4 text-center">
          <h1 className="text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl max-w-4xl">{title}</h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl">{subtitle}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl">{title}</h1>
      <p className="mt-4 max-w-3xl text-xl text-muted-foreground">{subtitle}</p>
    </div>
  )
}
