export type Format = "35mm" | "6x6" | "6x7" | "4x5"

export type Photo = {
  id: string
  format: Format
  orientation: "portrait" | "landscape"
  // Add your scans to apps/web/public/photos and point `src` at them,
  // e.g. "/photos/01.jpg". Frames without `src` render as empty cards.
  src?: string
  alt?: string
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

const P = "portrait"
const L = "landscape"

// The slideshow, in order.
export const photos: Photo[] = ([P, L, L, P, L, P, L, L, P, L] as const).map(
  (orientation, i) => ({
    id: String(i + 1).padStart(2, "0"),
    format: "35mm",
    orientation,
  })
)
