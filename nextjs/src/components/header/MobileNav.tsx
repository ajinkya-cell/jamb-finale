'use client'

import {useEffect, useState, type ReactNode} from 'react'
import {Plus, X} from 'lucide-react'
import {SanityLink} from '../SanityLink'
import type {NavItem} from '@/sanity/types-helpers'

type Props = {items: NavItem[]; logo: ReactNode; open: boolean; onClose: () => void}

/** Slide-in drawer with an accordion per navigation item (mobile only). */
export function MobileNav({items, logo, open, onClose}: Props) {
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60] md:hidden" role="dialog" aria-modal="true" aria-label="Menu">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 w-full overflow-y-auto bg-stone p-0 sm:w-3/4 sm:max-w-sm">
        <div className="flex items-center justify-center gap-4 bg-linen px-5 py-4">{logo}</div>
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100"
        >
          <X className="size-6 stroke-1" aria-hidden />
          <span className="sr-only">Close</span>
        </button>
        <ul className="my-4 w-full divide-y divide-ash px-5">
          {items.map((item) => {
            const isOpen = expanded === item._key
            const columns = item.columns?.filter((c) => c.links?.length) ?? []
            if (!columns.length) {
              return (
                <li key={item._key} className="py-4 text-sm font-medium">
                  <SanityLink link={item.link} onClick={onClose}>
                    {item.label}
                  </SanityLink>
                </li>
              )
            }
            return (
              <li key={item._key}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setExpanded(isOpen ? null : item._key)}
                  className="flex w-full items-center justify-between py-4 text-left text-sm font-medium"
                >
                  {item.label}
                  <Plus
                    className={`size-4 shrink-0 text-zinc-500 transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`}
                    aria-hidden
                  />
                </button>
                {isOpen && (
                  <div className="mt-2 space-y-4 pb-4">
                    {item.link?.href && (
                      <SanityLink
                        link={item.link}
                        onClick={onClose}
                        className="mb-4 block text-sm font-medium text-gray-800 hover:underline"
                      >
                        View all {item.label}
                      </SanityLink>
                    )}
                    {columns.map((column) => (
                      <div key={column._key}>
                        {column.heading && (
                          <p className="mb-2 text-sm font-medium text-gray-800">{column.heading}</p>
                        )}
                        <ul className="mt-2 space-y-2">
                          {column.links?.map((cta) => (
                            <li key={cta._key}>
                              <SanityLink
                                link={cta.link}
                                onClick={onClose}
                                className="block py-1 text-sm text-zinc-500 transition-colors hover:text-foreground"
                              >
                                {cta.label}
                              </SanityLink>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
