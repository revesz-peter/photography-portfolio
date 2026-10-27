"use client"

import * as React from "react"

import { site } from "@/lib/site"

const CloseContext = React.createContext<() => void>(() => {})

// Nav link that washes the page out in white and shows `children` on top.
// Clicking anywhere outside a link, button, form or [data-keep-open] closes it,
// as does (Close) or Escape. With `bare`, children render their own header.
function Overlay({
  label,
  bare = false,
  onClose,
  children,
}: {
  label: string
  bare?: boolean
  onClose?: () => void
  children: React.ReactNode
}) {
  const dialogRef = React.useRef<HTMLDialogElement>(null)
  const close = React.useCallback(() => dialogRef.current?.close(), [])

  return (
    <>
      <button type="button" onClick={() => dialogRef.current?.showModal()}>
        {label}
      </button>

      <dialog
        ref={dialogRef}
        aria-label={label}
        onClose={onClose}
        onClick={(e) => {
          const target = e.target as Element
          if (!target.closest("a, button, form, [data-keep-open]")) {
            e.currentTarget.close()
          }
        }}
        className="fixed inset-0 m-0 h-svh max-h-none w-full max-w-none animate-in overflow-y-auto bg-white/90 p-0 text-[13.6px] leading-[1.2] font-[550] text-black/85 duration-300 fade-in backdrop:bg-transparent"
      >
        <CloseContext value={close}>
          {bare ? (
            children
          ) : (
            <>
              <OverlayHeader />
              <div className="px-[13px] pt-[15px]">{children}</div>
            </>
          )}
        </CloseContext>
      </dialog>
    </>
  )
}

// Title on the left (the site name by default), (Close) on the right.
function OverlayHeader({ title }: { title?: React.ReactNode }) {
  const close = React.use(CloseContext)

  return (
    <div className="flex items-start justify-between gap-4 px-[13px] pt-[11px]">
      <div>{title ?? <span className="lowercase">{site.name}</span>}</div>
      <button type="button" onClick={close} className="shrink-0">
        (Close)
      </button>
    </div>
  )
}

export { Overlay, OverlayHeader }
