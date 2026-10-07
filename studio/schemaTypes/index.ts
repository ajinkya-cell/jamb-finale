import {heroSectionType} from './blocks/heroSection'
import {featureSectionType} from './blocks/featureSection'
import {productRailType} from './blocks/productRail'
import {videoSectionType} from './blocks/videoSection'
import {categoryType} from './documents/category'
import {pageType} from './documents/page'
import {productType} from './documents/product'
import {ctaType} from './objects/cta'
import {footerColumnType} from './objects/footerColumn'
import {imageWithAltType} from './objects/imageWithAlt'
import {linkType} from './objects/link'
import {navColumnType} from './objects/navColumn'
import {navItemType} from './objects/navItem'
import {richTextType} from './objects/richText'
import {seoType} from './objects/seo'
import {pageBuilderType} from './pageBuilder'
import {footerType} from './singletons/footer'
import {homePageType} from './singletons/homePage'
import {navigationType} from './singletons/navigation'
import {settingsType} from './singletons/settings'

export const schemaTypes = [
  // Singletons
  homePageType,
  settingsType,
  navigationType,
  footerType,
  // Documents
  pageType,
  productType,
  categoryType,
  // Page builder
  pageBuilderType,
  heroSectionType,
  featureSectionType,
  productRailType,
  videoSectionType,
  // Objects
  linkType,
  ctaType,
  imageWithAltType,
  richTextType,
  seoType,
  navItemType,
  navColumnType,
  footerColumnType,
]

/** Document types with a fixed _id, managed through the desk structure. */
export const SINGLETON_TYPES = new Set(['homePage', 'settings', 'navigation', 'footer'])
