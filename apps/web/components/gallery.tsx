import { Frame } from "@/components/frame"
import type { Photo } from "@/lib/photos"

function Gallery({ photos }: { photos: Photo[] }) {
  return (
    <ul className="columns-2 gap-3 md:columns-3 lg:gap-5">
      {photos.map((photo, i) => (
        <li key={photo.id} className="mb-3 break-inside-avoid lg:mb-5">
          <Frame
            photo={photo}
            sizes="(min-width: 768px) 25vw, 50vw"
            preload={i < 2}
          />
        </li>
      ))}
    </ul>
  )
}

export { Gallery }
