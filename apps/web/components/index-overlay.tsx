"use client"

import * as React from "react"

import { Frame } from "@/components/frame"
import { Overlay, OverlayHeader } from "@/components/overlay"
import { Slideshow } from "@/components/slideshow"
import { aspectRatio, type Project } from "@/lib/photos"
import { cn } from "@workspace/ui/lib/utils"

const small = "text-[10.4px] leading-[1.2] font-[450]"

const number = (i: number) => String(i + 1).padStart(2, "0")

const realPhotos = (project: Project) =>
  project.photos.filter((photo) => photo.image).length

// "Index" link: a grid of project covers; a cover opens that project full width.
function IndexOverlay({ projects }: { projects: Project[] }) {
  const [open, setOpen] = React.useState<number | null>(null)
  const project = open === null ? null : projects[open]
  // Only real photos count; placeholder cards don't.
  const total = projects.reduce((n, p) => n + realPhotos(p), 0)

  return (
    <Overlay label="Index" bare onClose={() => setOpen(null)}>
      {project && open !== null ? (
        <ProjectPanel
          project={project}
          index={open}
          onBack={() => setOpen(null)}
        />
      ) : (
        <>
          <OverlayHeader
            title={`Index (${projects.length} Projects, ${total} Images total.)`}
          />
          <ul className="grid grid-cols-3 items-start gap-[13px] px-[13px] pt-[11px] pb-[13px] sm:grid-cols-6 lg:grid-cols-10">
            {projects.map((p, i) => {
              const caption = (
                <Caption
                  number={number(i)}
                  title={p.title}
                  className={cn(small, "mt-2")}
                />
              )

              // A project with no photos yet: a blank 2:3 card that doesn't open.
              if (!realPhotos(p)) {
                return (
                  <li key={p.slug}>
                    <div
                      className={cn(
                        small,
                        "flex aspect-2/3 w-full items-center justify-center bg-muted text-black/40"
                      )}
                    >
                      Coming soon
                    </div>
                    {caption}
                  </li>
                )
              }

              return (
                <li key={p.slug}>
                  <button
                    type="button"
                    onClick={() => setOpen(i)}
                    className="block w-full text-left"
                  >
                    <Frame
                      photo={p.photos[0]!}
                      sizes="(min-width: 1024px) 10vw, (min-width: 640px) 16vw, 33vw"
                    />
                    {caption}
                  </button>
                </li>
              )
            })}
          </ul>
        </>
      )}
    </Overlay>
  )
}

// A project, full width: every photo in justified rows at its own proportions, so the
// whole set reads at a glance. Clicking a photo opens it full screen.
function ProjectPanel({
  project,
  index,
  onBack,
}: {
  project: Project
  index: number
  onBack: () => void
}) {
  const [viewing, setViewing] = React.useState<number | null>(null)
  const count = project.photos.length

  return (
    <div
      data-keep-open
      className="flex min-h-full w-full animate-in flex-col bg-white duration-300 fade-in"
    >
      <OverlayHeader
        title={<Caption number={number(index)} title={project.title} />}
      />

      {/* Each photo grows in proportion to its ratio from a shared row height (--row),
          so every row is one height and fills the width without cropping. */}
      <ul className="flex flex-wrap gap-[13px] px-[13px] pt-[13px] [--row:28svh] sm:[--row:44svh]">
        {project.photos.map((photo, i) => {
          const ratio = aspectRatio(photo)
          return (
            <li
              key={photo.id}
              style={{ flex: `${ratio} 1 calc(var(--row) * ${ratio})` }}
            >
              <button
                type="button"
                onClick={() => setViewing(i)}
                aria-label={`View image ${i + 1} of ${count}`}
                className="block w-full"
              >
                <Frame
                  photo={photo}
                  sizes={`(min-width: 640px) ${Math.ceil(44 * ratio * 1.25)}vh, 50vw`}
                />
              </button>
            </li>
          )
        })}
        {/* Soaks up the leftover width so a short last row keeps the row height. */}
        <li aria-hidden className="grow-[1000] basis-0" />
      </ul>

      <div
        className={cn(
          small,
          "mt-auto flex justify-between gap-4 px-[13px] pt-24 pb-[13px]"
        )}
      >
        <span>
          (
          <button type="button" onClick={onBack} className="underline">
            Return to Projects
          </button>
          )
        </span>
        <span>{count} Images</span>
      </div>

      {viewing !== null && (
        <Viewer
          project={project}
          index={index}
          start={viewing}
          onBack={() => setViewing(null)}
        />
      )}
    </div>
  )
}

// One photo of a project, fitted to the screen. Click the halves or use the arrow
// keys to step through; Escape or (Return to Images) goes back to the grid.
function Viewer({
  project,
  index,
  start,
  onBack,
}: {
  project: Project
  index: number
  start: number
  onBack: () => void
}) {
  const [current, setCurrent] = React.useState(start)
  const count = project.photos.length

  React.useEffect(() => {
    // Escape would close the whole dialog; here it steps back to the grid instead.
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return
      event.preventDefault()
      onBack()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [onBack])

  return (
    <div
      data-keep-open
      className="fixed inset-0 z-10 flex animate-in flex-col bg-white duration-300 fade-in"
    >
      <OverlayHeader
        title={<Caption number={number(index)} title={project.title} />}
      />

      <div className="min-h-0 flex-1 px-[13px] pt-[13px] pb-[13px]">
        <Slideshow
          photos={project.photos}
          start={start}
          onIndexChange={setCurrent}
        />
      </div>

      <div
        className={cn(small, "flex justify-between gap-4 px-[13px] pb-[13px]")}
      >
        <span>
          (
          <button type="button" onClick={onBack} className="underline">
            Return to Images
          </button>
          )
        </span>
        <span>
          {String(current + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
        </span>
      </div>
    </div>
  )
}

// "01   Portraits": number and title with a wide gap, as in the reference.
function Caption({
  number,
  title,
  className,
}: {
  number: string
  title: string
  className?: string
}) {
  return (
    <span className={cn("flex gap-[0.9em]", className)}>
      <span>{number}</span>
      <span>{title}</span>
    </span>
  )
}

export { IndexOverlay }
