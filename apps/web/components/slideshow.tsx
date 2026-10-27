"use client"

import * as React from "react"

import { Frame } from "@/components/frame"
import { aspectRatio, type Photo } from "@/lib/photos"
import { cn } from "@workspace/ui/lib/utils"

// Slides kept mounted around the current one, so they're already loaded when you click.
const AHEAD = 2
const BEHIND = 1

// The slide's real display width: the area between header and footer (145px tall
// margins) times its ratio, or the screen width minus gutters on tall screens.
function slideSizes(photo: Photo) {
  const ratio = aspectRatio(photo).toFixed(3)
  return `(orientation: portrait) calc(100vw - 26px), calc((100vh - 145px) * ${ratio})`
}

// One photo at a time: click the right half for the next, the left half for the previous.
function Slideshow({ photos }: { photos: Photo[] }) {
  const [index, setIndex] = React.useState(0)
  const count = photos.length

  const go = React.useCallback(
    (step: number) => setIndex((i) => (i + step + count) % count),
    [count]
  )

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (document.querySelector("dialog[open]")) return
      if (event.key === "ArrowLeft") go(-1)
      if (event.key === "ArrowRight") go(1)
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [go])

  const mounted = new Set<number>()
  for (let step = -BEHIND; step <= AHEAD; step++) {
    mounted.add((index + step + count) % count)
  }

  return (
    <div className="relative h-full" style={{ containerType: "size" }}>
      {photos.map((photo, i) =>
        mounted.has(i) ? (
          // Stacked slides cross-fade; only the current one is visible.
          <div
            key={photo.id}
            aria-hidden={i !== index}
            className={cn(
              "absolute inset-0 flex items-center justify-center transition-opacity duration-500",
              i === index ? "opacity-100" : "opacity-0"
            )}
          >
            {/* Fit the frame inside the available space while keeping its proportions. */}
            <div
              style={{
                width: `min(100cqw, calc(100cqh * ${aspectRatio(photo)}))`,
              }}
            >
              <Frame
                photo={photo}
                sizes={slideSizes(photo)}
                preload={i === 0}
                loading="eager"
              />
            </div>
          </div>
        ) : null
      )}

      <button
        type="button"
        aria-label="Previous photo"
        onClick={() => go(-1)}
        className="absolute inset-y-0 left-0 w-1/2"
      />
      <button
        type="button"
        aria-label="Next photo"
        onClick={() => go(1)}
        className="absolute inset-y-0 right-0 w-1/2"
      />
    </div>
  )
}

export { Slideshow }
