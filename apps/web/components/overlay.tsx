"use client"

import * as React from "react"

import { site } from "@/lib/site"

// Nav link that washes the page out in white and shows `children` on top.
// Clicking anywhere outside a link, button or form closes it, as does (Close) or Escape.
function Overlay({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  const dialogRef = React.useRef<HTMLDialogElement>(null)

  return (
    <>
      <button type="button" onClick={() => dialogRef.current?.showModal()}>
        {label}
      </button>

      <dialog
        ref={dialogRef}
        aria-label={label}
        onClick={(e) => {
          if (!(e.target as Element).closest("a, button, form")) {
            e.currentTarget.close()
          }
        }}
        className="fixed inset-0 m-0 h-svh max-h-none w-full max-w-none animate-in bg-white/90 p-0 text-[13.6px] leading-[1.2] font-[550] text-black/85 duration-300 fade-in backdrop:bg-transparent"
      >
        <div className="flex items-start justify-between px-[13px] pt-[11px]">
          <span className="lowercase">{site.name}</span>
          <button type="button" onClick={() => dialogRef.current?.close()}>
            (Close)
          </button>
        </div>

        <div className="px-[13px] pt-[15px]">{children}</div>
      </dialog>
    </>
  )
}

export { Overlay }
