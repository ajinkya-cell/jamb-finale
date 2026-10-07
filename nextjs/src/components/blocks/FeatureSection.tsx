import {stegaClean, type PortableTextBlock} from 'next-sanity'
import {CtaButton} from '../CtaButton'
import {RichText} from '../RichText'
import {SanityImage} from '../SanityImage'
import {toneClass} from '@/lib/tone'
import type {FeatureSectionBlock} from '@/sanity/types-helpers'

export function FeatureSection({block}: {block: FeatureSectionBlock}) {
  const imageFirst = stegaClean(block.imagePosition) === 'left'

  const text = (
    <div className="mx-auto flex max-w-lg flex-col justify-center">
      {block.eyebrow && (
        <p className="mb-6 text-center text-base text-black uppercase">{block.eyebrow}</p>
      )}
      <h2
        className={`text-center text-3xl font-medium text-balance md:text-[34px] ${
          block.eyebrow ? 'mb-8' : 'mb-[53px]'
        }`}
      >
        {block.title}
      </h2>
      <div className="prose mb-6 max-w-none text-left prose-zinc prose-p:text-base max-md:prose-p:text-sm">
        <RichText value={block.body as PortableTextBlock[]} />
      </div>
      {block.actions?.length ? (
        <div className="flex flex-col items-center gap-3">
          {block.actions.map((cta) => (
            <CtaButton key={cta._key} cta={cta} />
          ))}
        </div>
      ) : null}
    </div>
  )

  const image = (
    <div className="flex items-center justify-center">
      <div className="relative w-full md:mx-8 lg:mx-12 xl:mx-20">
        <SanityImage
          image={block.image}
          width={736}
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="h-auto w-full object-cover"
        />
      </div>
    </div>
  )

  return (
    <section className={toneClass(block.tone)}>
      <div className="page-container py-pagebuilder">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          {imageFirst ? (
            <>
              {image}
              {text}
            </>
          ) : (
            <>
              <div className="max-lg:order-2">{text}</div>
              <div className="max-lg:order-1">{image}</div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
