import { Mail, Linkedin, Github, Twitter, MapPin } from "lucide-react"
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
}

export function ContactSection({ contact, location, primaryColor }: ContactSectionProps) {
  const hasContactInfo = contact && Object.values(contact).some(Boolean)

  return (
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
                    className="flex h-10 w-10 items-center justify-center rounded-full"
                    style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
                  >
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <Link
                      href={`mailto:${contact.email}`}
                      className="text-sm text-muted-foreground hover:underline"
                      style={{ color: primaryColor }}
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
                    style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
                  >
                    <Linkedin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">LinkedIn</p>
                    <Link
                      href={contact.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:underline"
                      style={{ color: primaryColor }}
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
                    style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
                  >
                    <Github className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">GitHub</p>
                    <Link
                      href={contact.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:underline"
                      style={{ color: primaryColor }}
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
                    style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
                  >
                    <Twitter className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Twitter/X</p>
                    <Link
                      href={contact.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:underline"
                      style={{ color: primaryColor }}
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
                  className="flex h-10 w-10 items-center justify-center rounded-full"
                  style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
                >
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">Based in</p>
                  <p className="text-sm text-muted-foreground">{location}</p>
                </div>
              </div>
              <div className="mt-4 rounded-lg border p-4">
                <p className="text-sm">I'm always open to discussing new projects, opportunities, or partnerships.</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
