import {stegaClean} from 'next-sanity'

const TONE_CLASSES = {
  warm: 'bg-linen',
  grey: 'bg-stone',
  taupe: 'bg-taupe',
} as const

/** Maps the semantic `tone` field to Jamb's palette. */
export function toneClass(tone: string | null | undefined) {
  const value = stegaClean(tone) as keyof typeof TONE_CLASSES | undefined
  return (value && TONE_CLASSES[value]) || TONE_CLASSES.warm
}
