'use client'

import {useEffect, useState, type ReactNode} from 'react'
import {Mail, Menu, Search, ShoppingBag} from 'lucide-react'
import {DesktopNav} from './DesktopNav'
import {MobileNav} from './MobileNav'
import type {NavItem} from '@/sanity/types-helpers'

type Props = {items: NavItem[]; logo: ReactNode; mobileLogo: ReactNode}

const iconButton = 'rounded transition-transform hover:opacity-70 active:scale-90'
const iconProps = {size: 26, strokeWidth: 1, className: 'text-ash', 'aria-hidden': true} as const

export function HeaderClient({items, logo, mobileLogo}: Props) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, {passive: true})
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const height = scrolled ? 'h-navbar-scrolled' : 'h-navbar'

  return (
    <header className="sticky top-0 z-50 bg-linen transition-all duration-300 ease-in-out">
      <div className="page-container">
        <nav
          aria-label="Main navigation"
          className={`flex flex-row items-center justify-between transition-all duration-300 ease-in-out ${height}`}
        >
          {logo}
          <div className="hidden flex-1 items-center justify-center md:flex">
            <DesktopNav items={items} scrolled={scrolled} />
          </div>
          <div className="flex items-center gap-6">
            <button type="button" className={iconButton} aria-label="Search">
              <Search {...iconProps} />
            </button>
            <button type="button" className={iconButton} aria-label="Open shopping cart">
              <ShoppingBag {...iconProps} />
            </button>
            <button type="button" className={iconButton} aria-label="Open enquiry form">
              <Mail {...iconProps} />
            </button>
            <button
              type="button"
              className={`${iconButton} md:hidden`}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
            >
              <Menu {...iconProps} />
            </button>
          </div>
        </nav>
      </div>
      <MobileNav items={items} logo={mobileLogo} open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  )
}
