import {PortableText, type PortableTextComponents, type PortableTextBlock} from 'next-sanity'
import {SanityLink} from './SanityLink'
import type {LinkValue} from '@/sanity/types-helpers'

const components: PortableTextComponents = {
  marks: {
    link: ({children, value}) => (
      <SanityLink link={(value as {link?: LinkValue})?.link}>{children}</SanityLink>
    ),
  },
}

export function RichText({value}: {value: PortableTextBlock[] | null | undefined}) {
  if (!Array.isArray(value)) return null
  return <PortableText value={value} components={components} />
}
