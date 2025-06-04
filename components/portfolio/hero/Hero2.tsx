'use client'
import { useTheme } from "@/components/theme-provider";
import Image from "next/image";

const scrollToSection = (sectionId: string) => {
  const section = document.getElementById(sectionId)
  if (section) {
    section.scrollIntoView({ behavior: "smooth" })
  }
}

interface Hero2Props {
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

export default function Hero2({ title, subtitle, image, primaryColor, backgroundColor, backgroundColorDark, foregroundColor, foregroundColorDark, secondaryColor, secondaryColorDark, buttonColor, buttonColorDark, buttonTextColor, buttonTextColorDark }: Hero2Props) {
  const { theme } = useTheme()
  return (
    <section
      className="w-full py-20 px-6"
      style={{
        backgroundColor: theme === "dark" ? backgroundColorDark : backgroundColor,
        color: theme === "dark" ? foregroundColorDark : foregroundColor
      }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 items-center">

        {/* Vertical Text Section */}
        <div className="md:col-span-5 flex flex-col justify-center items-start space-y-6 relative">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight z-10">
            {title}
          </h1>
          <div className="h-1 w-16 mb-2" style={{ backgroundColor: theme === "dark" ? secondaryColorDark : primaryColor }} />
          <p className="text-lg md:text-xl max-w-md z-10" 
          style={{ color: theme === "dark" ? secondaryColorDark : secondaryColor, textShadow: theme === "dark" ? `0 0 16px ${primaryColor}, 0 0 32px ${primaryColor}80` : `0 0 12px ${primaryColor}, 0 0 24px ${primaryColor}40` }}>
            {subtitle}
          </p>
          <button
            onClick={() => scrollToSection("contact")}
            className="mt-4 px-6 py-3 font-medium rounded-lg shadow hover:scale-105 transition"
            style={{
              backgroundColor: theme === "dark" ? buttonColorDark : buttonColor,
              color: theme === "dark" ? buttonTextColorDark : buttonTextColor
            }}
          >
            Get in Touch
          </button>
        </div>

        {/* Image Frame Section */}
        {image && (
          <div className="md:col-span-7 relative flex items-center justify-center">
            <div className="relative w-full h-[360px] md:h-[480px] max-w-[500px] rounded-3xl overflow-hidden shadow-xl border-4 border-primary">
              <Image
                src={image}
                alt="Hero Visual"
                layout="fill"
                objectFit="cover"
                className="rounded-3xl"
                priority
              />
            </div>
            {/* Decorative square behind image */}
            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-primary/10 rounded-2xl blur-xl z-0" />
          </div>
        )}
      </div>
    </section>
  );
}
