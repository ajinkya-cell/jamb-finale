import {getSite} from '@/sanity/fetch'
import {HeaderClient} from './HeaderClient'
import {Logo} from './Logo'

export async function Header() {
  const {settings, navigation} = await getSite()
  if (!settings) return null

  return (
    <HeaderClient items={navigation?.items ?? []} logo={<Logo settings={settings} />} mobileLogo={<Logo settings={settings} className="h-8" />} />
  )
}
