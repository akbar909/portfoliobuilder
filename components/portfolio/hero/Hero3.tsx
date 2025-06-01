'use client'
import Image from "next/image";

const scrollToSection = (sectionId: string) => {
  const section = document.getElementById(sectionId)
  if (section) {
    section.scrollIntoView({ behavior: "smooth" })
  }
}

export default function Hero3({ title, subtitle, image }) {
  return (
    <section className="relative w-full h-[600px] bg-background text-foreground overflow-hidden flex items-center justify-center">
      
      {/* Background Image */}
      {image && (
        <Image
          src={image}
          alt="Hero Background"
          layout="fill"
          objectFit="cover"
          objectPosition="center"
          className="z-0 opacity-60"
          priority
        />
      )}

      {/* Overlay Blur */}
      <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10" />

      {/* Content */}
      <div className="relative z-20 text-center px-6 max-w-3xl">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight drop-shadow-md">
          {title}
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground drop-shadow max-w-2xl mx-auto">
          {subtitle}
        </p>
        <div className="mt-6">
          <button onClick={() => scrollToSection("contact")} className="px-6 py-3 bg-primary text-white font-medium rounded-full shadow-lg hover:scale-105 transition-transform duration-300">
           Hire me
          </button>
        </div>
      </div>
    </section>
  );
}
