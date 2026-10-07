import {defineQuery} from 'next-sanity'

/** Resolves a `link` object to an href, whatever document type it targets. */
const linkFields = /* groq */ `
  "href": select(
    linkType == "external" => externalUrl,
    internalLink->{
      "path": select(
        _type == "homePage" => "/",
        _type == "page" => "/" + slug.current,
        _type == "category" => slug.current,
        _type == "product" => category->slug.current + "/" + slug.current
      )
    }.path
  ),
  openInNewTab
`

const ctaFields = /* groq */ `_key, label, link{ ${linkFields} }`

const imageFields = /* groq */ `
  asset->{ _id, url, metadata{ lqip, dimensions{ width, height, aspectRatio } } },
  alt,
  crop,
  hotspot
`

const productCardFields = /* groq */ `
  _id,
  name,
  "href": category->slug.current + "/" + slug.current,
  "image": images[0]{ ${imageFields} },
  "category": category->{ name, "href": slug.current }
`

const richTextFields = /* groq */ `
  ...,
  markDefs[]{ ..., _type == "link" => { _key, _type, link{ ${linkFields} } } }
`

const navColumnFields = /* groq */ `
  _key,
  heading,
  headingLink{ ${linkFields} },
  links[]{ ${ctaFields} }
`

export const HOME_PAGE_QUERY = defineQuery(/* groq */ `
  *[_id == "homePage"][0]{
    _id,
    title,
    pageBuilder[]{
      _key,
      _type,
      tone,
      _type == "heroSection" => {
        heading,
        image{ ${imageFields} },
        quickLinks[]{ ${ctaFields} }
      },
      _type == "featureSection" => {
        eyebrow,
        title,
        body[]{ ${richTextFields} },
        actions[]{ ${ctaFields} },
        image{ ${imageFields} },
        imagePosition
      },
      _type == "productRail" => {
        title,
        "titleHref": titleLink->slug.current,
        display,
        "products": select(
          source == "category" => *[_type == "product" && category._ref == ^.category._ref]
            | order(publishedAt desc)[0...40]{ ${productCardFields} },
          products[]->{ ${productCardFields} }
        ),
        limit,
        source
      },
      _type == "videoSection" => {
        title,
        url,
        poster{ ${imageFields} }
      }
    }
  }
`)

export const HOME_SEO_QUERY = defineQuery(/* groq */ `
  {
    "home": *[_id == "homePage"][0]{ title, seo{ title, description, noIndex, image{ asset->{ url } } } },
    "settings": *[_id == "settings"][0]{ siteTitle, siteDescription }
  }{
    "title": coalesce(home.seo.title, settings.siteTitle, home.title),
    "description": coalesce(home.seo.description, settings.siteDescription),
    "image": home.seo.image.asset.url,
    "noIndex": home.seo.noIndex == true
  }
`)

export const SITE_QUERY = defineQuery(/* groq */ `
  {
    "settings": *[_id == "settings"][0]{
      siteTitle,
      logo{ asset->{ _id, url, metadata{ dimensions{ width, height } } }, alt },
      phone,
      email,
      address,
      socialLinks[]{ _key, platform, url }
    },
    "navigation": *[_id == "navigation"][0]{
      items[]{
        _key,
        label,
        link{ ${linkFields} },
        columns[]{ ${navColumnFields} }
      }
    },
    "footer": *[_id == "footer"][0]{
      newsletter{ heading, body, buttonLabel, consent[]{ ${richTextFields} } },
      columns[]{ _key, groups[]{ ${navColumnFields} } }
    }
  }
`)
