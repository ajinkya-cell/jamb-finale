import {getSite} from '@/sanity/fetch'
import type {DynamicFetchOptions} from '@/sanity/live'
import {WithFetchOptions} from '@/sanity/WithFetchOptions'
import {HeaderClient} from './HeaderClient'
import {Logo} from './Logo'

export function Header() {
  return <WithFetchOptions>{(options) => <HeaderContent options={options} />}</WithFetchOptions>
}

async function HeaderContent({options}: {options: DynamicFetchOptions}) {
  const {settings, navigation} = await getSite(options)
  if (!settings) return null

  return (
    <HeaderClient items={navigation?.items ?? []} logo={<Logo settings={settings} />} mobileLogo={<Logo settings={settings} className="h-8" />} />
  )
}
