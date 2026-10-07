import Link from 'next/link'
import type {Settings} from '@/sanity/types-helpers'

export function Logo({settings, className = 'h-[45px] max-md:h-9'}: {settings: Settings; className?: string}) {
  const logo = settings.logo
  return (
    <Link href="/" aria-label={settings.siteTitle ?? 'Home'} className="block shrink-0">
      {logo?.asset?.url ? (
        // eslint-disable-next-line @next/next/no-img-element -- SVG logo from Sanity
        <img
          src={logo.asset.url}
          alt={logo.alt ?? 'Jamb'}
          width={logo.asset.metadata?.dimensions?.width}
          height={logo.asset.metadata?.dimensions?.height}
          className={`w-auto transition-all duration-300 ease-in-out ${className}`}
        />
      ) : (
        <span className="text-3xl">Jamb</span>
      )}
    </Link>
  )
}
