"use client"
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

export default function Hero1({
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
}: Hero1Props) {

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId)
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
    }
  }

  // CSS variables for theme-aware styling (no JS theme detection needed)
  const cssVars = {
    '--hero-bg': backgroundColor,
    '--hero-bg-dark': backgroundColorDark,
    '--hero-fg': foregroundColor,
    '--hero-fg-dark': foregroundColorDark,
    '--hero-secondary': secondaryColor,
    '--hero-secondary-dark': secondaryColorDark,
    '--hero-btn': buttonColor,
    '--hero-btn-dark': buttonColorDark,
    '--hero-btn-text': buttonTextColor,
    '--hero-btn-text-dark': buttonTextColorDark,
    '--hero-shadow-light': `0 0 12px ${primaryColor}, 0 0 24px ${primaryColor}40`,
    '--hero-shadow-dark': `0 0 16px ${primaryColor}, 0 0 32px ${primaryColor}80`,
  } as React.CSSProperties;

  return (
    <section
      className="relative w-full overflow-hidden bg-[var(--hero-bg)] text-[var(--hero-fg)] dark:bg-[var(--hero-bg-dark)] dark:text-[var(--hero-fg-dark)]"
      style={cssVars}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-20 flex flex-col-reverse md:flex-row items-center justify-between gap-12">
        {/* Text Section */}
        <div className="text-center md:text-left max-w-xl z-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
            {title}
          </h1>
          <p
            className="mt-4 text-lg md:text-xl max-w-md text-[var(--hero-secondary)] dark:text-[var(--hero-secondary-dark)] [text-shadow:var(--hero-shadow-light)] dark:[text-shadow:var(--hero-shadow-dark)]"
          >
            {subtitle}
          </p>
          <div className="mt-6">
            <button
              onClick={() => scrollToSection("contact")}
              className="px-6 py-3 font-medium rounded-md shadow hover:opacity-90 transition duration-300 bg-[var(--hero-btn)] text-[var(--hero-btn-text)] dark:bg-[var(--hero-btn-dark)] dark:text-[var(--hero-btn-text-dark)]"
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
