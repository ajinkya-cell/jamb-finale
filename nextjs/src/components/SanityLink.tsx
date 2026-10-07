import Link from 'next/link'
import type {ComponentProps, ReactNode} from 'react'
import type {LinkValue} from '@/sanity/types-helpers'

type Props = Omit<ComponentProps<'a'>, 'href'> & {
  link: LinkValue | null | undefined
  children: ReactNode
}

/** Renders a resolved Sanity `link`: next/link internally, <a> for external URLs. */
export function SanityLink({link, children, ...rest}: Props) {
  const href = link?.href
  if (!href) return <span className={rest.className}>{children}</span>

  const newTab = link.openInNewTab ? {target: '_blank', rel: 'noopener noreferrer'} : {}
  if (/^(https?:|mailto:|tel:)/.test(href)) {
    return (
      <a href={href} {...newTab} {...rest}>
        {children}
      </a>
    )
  }
  return (
    <Link href={href} {...newTab} {...rest}>
      {children}
    </Link>
  )
}
