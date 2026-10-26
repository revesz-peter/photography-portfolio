"use client"

import * as React from "react"

import { Frame } from "@/components/frame"
import { aspectRatio, type Photo } from "@/lib/photos"

// One photo at a time: click the right half for the next, the left half for the previous.
function Slideshow({ photos }: { photos: Photo[] }) {
  const [index, setIndex] = React.useState(0)
  const photo = photos[index]!

  const go = React.useCallback(
    (step: number) =>
      setIndex((i) => (i + step + photos.length) % photos.length),
    [photos.length]
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

  return (
    <div className="relative h-full" style={{ containerType: "size" }}>
      {/* Fit the frame inside the available space while keeping its proportions. */}
      <div className="flex h-full items-center justify-center">
        <div
          style={{
            width: `min(100cqw, calc(100cqh * ${aspectRatio(photo)}))`,
          }}
        >
          <Frame
            key={photo.id}
            photo={photo}
            sizes="(min-width: 1024px) 70vw, 100vw"
            preload={index === 0}
            className="animate-in duration-500 fade-in"
          />
        </div>
      </div>

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
