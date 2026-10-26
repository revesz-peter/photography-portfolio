import { Gallery } from "@/components/gallery"
import { featured } from "@/lib/photos"

export default function Page() {
  return (
    <>
      <h1 className="sr-only">Featured</h1>
      <Gallery photos={featured} />
    </>
  )
}
