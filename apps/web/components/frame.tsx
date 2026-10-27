import Image from "next/image"

import { cn } from "@workspace/ui/lib/utils"
import { aspectRatio, type Photo } from "@/lib/photos"

// A single photo at its own proportions, or an empty card until a scan is added.
function Frame({
  photo,
  sizes,
  preload,
  className,
}: {
  photo: Photo
  sizes: string
  preload?: boolean
  className?: string
}) {
  return (
    <div
      className={cn("relative w-full overflow-hidden bg-muted", className)}
      style={{ aspectRatio: aspectRatio(photo) }}
    >
      {photo.image && (
        <Image
          src={photo.image}
          alt={photo.alt ?? ""}
          fill
          sizes={sizes}
          preload={preload}
          placeholder="blur"
          className="object-cover grayscale"
        />
      )}
    </div>
  )
}

export { Frame }
