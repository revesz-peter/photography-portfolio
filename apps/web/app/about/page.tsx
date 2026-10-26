import type { Metadata } from "next"

import { Frame } from "@/components/frame"
import type { Photo } from "@/lib/photos"

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
      </div>
    </div>
  )
}
