import type {HOME_PAGE_QUERY_RESULT, SITE_QUERY_RESULT} from './types'

export type PageBuilderBlock = NonNullable<NonNullable<HOME_PAGE_QUERY_RESULT>['pageBuilder']>[number]
export type BlockOf<T extends PageBuilderBlock['_type']> = Extract<PageBuilderBlock, {_type: T}>

export type HeroSectionBlock = BlockOf<'heroSection'>
export type FeatureSectionBlock = BlockOf<'featureSection'>
export type ProductRailBlock = BlockOf<'productRail'>
export type VideoSectionBlock = BlockOf<'videoSection'>

export type ProductCard = NonNullable<ProductRailBlock['products']>[number]
export type SanityImageValue = FeatureSectionBlock['image']
export type LinkValue = {href: string | null; openInNewTab: boolean | null}
export type Cta = {_key: string; label: string; link: LinkValue}

export type SiteData = SITE_QUERY_RESULT
export type NavItem = NonNullable<NonNullable<SiteData['navigation']>['items']>[number]
export type NavColumn = NonNullable<NavItem['columns']>[number]
export type Settings = NonNullable<SiteData['settings']>
