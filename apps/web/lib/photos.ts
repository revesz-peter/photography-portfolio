import type { StaticImageData } from "next/image"

import places13A from "@/photos/places/13A.jpg"
import places15A from "@/photos/places/15A.jpg"
import places18A from "@/photos/places/18A.jpg"
import places26A from "@/photos/places/26A.jpg"
import places27A from "@/photos/places/27A.jpg"
import places4738 from "@/photos/places/IMG_4738.jpg"
import places4752 from "@/photos/places/IMG_4752.jpg"
import places4765 from "@/photos/places/IMG_4765.jpg"

export type Photo = {
  id: string
  // Put scans in apps/web/photos/<project> and import them at the top of this file:
  //   import places01 from "@/photos/places/01.jpg"
  // then set `image: places01`. The card takes the image's own shape.
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
    photos: [
      {
        id: "13A",
        image: places13A,
        alt: "A mountain across calm sea in evening haze",
      },
      {
        id: "15A",
        image: places15A,
        alt: "A rocky headland rising from the sea",
      },
      {
        id: "18A",
        image: places18A,
        alt: "A seaside villa terrace above the sea, a boat below",
      },
      {
        id: "26A",
        image: places26A,
        alt: "Rocks and small boats on glittering water",
      },
      {
        id: "27A",
        image: places27A,
        alt: "A green cliff above a rocky shore with swimmers",
      },
      {
        id: "IMG_4738",
        image: places4738,
        alt: "Doves in a sunlit courtyard with a fountain and a palm",
      },
      {
        id: "IMG_4752",
        image: places4752,
        alt: "A fruit vendor's three-wheeled truck on a narrow street",
      },
      {
        id: "IMG_4765",
        image: places4765,
        alt: "An apartment facade with balconies and hanging laundry",
      },
    ],
  },
]

// The homepage slideshow: every project's real photos, in order.
// Until any photo is added, it shows the placeholder cards instead.
const all = projects.flatMap((project) => project.photos)
const real = all.filter((photo) => photo.image)
export const photos: Photo[] = real.length ? real : all
