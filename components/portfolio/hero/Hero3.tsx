'use client'
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

export default function Hero3({
  title,
  subtitle,
  image,
  primaryColor,
  backgroundColor,
  backgroundColorDark,
  foregroundColor,
  foregroundColorDark,
  secondaryColor,
  secondaryColorDark,
  buttonColor,
  buttonColorDark,
  buttonTextColor,
  buttonTextColorDark
}: Hero3Props) {

  // CSS variables for theme-aware styling (no JS theme detection needed)
  const cssVars = {
    '--hero-bg': backgroundColor,
    '--hero-bg-dark': backgroundColorDark,
    '--hero-fg': foregroundColor,
    '--hero-fg-dark': foregroundColorDark,
    '--hero-secondary': secondaryColorDark,
    '--hero-secondary-light': foregroundColor,
    '--hero-btn': buttonColor,
    '--hero-btn-dark': buttonColorDark,
    '--hero-btn-text': buttonTextColor,
    '--hero-btn-text-dark': buttonTextColorDark,
    '--hero-overlay': backgroundColor + '80',
    '--hero-overlay-dark': backgroundColorDark + '80',
    '--hero-shadow-light': `0 0 12px ${primaryColor}, 0 0 24px ${primaryColor}40`,
    '--hero-shadow-dark': `0 0 16px ${primaryColor}, 0 0 32px ${primaryColor}80`,
  } as React.CSSProperties;

  return (
    <section
      className="relative w-full h-[600px] overflow-hidden flex items-center justify-center bg-[var(--hero-bg)] text-[var(--hero-fg)] dark:bg-[var(--hero-bg-dark)] dark:text-[var(--hero-fg-dark)]"
      style={cssVars}
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
      <div className="absolute inset-0 backdrop-blur-sm z-10 bg-[var(--hero-overlay)] dark:bg-[var(--hero-overlay-dark)]" />
      {/* Content */}
      <div className="relative z-20 text-center px-6 max-w-3xl">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight drop-shadow-md">
          {title}
        </h1>
        <p
          className="mt-4 text-lg md:text-xl max-w-2xl mx-auto relative z-20 text-[var(--hero-secondary-light)] dark:text-[var(--hero-secondary)] [text-shadow:var(--hero-shadow-light)] dark:[text-shadow:var(--hero-shadow-dark)]"
        >
          {subtitle}
        </p>
        <div className="mt-6">
          <button
            onClick={() => scrollToSection("contact")}
            className="px-6 py-3 font-medium rounded-full shadow-lg hover:scale-105 transition-transform duration-300 bg-[var(--hero-btn)] text-[var(--hero-btn-text)] dark:bg-[var(--hero-btn-dark)] dark:text-[var(--hero-btn-text-dark)]"
          >
            Hire me
          </button>
        </div>
      </div>
    </section>
  )
}
