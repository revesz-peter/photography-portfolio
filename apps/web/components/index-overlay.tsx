"use client"

import * as React from "react"

import { Frame } from "@/components/frame"
import { Overlay, OverlayHeader } from "@/components/overlay"
import type { Project } from "@/lib/photos"
import { cn } from "@workspace/ui/lib/utils"

const small = "text-[10.4px] leading-[1.2] font-[450]"

const number = (i: number) => String(i + 1).padStart(2, "0")

// "Index" link: a grid of project covers; a cover opens that project in a panel on the right.
function IndexOverlay({ projects }: { projects: Project[] }) {
  const [open, setOpen] = React.useState<number | null>(null)
  const project = open === null ? null : projects[open]
  const total = projects.reduce((n, p) => n + p.photos.length, 0)

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
            {projects.map((p, i) => (
              <li key={p.slug}>
                <button
                  type="button"
                  onClick={() => setOpen(i)}
                  className="block w-full text-left"
                >
                  {p.photos[0] && (
                    <Frame
                      photo={p.photos[0]}
                      sizes="(min-width: 1024px) 10vw, (min-width: 640px) 16vw, 33vw"
                    />
                  )}
                  <Caption
                    number={number(i)}
                    title={p.title}
                    className={cn(small, "mt-2")}
                  />
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </Overlay>
  )
}

function ProjectPanel({
  project,
  index,
  onBack,
}: {
  project: Project
  index: number
  onBack: () => void
}) {
  return (
    <div
      data-keep-open
      className="ml-auto flex min-h-full w-full animate-in flex-col bg-white duration-300 fade-in sm:w-1/2"
    >
      <OverlayHeader
        title={<Caption number={number(index)} title={project.title} />}
      />

      <div className="flex flex-col gap-[13px] px-[13px] pt-[13px]">
        {project.photos.map((photo) => (
          <Frame
            key={photo.id}
            photo={photo}
            sizes="(min-width: 640px) 50vw, 100vw"
          />
        ))}
      </div>

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
        <span>{project.photos.length} Images</span>
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
