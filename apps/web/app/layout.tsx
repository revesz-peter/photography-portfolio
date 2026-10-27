import type { Metadata } from "next"
import Link from "next/link"
import { Geist, Geist_Mono } from "next/font/google"

import "@workspace/ui/globals.css"
import { ContactForm } from "@/components/contact-form"
import { IndexOverlay } from "@/components/index-overlay"
import { Overlay } from "@/components/overlay"
import { ThemeProvider } from "@/components/theme-provider"
import { photos, projects } from "@/lib/photos"
import { site } from "@/lib/site"
import { cn } from "@workspace/ui/lib/utils"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

// Link previews (iMessage, WhatsApp, Slack…) show only the Instagram handle.
export const metadata: Metadata = {
  title: site.name,
  openGraph: { title: site.instagram.handle },
  twitter: { card: "summary", title: site.instagram.handle },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        geist.variable
      )}
    >
      <body className="bg-white text-black/85 **:cursor-default">
        <ThemeProvider forcedTheme="light" enableSystem={false}>
          <header className="fixed inset-x-0 top-0 z-10 flex items-start justify-between px-[13px] pt-[11px] text-[13.6px] leading-[1.2] font-[550]">
            <Link href="/" className="lowercase">
              {site.name}
            </Link>
            <nav className="flex gap-3">
              <Overlay label="Information">
                <div className="grid gap-y-4 sm:grid-cols-[345px_auto] sm:gap-x-3">
                  <p>I am currently based in Budapest.</p>
                  <p>
                    <a
                      href={site.instagram.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      @{site.instagram.handle}
                    </a>
                  </p>
                </div>
              </Overlay>
              <IndexOverlay projects={projects} />
              <Overlay label="Email">
                <ContactForm />
              </Overlay>
            </nav>
          </header>

          <main className="fixed inset-x-[13px] top-[72px] bottom-[73px]">
            {children}
          </main>

          <footer className="fixed bottom-[13px] left-[13px] text-[10.4px] leading-[1.2] font-[450]">
            <p>No. of Images: {String(photos.length).padStart(2, "0")}</p>
            <p className="text-black/40">
              All Rights Reserved © {new Date().getFullYear()}
            </p>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  )
}
