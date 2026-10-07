import {createClient} from 'next-sanity'
import {apiVersion, dataset, projectId, studioUrl} from './env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
  // Click-to-edit overlays link back to this Studio (only used in draft mode).
  stega: {studioUrl},
})
