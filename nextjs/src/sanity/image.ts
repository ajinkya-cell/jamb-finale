import {createImageUrlBuilder, type SanityImageSource} from '@sanity/image-url'
import {dataset, projectId} from './env'

const builder = createImageUrlBuilder({projectId, dataset})

/** Respects the editor's crop and hotspot when both width and height are set. */
export const urlFor = (source: SanityImageSource) => builder.image(source).auto('format')
