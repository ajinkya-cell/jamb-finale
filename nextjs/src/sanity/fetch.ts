import {cachedSanity, PUBLISHED, type DynamicFetchOptions} from './live'
import {HOME_PAGE_QUERY, HOME_SEO_QUERY, SITE_QUERY} from './queries'
import type {HOME_PAGE_QUERY_RESULT, SITE_QUERY_RESULT} from './types'

// In draft mode, strings carry invisible stega markers for click-to-edit, which
// TypeGen brands as `StegaString`. Components render them as-is and run
// `stegaClean` before comparing any value, so the plain result types are used.

export async function getHomePage(options: DynamicFetchOptions) {
  const {data} = await cachedSanity({query: HOME_PAGE_QUERY, ...options})
  return data as HOME_PAGE_QUERY_RESULT
}

/** Metadata is never shown in the preview overlay, so it is always clean, published content. */
export async function getHomeSeo() {
  const {data} = await cachedSanity({query: HOME_SEO_QUERY, ...PUBLISHED})
  return data
}

export async function getSite(options: DynamicFetchOptions) {
  const {data} = await cachedSanity({query: SITE_QUERY, ...options})
  return data as SITE_QUERY_RESULT
}
