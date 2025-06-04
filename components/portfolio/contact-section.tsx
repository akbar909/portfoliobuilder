"use client"
import { useTheme } from "@/components/theme-provider"
import { Github, Linkedin, Mail, MapPin, Twitter } from "lucide-react"
import Link from "next/link"

interface ContactSectionProps {
  contact: {
    email?: string
    linkedin?: string
    github?: string
    twitter?: string
  }
  location?: string
  primaryColor: string
  backgroundColor: string
  backgroundColorDark: string
  foregroundColor: string
  foregroundColorDark: string
  linkColor: string
  linkColorDark: string
  cardBackgroundColor: string
  cardBackgroundColorDark: string
}

export function ContactSection({
  contact,
  location,
  primaryColor,
  backgroundColor,
  backgroundColorDark,
  foregroundColor,
  foregroundColorDark,
  linkColor,
  linkColorDark,
  cardBackgroundColor,
  cardBackgroundColorDark,
}: ContactSectionProps) {
  const { theme } = useTheme()
  const bgColor = theme === "dark" ? backgroundColorDark : backgroundColor
  const fgColor = theme === "dark" ? foregroundColorDark : foregroundColor
  const linkFg = theme === "dark" ? linkColorDark : linkColor
  const avatarBg = theme === "dark" ? `${primaryColor}33` : `${primaryColor}15`
  const cardBg = theme === "dark" ? cardBackgroundColorDark : cardBackgroundColor
  const hasContactInfo = contact && Object.values(contact).some(Boolean)

  return (
    <section id="contact" className="pt-16 -mt-16" style={{ backgroundColor: bgColor, color: fgColor }}>
      <div className="container py-12">
        <h2 className="mb-8 text-2xl font-bold" style={{ color: fgColor }}>Contact</h2>
        <div className="space-y-8">
          {!hasContactInfo && !location ? (
            <p className="text-center text-muted-foreground" style={{ color: fgColor }}>No contact information provided yet.</p>
          ) : (
            <div className="grid gap-8 md:grid-cols-2">
              {/* Contact Methods */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold" style={{ color: fgColor }}>Get in Touch</h3>
                <div className="space-y-4">
                  {contact?.email && (
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-full"
                        style={{ backgroundColor: avatarBg, color: primaryColor }}
                      >
                        <Mail className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium" style={{ color: fgColor }}>Email</p>
                        <Link
                          href={`mailto:${contact.email}`}
                          className="text-sm hover:underline"
                          style={{ color: linkFg }}
                        >
                          {contact.email}
                        </Link>
                      </div>
                    </div>
                  )}

                  {contact?.linkedin && (
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-full"
                        style={{ backgroundColor: avatarBg, color: primaryColor }}
                      >
                        <Linkedin className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium" style={{ color: fgColor }}>LinkedIn</p>
                        <Link
                          href={contact.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm hover:underline"
                          style={{ color: linkFg }}
                        >
                          View Profile
                        </Link>
                      </div>
                    </div>
                  )}

                  {contact?.github && (
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-full"
                        style={{ backgroundColor: avatarBg, color: primaryColor }}
                      >
                        <Github className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium" style={{ color: fgColor }}>GitHub</p>
                        <Link
                          href={contact.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm hover:underline"
                          style={{ color: linkFg }}
                        >
                          View Profile
                        </Link>
                      </div>
                    </div>
                  )}

                  {contact?.twitter && (
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-full"
                        style={{ backgroundColor: avatarBg, color: primaryColor }}
                      >
                        <Twitter className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium" style={{ color: fgColor }}>Twitter/X</p>
                        <Link
                          href={contact.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm hover:underline"
                          style={{ color: linkFg }}
                        >
                          View Profile
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Location and Additional Info */}
              {location && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold" style={{ color: fgColor }}>Location</h3>
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-full"
                      style={{ backgroundColor: avatarBg, color: primaryColor }}
                    >
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: fgColor }}>Based in</p>
                      <p className="text-sm text-muted-foreground" style={{ color: fgColor }}>{location}</p>
                    </div>
                  </div>
                  <div
                    className="mt-4 rounded-lg border p-4"
                    style={{ borderColor: linkFg, background: cardBg }}
                  >
                    <p className="text-sm" style={{ color: fgColor }}>
                      I'm always open to discussing new projects, opportunities, or partnerships.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
