'use client'

import {Children, useCallback, useEffect, useState, type ReactNode} from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import {stegaClean} from 'next-sanity'
import {ArrowLeft, ArrowRight} from 'lucide-react'

type Props = {
  children: ReactNode
  /** Slides visible at ≥1024px (4 or 5). */
  columns: 4 | 5
  label: string
}

const arrowClass =
  'absolute top-1/2 inline-flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-zinc-200 bg-white shadow-sm transition-all hover:bg-zinc-100 disabled:pointer-events-none disabled:opacity-50 max-sm:disabled:hidden'

/** Jamb's product carousel: 2/3/4–5 per view, 32px gutters, round arrows outside the track. */
export function ProductCarousel({children, columns, label}: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({align: 'start', slidesToScroll: 'auto'})
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  const update = useCallback(() => {
    if (!emblaApi) return
    setCanPrev(emblaApi.canScrollPrev())
    setCanNext(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    const frame = requestAnimationFrame(update)
    emblaApi.on('select', update).on('reInit', update)
    return () => {
      cancelAnimationFrame(frame)
      emblaApi.off('select', update).off('reInit', update)
    }
  }, [emblaApi, update])

  const basis = columns === 4 ? 'lg:basis-1/4' : 'lg:basis-1/5'

  return (
    <div
      className="relative w-full"
      role="region"
      aria-roledescription="carousel"
      aria-label={stegaClean(label)}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') emblaApi?.scrollPrev()
        if (e.key === 'ArrowRight') emblaApi?.scrollNext()
      }}
    >
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="-ml-8 flex">
          {Children.map(children, (child) => (
            <div
              role="group"
              aria-roledescription="slide"
              className={`min-w-0 shrink-0 grow-0 basis-1/2 pl-8 md:basis-1/3 ${basis}`}
            >
              {child}
            </div>
          ))}
        </div>
      </div>
      <button
        type="button"
        className={`${arrowClass} -left-8`}
        disabled={!canPrev}
        onClick={() => emblaApi?.scrollPrev()}
      >
        <ArrowLeft className="size-4" aria-hidden />
        <span className="sr-only">Previous slide</span>
      </button>
      <button
        type="button"
        className={`${arrowClass} -right-8`}
        disabled={!canNext}
        onClick={() => emblaApi?.scrollNext()}
      >
        <ArrowRight className="size-4" aria-hidden />
        <span className="sr-only">Next slide</span>
      </button>
    </div>
  )
}
