"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { MenuIcon, XIcon } from "lucide-react"

import { cn } from "@workspace/ui/lib/utils"
import { site } from "@/lib/site"

const links = [
  { href: "/", label: "Portfolio" },
  { href: "/about", label: "About / Contact" },
]

const linkText = "text-xs font-semibold tracking-[0.18em] uppercase"

function SiteNav() {
  const pathname = usePathname()
  const [open, setOpen] = React.useState(false)

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur lg:fixed lg:inset-y-0 lg:left-0 lg:w-72 lg:bg-transparent lg:backdrop-blur-none">
      <div className="flex h-full flex-col px-5 py-5 sm:px-8 lg:px-11 lg:py-16">
        <div className="flex items-start justify-between gap-4">
          <Link href="/" className="block">
            <span className="block text-sm font-bold tracking-[0.28em] uppercase">
              {site.name}
            </span>
            <span className="mt-1.5 block text-[11px] font-semibold tracking-[0.2em] uppercase">
              {site.tagline}
            </span>
          </Link>
          <button
            type="button"
            className="-m-2 p-2 transition-opacity hover:opacity-70 lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <XIcon className="size-5" strokeWidth={1.75} />
            ) : (
              <MenuIcon className="size-5" strokeWidth={1.75} />
            )}
          </button>
        </div>

        <nav
          id="site-menu"
          aria-label="Main"
          className={cn(
            "mt-8 flex-col lg:mt-14 lg:flex lg:flex-1",
            open ? "flex" : "hidden"
          )}
        >
          <ul className="space-y-2.5">
            {links.map((link) => {
              const active = pathname === link.href
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className={cn(
                      linkText,
                      "inline-flex items-center transition-opacity",
                      active ? "text-foreground" : "hover:opacity-70"
                    )}
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "h-0.5 bg-foreground transition-all",
                        active ? "mr-2 w-4" : "w-0"
                      )}
                    />
                    {link.label}
                  </Link>
                </li>
              )
            })}
          </ul>

          <a
            href={site.instagram.url}
            target="_blank"
            rel="noreferrer"
            className={cn(
              linkText,
              "mt-8 mb-4 self-start transition-opacity hover:opacity-70 lg:mt-auto lg:mb-0"
            )}
          >
            Instagram
          </a>
        </nav>
      </div>
    </header>
  )
}

export { SiteNav }
