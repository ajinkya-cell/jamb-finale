import Image from 'next/image'
import {urlFor} from '@/sanity/image'
import type {SanityImageValue} from '@/sanity/types-helpers'

type Props = {
  image: SanityImageValue | null | undefined
  /** Intrinsic render width; Sanity resizes, next/image picks srcset widths. */
  width: number
  /** Crop to this aspect ratio (width / height). Defaults to the image's own ratio. */
  aspectRatio?: number
  sizes: string
  className?: string
  priority?: boolean
  fill?: boolean
}

export function SanityImage({image, width, aspectRatio, sizes, className, priority, fill}: Props) {
  if (!image?.asset) return null
  const dims = image.asset.metadata?.dimensions
  const ratio = aspectRatio ?? dims?.aspectRatio ?? 4 / 3
  const height = Math.round(width / ratio)
  const builder = urlFor(image).width(width)
  const src = (aspectRatio ? builder.height(height).fit('crop') : builder).url()
  const lqip = image.asset.metadata?.lqip ?? undefined

  return (
    <Image
      src={src}
      alt={image.alt ?? ''}
      sizes={sizes}
      className={className}
      priority={priority}
      placeholder={lqip ? 'blur' : 'empty'}
      blurDataURL={lqip}
      {...(fill ? {fill: true} : {width, height})}
    />
  )
}
