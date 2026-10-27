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

export type Project = {
  slug: string
  title: string
  // The first photo is the cover in the Index.
  photos: Photo[]
}

function placeholders(slug: string, ratios: number[]): Photo[] {
  return ratios.map((ratio, i) => ({
    id: `${slug}-${String(i + 1).padStart(2, "0")}`,
    ratio,
  }))
}

// The Index, in order.
export const projects: Project[] = [
  {
    slug: "portraits",
    title: "Portraits",
    photos: placeholders("portraits", [3 / 4, 4 / 5, 2 / 3, 1, 3 / 4, 4 / 5]),
  },
  {
    slug: "places",
    title: "Places",
    photos: placeholders("places", [
      3 / 2,
      4 / 3,
      1,
      3 / 2,
      2 / 3,
      3 / 2,
      1,
      4 / 3,
    ]),
  },
]

// The homepage slideshow: every project's photos, in order.
export const photos: Photo[] = projects.flatMap((project) => project.photos)
