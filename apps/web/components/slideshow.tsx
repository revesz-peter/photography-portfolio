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
// `start` picks the first slide; `onIndexChange` reports the current one.
function Slideshow({
  photos,
  start = 0,
  onIndexChange,
}: {
  photos: Photo[]
  start?: number
  onIndexChange?: (index: number) => void
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [index, setIndex] = React.useState(start)
  const count = photos.length

  const go = React.useCallback(
    (step: number) => setIndex((i) => (i + step + count) % count),
    [count]
  )

  React.useEffect(() => onIndexChange?.(index), [index, onIndexChange])

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      // Arrow keys belong to whatever is on top: skip if a dialog is open that isn't ours.
      const dialog = document.querySelector("dialog[open]")
      if (dialog && !dialog.contains(ref.current)) return
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
    <div ref={ref} className="relative h-full" style={{ containerType: "size" }}>
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
                preload={i === start}
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
