'use client'
import { useTheme } from "@/components/theme-provider";
import Image from "next/image";

const scrollToSection = (sectionId: string) => {
  const section = document.getElementById(sectionId)
  if (section) {
    section.scrollIntoView({ behavior: "smooth" })
  }
}

interface Hero3Props {
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

export default function Hero3({ title, subtitle, image, primaryColor, backgroundColor, backgroundColorDark, foregroundColor, foregroundColorDark, secondaryColor, secondaryColorDark, buttonColor, buttonColorDark, buttonTextColor, buttonTextColorDark }: Hero3Props) {
  const { theme } = useTheme()
  return (
    <section
      className="relative w-full h-[600px] overflow-hidden flex items-center justify-center"
      style={{
        backgroundColor: theme === "dark" ? backgroundColorDark : backgroundColor,
        color: theme === "dark" ? foregroundColorDark : foregroundColor
      }}
    >
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
      <div className="absolute inset-0 backdrop-blur-sm z-10" style={{ backgroundColor: theme === "dark" ? backgroundColorDark + '80' : backgroundColor + '80' }} />
      {/* Content */}
      <div className="relative z-20 text-center px-6 max-w-3xl">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight drop-shadow-md">
          {title}
        </h1>
        <p
          className="mt-4 text-lg md:text-xl max-w-2xl mx-auto relative z-20"
          style={{
            color: theme === "dark" ? secondaryColorDark : foregroundColor,
            textShadow: theme === "dark"
              ? `0 0 16px ${primaryColor}, 0 0 32px ${primaryColor}80`
              : `0 0 12px ${primaryColor}, 0 0 24px ${primaryColor}40`,
          }}
        >
          {subtitle}
        </p>
        <div className="mt-6">
          <button
            onClick={() => scrollToSection("contact")}
            className="px-6 py-3 font-medium rounded-full shadow-lg hover:scale-105 transition-transform duration-300"
            style={{
              backgroundColor: theme === "dark" ? buttonColorDark : buttonColor,
              color: theme === "dark" ? buttonTextColorDark : buttonTextColor
            }}
          >
            Hire me
          </button>
        </div>
      </div>
    </section>
  )
}
