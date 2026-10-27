import type { StaticImageData } from "next/image"

export type Photo = {
  id: string
  // Put scans in apps/web/photos and import them at the top of this file:
  //   import p01 from "@/photos/01.jpg"
  // then set `image: p01`. The card takes the image's own shape.
  image?: StaticImageData
  // Shape of the empty card until an image is added, as width / height.
  ratio?: number
  alt?: string
}

export function aspectRatio(photo: Photo) {
  if (photo.image) return photo.image.width / photo.image.height
  return photo.ratio ?? 3 / 2
}

// The slideshow, in order.
export const photos: Photo[] = [
  { id: "01", ratio: 3 / 4 },
  { id: "02", ratio: 3 / 2 },
  { id: "03", ratio: 1 },
  { id: "04", ratio: 2 / 3 },
  { id: "05", ratio: 4 / 3 },
  { id: "06", ratio: 4 / 5 },
  { id: "07", ratio: 3 / 2 },
  { id: "08", ratio: 1 },
  { id: "09", ratio: 3 / 4 },
  { id: "10", ratio: 3 / 2 },
]
