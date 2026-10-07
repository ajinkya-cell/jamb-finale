import {SanityLink} from './SanityLink'
import type {Cta} from '@/sanity/types-helpers'

/** Jamb's outlined button: grey border and text, fills grey on hover. */
export function CtaButton({cta}: {cta: Cta}) {
  return (
    <SanityLink
      link={cta.link}
      className="inline-flex h-10 w-fit shrink-0 items-center justify-center gap-2 border border-slate bg-transparent px-6 text-sm font-medium whitespace-nowrap text-slate transition-all hover:bg-slate hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate"
    >
      {cta.label}
    </SanityLink>
  )
}
