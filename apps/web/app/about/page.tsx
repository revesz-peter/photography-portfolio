import type { Metadata } from "next"

import { Frame } from "@/components/frame"
import type { Photo } from "@/lib/photos"
import { site } from "@/lib/site"

export const metadata: Metadata = {
  title: "About / Contact",
}

// Add a self-portrait or a favourite frame here via `src`.
const portrait: Photo = { id: "about", format: "35mm", orientation: "portrait" }

export default function Page() {
  return (
    <div className="grid max-w-5xl gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:gap-14">
      <Frame photo={portrait} sizes="(min-width: 768px) 40vw, 100vw" preload />

      <div className="max-w-md text-[15px] leading-relaxed">
        <h1 className="mb-6 text-sm font-bold tracking-[0.28em] uppercase">
          About
        </h1>
        <p>I am currently based in Budapest.</p>
        <p className="mt-4">
          <span aria-label="Contact">✉️</span> Instagram:{" "}
          <a
            href={site.instagram.url}
            target="_blank"
            rel="noreferrer"
            className="font-semibold underline decoration-1 underline-offset-4 hover:no-underline"
          >
            @{site.instagram.handle}
          </a>
        </p>
      </div>
    </div>
  )
}
