import {cacheLife, cacheTag} from 'next/cache'
import {client} from './client'
import {HOME_PAGE_QUERY, HOME_SEO_QUERY, SITE_QUERY} from './queries'

/** Every Sanity read shares one tag so the webhook can revalidate them together. */
export const SANITY_CACHE_TAG = 'sanity'

export async function getHomePage() {
  'use cache'
  cacheLife('minutes')
  cacheTag(SANITY_CACHE_TAG)
  return client.fetch(HOME_PAGE_QUERY)
}

export async function getHomeSeo() {
  'use cache'
  cacheLife('minutes')
  cacheTag(SANITY_CACHE_TAG)
  return client.fetch(HOME_SEO_QUERY)
}

export async function getSite() {
  'use cache'
  cacheLife('minutes')
  cacheTag(SANITY_CACHE_TAG)
  return client.fetch(SITE_QUERY)
}
