"use client"
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

  // CSS variables for theme-aware styling (no JS theme detection needed)
  const cssVars = {
    '--contact-bg': backgroundColor,
    '--contact-bg-dark': backgroundColorDark,
    '--contact-fg': foregroundColor,
    '--contact-fg-dark': foregroundColorDark,
    '--contact-link': linkColor,
    '--contact-link-dark': linkColorDark,
    '--contact-card-bg': cardBackgroundColor,
    '--contact-card-bg-dark': cardBackgroundColorDark,
    '--contact-avatar-bg': `${primaryColor}15`,
    '--contact-avatar-bg-dark': `${primaryColor}33`,
    '--contact-primary': primaryColor,
  } as React.CSSProperties;

  const hasContactInfo = contact && Object.values(contact).some(Boolean)

  return (
    <section
      id="contact"
      className="pt-16 -mt-16 bg-[var(--contact-bg)] text-[var(--contact-fg)] dark:bg-[var(--contact-bg-dark)] dark:text-[var(--contact-fg-dark)]"
      style={cssVars}
    >
      <div className="container py-12">
        <h2 className="mb-8 text-2xl font-bold">Contact</h2>
        <div className="space-y-8">
          {!hasContactInfo && !location ? (
            <p className="text-center text-muted-foreground">No contact information provided yet.</p>
          ) : (
            <div className="grid gap-8 md:grid-cols-2">
              {/* Contact Methods */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Get in Touch</h3>
                <div className="space-y-4">
                  {contact?.email && (
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--contact-avatar-bg)] dark:bg-[var(--contact-avatar-bg-dark)]"
                        style={{ color: primaryColor }}
                      >
                        <Mail className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Email</p>
                        <Link
                          href={`mailto:${contact.email}`}
                          className="text-sm hover:underline text-[var(--contact-link)] dark:text-[var(--contact-link-dark)]"
                        >
                          {contact.email}
                        </Link>
                      </div>
                    </div>
                  )}

                  {contact?.linkedin && (
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--contact-avatar-bg)] dark:bg-[var(--contact-avatar-bg-dark)]"
                        style={{ color: primaryColor }}
                      >
                        <Linkedin className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">LinkedIn</p>
                        <Link
                          href={contact.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm hover:underline text-[var(--contact-link)] dark:text-[var(--contact-link-dark)]"
                        >
                          View Profile
                        </Link>
                      </div>
                    </div>
                  )}

                  {contact?.github && (
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--contact-avatar-bg)] dark:bg-[var(--contact-avatar-bg-dark)]"
                        style={{ color: primaryColor }}
                      >
                        <Github className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">GitHub</p>
                        <Link
                          href={contact.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm hover:underline text-[var(--contact-link)] dark:text-[var(--contact-link-dark)]"
                        >
                          View Profile
                        </Link>
                      </div>
                    </div>
                  )}

                  {contact?.twitter && (
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--contact-avatar-bg)] dark:bg-[var(--contact-avatar-bg-dark)]"
                        style={{ color: primaryColor }}
                      >
                        <Twitter className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Twitter/X</p>
                        <Link
                          href={contact.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm hover:underline text-[var(--contact-link)] dark:text-[var(--contact-link-dark)]"
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
                  <h3 className="text-xl font-semibold">Location</h3>
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--contact-avatar-bg)] dark:bg-[var(--contact-avatar-bg-dark)]"
                      style={{ color: primaryColor }}
                    >
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Based in</p>
                      <p className="text-sm text-muted-foreground">{location}</p>
                    </div>
                  </div>
                  <div
                    className="mt-4 rounded-lg border p-4 border-[var(--contact-link)] dark:border-[var(--contact-link-dark)] bg-[var(--contact-card-bg)] dark:bg-[var(--contact-card-bg-dark)]"
                  >
                    <p className="text-sm">
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
