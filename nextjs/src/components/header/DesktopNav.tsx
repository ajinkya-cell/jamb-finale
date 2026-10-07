'use client'

import {Fragment, useEffect, useRef, useState} from 'react'
import {SanityLink} from '../SanityLink'
import type {NavColumn, NavItem} from '@/sanity/types-helpers'

const LINKS_PER_LIST = 6

function chunk<T>(items: T[], size: number) {
  const out: T[][] = []
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size))
  return out
}

function MenuColumn({column}: {column: NavColumn}) {
  const lists = chunk(column.links ?? [], LINKS_PER_LIST)
  if (!lists.length) return null
  return (
    <div className={`group ${lists.length > 1 ? 'min-w-[400px]' : 'min-w-[300px]'}`}>
      {column.heading && (
        <h3 className="mb-[18px] border-b border-ash pb-5 text-base leading-[18px] font-medium text-ash transition-colors group-hover:text-black">
          <SanityLink link={column.headingLink}>{column.heading}</SanityLink>
        </h3>
      )}
      <div className="flex gap-8">
        {lists.map((links, i) => (
          <ul key={i} className="w-full">
            {links.map((cta) => (
              <li key={cta._key} className="py-1">
                <SanityLink
                  link={cta.link}
                  className="block text-base leading-[18px] text-ash transition-colors hover:text-gray-900"
                >
                  {cta.label}
                </SanityLink>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  )
}

/** Centered menu with "|" separators and a full-width grey mega menu on hover. */
export function DesktopNav({items, scrolled}: {items: NavItem[]; scrolled: boolean}) {
  const [openKey, setOpenKey] = useState<string | null>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const open = items.find((item) => item._key === openKey)

  const show = (key: string | null) => {
    clearTimeout(closeTimer.current)
    setOpenKey(key)
  }
  const scheduleClose = () => {
    clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setOpenKey(null), 150)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpenKey(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const itemClass = (active: boolean) =>
    `block px-3 py-2 text-sm transition-colors hover:text-black lg:text-base ${active ? 'text-black' : 'text-ash'}`

  return (
    <div onMouseLeave={scheduleClose}>
      <ul className="flex list-none items-center justify-center gap-0">
        {items.map((item, index) => {
          const hasMenu = !!item.columns?.some((c) => c.links?.length)
          const active = openKey === item._key
          return (
            <Fragment key={item._key}>
              <li onMouseEnter={() => show(hasMenu ? item._key : null)}>
                {item.link?.href ? (
                  <SanityLink
                    link={item.link}
                    className={itemClass(active)}
                    aria-haspopup={hasMenu || undefined}
                    aria-expanded={hasMenu ? active : undefined}
                    onFocus={() => show(hasMenu ? item._key : null)}
                  >
                    {item.label}
                  </SanityLink>
                ) : (
                  <button
                    type="button"
                    className={`${itemClass(active)} cursor-pointer`}
                    aria-haspopup="true"
                    aria-expanded={active}
                    onClick={() => show(active ? null : item._key)}
                    onFocus={() => show(item._key)}
                  >
                    {item.label}
                  </button>
                )}
              </li>
              {index < items.length - 1 && (
                <li aria-hidden="true" className="text-ash">
                  |
                </li>
              )}
            </Fragment>
          )
        })}
      </ul>

      {open?.columns?.length ? (
        <div
          role="menu"
          aria-label={`${open.label} menu`}
          onMouseEnter={() => show(open._key)}
          className={`fixed left-0 z-50 w-screen transition-all duration-300 ease-in-out ${
            scrolled ? 'top-[65px]' : 'top-[90px]'
          }`}
        >
          <div className="w-full border border-zinc-200 bg-stone">
            <div className="flex w-screen flex-row gap-14 p-10">
              <div className="mx-auto flex w-fit gap-14">
                {open.columns.map((column) => (
                  <MenuColumn key={column._key} column={column} />
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
