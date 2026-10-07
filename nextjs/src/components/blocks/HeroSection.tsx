import {SanityImage} from '../SanityImage'
import {toneClass} from '@/lib/tone'
import type {HeroSectionBlock} from '@/sanity/types-helpers'

export function HeroSection({block}: {block: HeroSectionBlock}) {
  return (
    <section id="hero" className={toneClass(block.tone)}>
      {block.heading && <h1 className="sr-only">{block.heading}</h1>}
      <div className="page-container">
        <div className="flex w-full justify-center">
          <SanityImage
            image={block.image}
            width={1425}
            aspectRatio={1425 / 900}
            sizes="100vw"
            className="h-auto w-full object-cover object-center"
            priority
          />
        </div>
      </div>
    </section>
  )
}
