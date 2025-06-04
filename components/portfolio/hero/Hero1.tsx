"use client"
import { useTheme } from "@/components/theme-provider";
import Image from "next/image";

interface Hero1Props {
  title: string;
  subtitle: string;
  image?: string;
  primaryColor: string;
  backgroundColor: string;
  backgroundColorDark: string;
  foregroundColor: string;
  foregroundColorDark: string;
  secondaryColor?: string;
  secondaryColorDark?: string;
  buttonColor: string;
  buttonColorDark: string;
  buttonTextColor: string;
  buttonTextColorDark: string;
}

export default function Hero1({ title, subtitle, image, primaryColor, backgroundColor, backgroundColorDark, foregroundColor, foregroundColorDark, secondaryColor, secondaryColorDark, buttonColor, buttonColorDark, buttonTextColor, buttonTextColorDark }: Hero1Props) {
  const { theme } = useTheme()

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId)
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
    }
  }
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: theme === "dark" ? backgroundColorDark : backgroundColor,
        color: theme === "dark" ? foregroundColorDark : foregroundColor
      }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-20 flex flex-col-reverse md:flex-row items-center justify-between gap-12">
        {/* Text Section */}
        <div className="text-center md:text-left max-w-xl z-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
            {title}
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-md" 
          style={{ color: theme === "dark" ? secondaryColorDark : secondaryColor, textShadow: theme === "dark" ? `0 0 16px ${primaryColor}, 0 0 32px ${primaryColor}80` : `0 0 12px ${primaryColor}, 0 0 24px ${primaryColor}40` }}>
            {subtitle}
          </p>
          <div className="mt-6">
            <button
              onClick={() => scrollToSection("contact")}
              className="px-6 py-3 font-medium rounded-md shadow hover:opacity-90 transition duration-300"
              style={{
                backgroundColor: theme === "dark" ? buttonColorDark : buttonColor,
                color: theme === "dark" ? buttonTextColorDark : buttonTextColor
              }}
            >
              {`Let's Connect`}
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
            <div className="absolute -inset-2 rounded-3xl bg-primary opacity-5 blur-2xl animate-pulse"></div>
          </div>
        )}
      </div>

      {/* Decorative Background Circle */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
    </section>
  );
}
