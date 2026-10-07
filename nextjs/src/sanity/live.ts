import {cookies, draftMode} from 'next/headers'
import {
  defineLive,
  resolvePerspectiveFromCookies,
  type LivePerspective,
  type StrictDefinedFetchType,
} from 'next-sanity/live'
import {client} from './client'

const token = process.env.SANITY_API_READ_TOKEN

/**
 * Sanity Live: cached reads that revalidate the moment content is published,
 * and draft content with click-to-edit overlays inside the Presentation tool.
 */
export const {sanityFetch, SanityLive} = defineLive({
  client,
  serverToken: token,
  browserToken: token,
  strict: true,
})

/** The app's one `'use cache'` boundary; `sanityFetch` adds its own cache tags. */
export const cachedSanity: StrictDefinedFetchType = async (options) => {
  'use cache'
  return sanityFetch(options)
}

export interface DynamicFetchOptions {
  perspective: LivePerspective
  stega: boolean
}

/** The public site gets published content without stega encoding. */
export const PUBLISHED: DynamicFetchOptions = {perspective: 'published', stega: false}

/** Resolves draft-mode options. Must be called outside `'use cache'` boundaries. */
export async function getDynamicFetchOptions(): Promise<DynamicFetchOptions> {
  const {isEnabled} = await draftMode()
  if (!isEnabled) return PUBLISHED
  const perspective = await resolvePerspectiveFromCookies({cookies: await cookies()})
  return {perspective: perspective ?? 'drafts', stega: true}
}
