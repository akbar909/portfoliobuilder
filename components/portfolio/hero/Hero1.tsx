"use client"
import Image from "next/image"

export default function Hero1({ title, subtitle, image }) {

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId)
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
    }
  }
  return (
    <section className="relative w-full bg-background text-foreground overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-20 flex flex-col-reverse md:flex-row items-center justify-between gap-12">
        {/* Text Section */}
        <div className="text-center md:text-left max-w-xl z-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
            {title}
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-md">
            {subtitle}
          </p>
          <div className="mt-6">
            <button onClick={() => scrollToSection("contact")} className="px-6 py-3 bg-primary text-white font-medium rounded-md shadow hover:opacity-90 transition duration-300">
             Let's Connect
            </button>
          </div>
        </div>

        {/* Image Section */}
        {image && (
          <div className="w-full md:w-[450px] relative z-10">
            <Image
              src={image}
              alt="Hero"
              width={500}
              height={500}
              className="w-full h-auto rounded-3xl shadow-2xl object-cover"
              priority
            />
            <div className="absolute -inset-2 rounded-3xl bg-white opacity-5 blur-2xl animate-pulse"></div>
          </div>
        )}
      </div>

      {/* Decorative Background Circle */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
    </section>
  );
}
