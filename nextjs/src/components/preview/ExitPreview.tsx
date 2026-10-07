'use client'

import {useIsPresentationTool} from 'next-sanity/hooks'

/** Shown when draft mode is on outside the Studio, so a stray preview cookie can be cleared. */
export function ExitPreview() {
  // `null` while detecting, `true` inside the Presentation iframe.
  if (useIsPresentationTool() !== false) return null
  return (
    <a
      href="/api/draft-mode/disable"
      className="fixed right-4 bottom-4 z-[100] bg-black px-4 py-2 text-sm font-medium text-white shadow-lg"
    >
      Exit preview
    </a>
  )
}
