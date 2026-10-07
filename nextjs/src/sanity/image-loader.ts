'use client'

type LoaderProps = {src: string; width: number; quality?: number}

/**
 * next/image loader that lets the Sanity CDN resize images. Keeps any
 * aspect ratio requested via `h` so hotspot crops stay intact.
 */
export default function sanityImageLoader({src, width, quality}: LoaderProps) {
  if (!src.startsWith('https://cdn.sanity.io/')) return src
  const url = new URL(src)
  const w = Number(url.searchParams.get('w'))
  const h = Number(url.searchParams.get('h'))
  url.searchParams.set('w', String(width))
  if (w && h) url.searchParams.set('h', String(Math.round((width * h) / w)))
  url.searchParams.set('q', String(quality || 75))
  return url.toString()
}
