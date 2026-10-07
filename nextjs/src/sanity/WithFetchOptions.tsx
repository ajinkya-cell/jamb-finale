import {draftMode} from 'next/headers'
import {Suspense, type ReactNode} from 'react'
import {getDynamicFetchOptions, PUBLISHED, type DynamicFetchOptions} from './live'

type Render = (options: DynamicFetchOptions) => ReactNode

/**
 * Renders published content statically for the public site. In draft mode
 * (the Presentation tool), it resolves the preview perspective from cookies
 * inside a Suspense boundary, as Cache Components requires for dynamic reads.
 */
export async function WithFetchOptions({children}: {children: Render}) {
  const {isEnabled} = await draftMode()
  if (!isEnabled) return children(PUBLISHED)
  return (
    <Suspense>
      <DraftOptions>{children}</DraftOptions>
    </Suspense>
  )
}

async function DraftOptions({children}: {children: Render}) {
  return children(await getDynamicFetchOptions())
}
