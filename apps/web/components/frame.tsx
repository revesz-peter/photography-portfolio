import Image from "next/image"

import { cn } from "@workspace/ui/lib/utils"
import { aspectRatio, type Photo } from "@/lib/photos"

// A single photo at its negative's proportions, or an empty card until a scan is added.
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
      {photo.src && (
        <Image
          src={photo.src}
          alt={photo.alt ?? ""}
          fill
          sizes={sizes}
          preload={preload}
          className="object-cover grayscale"
        />
      )}
    </div>
  )
}

export { Frame }
