import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { Gallery } from "@/components/gallery"
import { getSeries, series } from "@/lib/photos"

export const dynamicParams = false

export function generateStaticParams() {
  return series.map((s) => ({ series: s.slug }))
}

export async function generateMetadata(
  props: PageProps<"/[series]">
): Promise<Metadata> {
  const { series: slug } = await props.params
  const entry = getSeries(slug)
  return entry ? { title: entry.title, description: entry.description } : {}
}

export default async function Page(props: PageProps<"/[series]">) {
  const { series: slug } = await props.params
  const entry = getSeries(slug)
  if (!entry) notFound()

  return (
    <>
      <header className="mb-8 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <div>
          <h1 className="text-sm font-bold tracking-[0.28em] uppercase">
            {entry.title}
          </h1>
          <p className="mt-1.5 text-[13px]">{entry.description}</p>
        </div>
        <p className="text-[11px] font-semibold tracking-[0.18em] uppercase">
          {entry.photos.length} frames
        </p>
      </header>
      <Gallery photos={entry.photos} />
    </>
  )
}
