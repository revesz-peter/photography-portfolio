export type Format = "35mm" | "6x6" | "6x7" | "4x5"

export type Photo = {
  id: string
  format: Format
  orientation: "portrait" | "landscape"
  // Add your scans to apps/web/public/photos and point `src` at them,
  // e.g. "/photos/portrait-01.jpg". Frames without `src` render as empty cards.
  src?: string
  alt?: string
  caption?: string
}

export type Series = {
  slug: string
  title: string
  description: string
  photos: Photo[]
}

// Long edge / short edge of each negative.
const ratios: Record<Format, [number, number]> = {
  "35mm": [3, 2],
  "6x6": [1, 1],
  "6x7": [7, 6],
  "4x5": [5, 4],
}

export function aspectRatio(photo: Photo) {
  const [long, short] = ratios[photo.format]
  return photo.orientation === "landscape" ? long / short : short / long
}

function roll(
  slug: string,
  format: Format,
  orientations: Photo["orientation"][]
): Photo[] {
  return orientations.map((orientation, i) => ({
    id: `${slug}-${String(i + 1).padStart(2, "0")}`,
    format,
    orientation,
  }))
}

const P = "portrait"
const L = "landscape"

export const series: Series[] = [
  {
    slug: "portraits",
    title: "Portraits",
    description: "People, in available light.",
    photos: roll("portraits", "35mm", [P, P, P, P, P, P]),
  },
  {
    slug: "35mm",
    title: "35mm",
    description: "Streets and in-between moments.",
    photos: roll("35mm", "35mm", [L, L, P, L, L, P, L, L]),
  },
]

export const featured: Photo[] = roll("featured", "35mm", [
  P, L, L, P, P, L, P, L, L, P, P, L,
])

export function getSeries(slug: string) {
  return series.find((s) => s.slug === slug)
}
