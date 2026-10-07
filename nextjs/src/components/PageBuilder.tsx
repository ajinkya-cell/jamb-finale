import {FeatureSection} from './blocks/FeatureSection'
import {HeroSection} from './blocks/HeroSection'
import {ProductRail} from './blocks/ProductRail'
import {VideoSection} from './blocks/VideoSection'
import type {PageBuilderBlock} from '@/sanity/types-helpers'

export function PageBuilder({blocks}: {blocks: PageBuilderBlock[] | null | undefined}) {
  if (!Array.isArray(blocks)) return null
  return (
    <>
      {blocks.map((block) => {
        switch (block._type) {
          case 'heroSection':
            return <HeroSection key={block._key} block={block} />
          case 'featureSection':
            return <FeatureSection key={block._key} block={block} />
          case 'productRail':
            return <ProductRail key={block._key} block={block} />
          case 'videoSection':
            return <VideoSection key={block._key} block={block} />
          default:
            return null
        }
      })}
    </>
  )
}
