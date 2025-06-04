import { AboutSection } from "@/components/portfolio/about-section"
import { ContactSection } from "@/components/portfolio/contact-section"
import { EducationSection } from "@/components/portfolio/education-section"
import { ExperienceSection } from "@/components/portfolio/experience-section"
import { HeroSection } from "@/components/portfolio/hero-section"
import { PortfolioNavbar } from "@/components/portfolio/portfolio-navbar"
import { ProjectSection } from "@/components/portfolio/project-section"
import { notFound } from "next/navigation"

interface PortfolioPageProps {
  params: {
    username: string
  }
}

export default async function PortfolioPage({ params }: PortfolioPageProps) {
  // Fetch from your API route
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/portfolio/${params.username}`, {
    cache: "no-store"
  });

  if (!res.ok) {
    notFound();
  }

  const portfolio = await res.json();

  const primaryColor = portfolio.customizations?.primaryColor || "#3b82f6";
  const backgroundColor = portfolio.customizations?.backgroundColor || "#ffffff";
  const backgroundColorDark = portfolio.customizations?.backgroundColorDark || "#18181b";
  const foregroundColor = portfolio.customizations?.foregroundColor || "#111827";
  const foregroundColorDark = portfolio.customizations?.foregroundColorDark || "#f4f4f5";
  const secondaryColor = portfolio.customizations?.secondaryColor || "#6366f1";
  const secondaryColorDark = portfolio.customizations?.secondaryColorDark || "#818cf8";
  const buttonColor = portfolio.customizations?.buttonColor || "#2563eb";
  const buttonColorDark = portfolio.customizations?.buttonColorDark || "#3b82f6";
  const buttonTextColor = portfolio.customizations?.buttonTextColor || "#ffffff";
  const buttonTextColorDark = portfolio.customizations?.buttonTextColorDark || "#f4f4f5";
  const cardBackgroundColor = portfolio.customizations?.cardBackgroundColor || "#f3f4f6";
  const cardBackgroundColorDark = portfolio.customizations?.cardBackgroundColorDark || "#27272a";
  const linkColor = portfolio.customizations?.linkColor || "#2563eb";
  const linkColorDark = portfolio.customizations?.linkColorDark || "#818cf8";
  const navbarColor = portfolio.customizations?.navbarColor || "#ffffff";
  const navbarColorDark = portfolio.customizations?.navbarColorDark || "#18181b";
  const footerColor = portfolio.customizations?.footerColor || "#f9fafb";
  const footerColorDark = portfolio.customizations?.footerColorDark || "#27272a";

  return (
    <div
      className="min-h-screen"
      style={{
        "--primary": primaryColor,
        "--background": backgroundColor,
        "--background-dark": backgroundColorDark,
        "--foreground": foregroundColor,
        "--foreground-dark": foregroundColorDark,
        "--secondary": secondaryColor,
        "--secondary-dark": secondaryColorDark,
        "--button": buttonColor,
        "--button-dark": buttonColorDark,
        "--button-text": buttonTextColor,
        "--button-text-dark": buttonTextColorDark,
        "--card-background": cardBackgroundColor,
        "--card-background-dark": cardBackgroundColorDark,
        "--link": linkColor,
        "--link-dark": linkColorDark,
        "--navbar": navbarColor,
        "--navbar-dark": navbarColorDark,
        "--footer": footerColor,
        "--footer-dark": footerColorDark,
        "--radius": portfolio.customizations?.borderRadius || "0.5rem",
        "--font-family": portfolio.customizations?.fontFamily || "Inter",
      } as React.CSSProperties}
    >
      <PortfolioNavbar
        username={portfolio.user.username}
        primaryColor={primaryColor}
        backgroundColor={backgroundColor}
        backgroundColorDark={backgroundColorDark}
        foregroundColor={foregroundColor}
        foregroundColorDark={foregroundColorDark}
        secondaryColor={secondaryColor}
        secondaryColorDark={secondaryColorDark}
        linkColor={linkColor}
        linkColorDark={linkColorDark}
      />

      <section id="home">
        <HeroSection
          heroTemplate={portfolio.heroTemplate}
          title={portfolio.heroTitle}
          subtitle={portfolio.heroSubtitle}
          imageUrl={portfolio.heroImage}
          primaryColor={primaryColor}
          backgroundColor={backgroundColor}
          backgroundColorDark={backgroundColorDark}
          foregroundColor={foregroundColor}
          foregroundColorDark={foregroundColorDark}
          secondaryColor={secondaryColor}
          secondaryColorDark={secondaryColorDark}
          buttonColor={buttonColor}
          buttonColorDark={buttonColorDark}
          buttonTextColor={buttonTextColor}
          buttonTextColorDark={buttonTextColorDark}
        />
      </section>

      
          <AboutSection
            aboutDescription={portfolio.aboutDescription || ""}
            aboutProfileImage={portfolio.aboutProfileImage}
            aboutTitle={portfolio.aboutTitle}
            aboutLocation={portfolio.aboutLocation}
            aboutBio={portfolio.aboutBio}
            skills={portfolio.skills}
            primaryColor={primaryColor}
            backgroundColor={backgroundColor}
            backgroundColorDark={backgroundColorDark}
            foregroundColor={foregroundColor}
            foregroundColorDark={foregroundColorDark}
            secondaryColor={secondaryColor}
            secondaryColorDark={secondaryColorDark}
          />
      
        
          <ProjectSection 
            projects={portfolio.projects || []} 
            primaryColor={primaryColor}
            backgroundColor={backgroundColor}
            backgroundColorDark={backgroundColorDark}
            foregroundColor={foregroundColor}
            foregroundColorDark={foregroundColorDark}
            linkColor={linkColor}
            linkColorDark={linkColorDark}
          />
      
        
          <ExperienceSection 
            experiences={portfolio.experiences || []} 
            primaryColor={primaryColor}
            backgroundColor={backgroundColor}
            backgroundColorDark={backgroundColorDark}
            foregroundColor={foregroundColor}
            foregroundColorDark={foregroundColorDark}

          />
      
          <EducationSection 
            education={portfolio.education || []} 
            primaryColor={primaryColor}
            backgroundColor={backgroundColor}
            backgroundColorDark={backgroundColorDark}
            foregroundColor={foregroundColor}
            foregroundColorDark={foregroundColorDark}
          />
      
        
          <ContactSection
            contact={portfolio.contact || {}}
            location={portfolio.aboutLocation}
            primaryColor={primaryColor}
            backgroundColor={backgroundColor}
            backgroundColorDark={backgroundColorDark}
            foregroundColor={foregroundColor}
            foregroundColorDark={foregroundColorDark}
            linkColor={linkColor}
            linkColorDark={linkColorDark}
            cardBackgroundColor={cardBackgroundColor}
            cardBackgroundColorDark={cardBackgroundColorDark}
          />
      
    </div>
  )
}
