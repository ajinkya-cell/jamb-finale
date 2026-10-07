/**
 * Seeds the dataset with the jamb.co.uk homepage content.
 *
 *   npx sanity exec scripts/seed.ts --with-user-token
 *
 * Idempotent: categories, products and pages are matched by their slug/path
 * and updated in place; singletons use their fixed IDs.
 */
import {randomUUID} from 'node:crypto'
import {readFileSync} from 'node:fs'
import {join} from 'node:path'
import {getCliClient} from 'sanity/cli'

type Href = string | null | undefined
type ImageRef = {id: string; crop?: Record<string, number>; hotspot?: Record<string, number>}
type LinkData = {label: string; href: string}
type Column = {heading: string | null; headingHref: string | null; links: LinkData[]}
type Product = {name: string; path: string; category: string; categoryName: string; image: ImageRef}
type Section =
  | {type: 'hero'; tone: string; image: ImageRef; links: LinkData[]}
  | {
      type: 'feature'
      tone: string
      eyebrow?: string
      title: string
      body: string[]
      image: ImageRef
      imagePosition: string
      actions: LinkData[]
    }
  | {type: 'rail'; tone: string; title: string; titleLink: Href; display: string; products: Product[]}
  | {type: 'video'; tone: string; url: string}

// `sanity exec` runs from the studio root.
const data = JSON.parse(readFileSync(join(process.cwd(), 'scripts/seed-data.json'), 'utf8')) as {
  settings: {siteTitle: string; siteDescription: string; logo: string}
  sections: Section[]
  navigation: {label: string; href: Href; columns: Column[]}[]
  footer: {
    phone: string
    address: string
    email: string
    social: {platform: string; url: string}[]
    newsletter: {heading: string; body: string; buttonLabel: string}
    columns: Column[][]
  }
}

const client = getCliClient({apiVersion: '2026-02-01'})
const SOURCE_CDN = 'https://cdn.sanity.io/images/vd3z2it9/production'
const CATEGORY_ROOTS = ['/fireplaces', '/lighting', '/furniture']

const key = () => randomUUID().replace(/-/g, '').slice(0, 12)
const lastSegment = (path: string) => path.split('/').filter(Boolean).pop() ?? ''
const isCategoryPath = (href: string) =>
  CATEGORY_ROOTS.some((root) => href === root || href.startsWith(`${root}/`))

/* ---------------------------------------------------------------- images */

const assetCache = new Map<string, string>()

async function uploadImage(sourceId: string): Promise<string> {
  const cached = assetCache.get(sourceId)
  if (cached) return cached
  // image-<hash>-<w>x<h>-<ext> → <hash>-<w>x<h>.<ext>
  const [, hash, dims, ext] = sourceId.match(/^image-([a-f0-9]+)-(\d+x\d+)-(\w+)$/) ?? []
  if (!hash) throw new Error(`Unexpected image id ${sourceId}`)
  const res = await fetch(`${SOURCE_CDN}/${hash}-${dims}.${ext}`)
  if (!res.ok) throw new Error(`Download failed for ${sourceId}: ${res.status}`)
  const buffer = Buffer.from(await res.arrayBuffer())
  const asset = await client.assets.upload('image', buffer, {filename: `${hash}.${ext}`})
  assetCache.set(sourceId, asset._id)
  return asset._id
}

async function uploadAll(ids: string[], concurrency = 6) {
  const queue = [...new Set(ids)]
  let done = 0
  await Promise.all(
    Array.from({length: concurrency}, async () => {
      for (let id = queue.shift(); id; id = queue.shift()) {
        await uploadImage(id)
        done++
        if (done % 10 === 0) console.log(`  uploaded ${done} images`)
      }
    }),
  )
}

function imageField(ref: ImageRef, alt: string) {
  return {
    _type: 'imageWithAlt',
    asset: {_type: 'reference', _ref: assetCache.get(ref.id)},
    alt,
    ...(ref.crop && {crop: {_type: 'sanity.imageCrop', ...ref.crop}}),
    ...(ref.hotspot && {
      hotspot: {_type: 'sanity.imageHotspot', width: 0.3, height: 0.3, ...ref.hotspot},
    }),
  }
}

/* ------------------------------------------------------- reference maps */

const categoryIds = new Map<string, string>() // path → _id
const pageIds = new Map<string, string>() // "/path" → _id
const productIds = new Map<string, string>() // full path → _id

async function loadExisting() {
  const existing = await client.fetch<{
    categories: {_id: string; path: string}[]
    pages: {_id: string; path: string}[]
    products: {_id: string; path: string}[]
  }>(`{
    "categories": *[_type == "category" && !(_id in path("drafts.**"))]{_id, "path": slug.current},
    "pages": *[_type == "page" && !(_id in path("drafts.**"))]{_id, "path": "/" + slug.current},
    "products": *[_type == "product" && !(_id in path("drafts.**"))]{_id, "path": category->slug.current + "/" + slug.current}
  }`)
  existing.categories.forEach((c) => categoryIds.set(c.path, c._id))
  existing.pages.forEach((p) => pageIds.set(p.path, p._id))
  existing.products.forEach((p) => productIds.set(p.path, p._id))
}

/* ------------------------------------------------------------ categories */

const categoryNames = new Map<string, string>()

function nameCategory(path: string, name: string | null | undefined) {
  if (name && !categoryNames.has(path)) categoryNames.set(path, name.trim())
}

function collectCategoryNames() {
  for (const section of data.sections) {
    if (section.type === 'rail') {
      section.products.forEach((p) => nameCategory(p.category, p.categoryName))
    }
  }
  nameCategory('/fireplaces', 'Fireplaces')
  nameCategory('/lighting', 'Lighting')
  nameCategory('/furniture', 'Furniture')
  nameCategory('/furniture/antiques', 'Antiques')
  nameCategory('/furniture/reproduction-furniture', 'Reproduction Furniture')
  nameCategory('/furniture/reproduction-furniture/seating', 'Seating')
  const fromLinks = (columns: Column[]) =>
    columns.forEach((col) => {
      if (col.headingHref && isCategoryPath(col.headingHref)) nameCategory(col.headingHref, col.heading)
      col.links.forEach((l) => isCategoryPath(l.href) && nameCategory(l.href, l.label))
    })
  data.navigation.forEach((item) => fromLinks(item.columns))
  data.footer.columns.forEach((cell) => fromLinks(cell))
  // Any ancestor path still unnamed gets a title-cased fallback.
  for (const path of [...categoryNames.keys()]) {
    const parts = path.split('/').filter(Boolean)
    for (let i = 1; i < parts.length; i++) {
      const ancestor = '/' + parts.slice(0, i).join('/')
      nameCategory(
        ancestor,
        parts[i - 1].replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      )
    }
  }
}

async function seedCategories() {
  const paths = [...categoryNames.keys()].sort(
    (a, b) => a.split('/').length - b.split('/').length || a.localeCompare(b),
  )
  for (const path of paths) {
    const parentPath = path.split('/').slice(0, -1).join('/')
    const _id = categoryIds.get(path) ?? randomUUID()
    categoryIds.set(path, _id)
    await client.createOrReplace({
      _id,
      _type: 'category',
      name: categoryNames.get(path),
      slug: {_type: 'slug', current: path},
      ...(parentPath && {parent: {_type: 'reference', _ref: categoryIds.get(parentPath)}}),
    })
  }
  console.log(`✓ ${paths.length} categories`)
}

/* ----------------------------------------------------------------- pages */

const pageTitles = new Map<string, string>()

function collectPage(href: Href, label: string | null | undefined) {
  if (!href || href === '/' || /^https?:|^mailto:/.test(href) || isCategoryPath(href)) return
  if (!pageTitles.has(href)) pageTitles.set(href, (label ?? lastSegment(href)).trim())
}

function collectPages() {
  for (const s of data.sections) {
    if (s.type === 'hero') s.links.forEach((l) => collectPage(l.href, l.label))
    if (s.type === 'feature') s.actions.forEach((l) => collectPage(l.href, l.label))
  }
  const fromColumns = (columns: Column[]) =>
    columns.forEach((c) => {
      collectPage(c.headingHref, c.heading)
      c.links.forEach((l) => collectPage(l.href, l.label))
    })
  data.navigation.forEach((item) => fromColumns(item.columns))
  data.footer.columns.forEach(fromColumns)
  collectPage('/privacy-notice', 'Privacy Policy')
  pageTitles.set('/journal', 'Journal')
}

async function seedPages() {
  const tx = client.transaction()
  for (const [path, title] of pageTitles) {
    const _id = pageIds.get(path) ?? randomUUID()
    pageIds.set(path, _id)
    tx.createOrReplace({_id, _type: 'page', title, slug: {_type: 'slug', current: path.slice(1)}})
  }
  await tx.commit()
  console.log(`✓ ${pageTitles.size} pages`)
}

/* -------------------------------------------------------------- products */

async function seedProducts() {
  const products = new Map<string, Product>()
  for (const s of data.sections) {
    if (s.type === 'rail') s.products.forEach((p) => !products.has(p.path) && products.set(p.path, p))
  }
  // Newest first, matching the order the rails show them in.
  const base = Date.now()
  const tx = client.transaction()
  ;[...products.values()].forEach((p, i) => {
    const _id = productIds.get(p.path) ?? randomUUID()
    productIds.set(p.path, _id)
    tx.createOrReplace({
      _id,
      _type: 'product',
      name: p.name,
      slug: {_type: 'slug', current: lastSegment(p.path)},
      category: {_type: 'reference', _ref: categoryIds.get(p.category)},
      images: [{_key: key(), ...imageField(p.image, p.name)}],
      publishedAt: new Date(base - i * 60_000).toISOString(),
    })
  })
  await tx.commit()
  console.log(`✓ ${products.size} products`)
}

/* ------------------------------------------------------------ singletons */

function link(href: string) {
  if (/^(https?:|mailto:|tel:)/.test(href)) {
    return {_type: 'link', linkType: 'external', externalUrl: href, openInNewTab: false}
  }
  const ref =
    href === '/' ? 'homePage' : (categoryIds.get(href) ?? pageIds.get(href) ?? productIds.get(href))
  if (!ref) throw new Error(`No document for link ${href}`)
  return {
    _type: 'link',
    linkType: 'internal',
    internalLink: {_type: 'reference', _ref: ref},
    openInNewTab: false,
  }
}

const cta = (l: LinkData) => ({_key: key(), _type: 'cta', label: l.label, link: link(l.href)})

const navColumn = (c: Column) => ({
  _key: key(),
  _type: 'navColumn',
  ...(c.heading && {heading: c.heading.trim()}),
  ...(c.heading && c.headingHref && {headingLink: link(c.headingHref)}),
  links: c.links.map(cta),
})

const paragraph = (text: string, markDefs: object[] = [], children?: object[]) => ({
  _key: key(),
  _type: 'block',
  style: 'normal',
  markDefs,
  children: children ?? [{_key: key(), _type: 'span', marks: [], text}],
})

function section(s: Section) {
  switch (s.type) {
    case 'hero':
      return {
        _key: key(),
        _type: 'heroSection',
        heading: 'Jamb: antique and reproduction fireplaces, lighting and furniture',
        image: imageField(s.image, 'A Jamb interior with an antique chimneypiece'),
        tone: s.tone,
      }
    case 'feature':
      return {
        _key: key(),
        _type: 'featureSection',
        ...(s.eyebrow && {eyebrow: s.eyebrow}),
        title: s.title,
        body: s.body.map((text) => paragraph(text)),
        actions: s.actions.map(cta),
        image: imageField(s.image, s.title),
        imagePosition: s.imagePosition,
        tone: s.tone,
      }
    case 'rail':
      return {
        _key: key(),
        _type: 'productRail',
        title: s.title,
        ...(s.titleLink && {titleLink: {_type: 'reference', _ref: categoryIds.get(s.titleLink)}}),
        source: 'manual',
        products: [...new Set(s.products.map((p) => productIds.get(p.path)))].map((ref) => ({
          _key: key(),
          _type: 'reference',
          _ref: ref,
        })),
        display: s.display,
        tone: s.tone,
      }
    case 'video':
      return {_key: key(), _type: 'videoSection', title: 'Jamb on YouTube', url: s.url, tone: s.tone}
  }
}

async function seedSingletons() {
  const logo = await uploadImage(data.settings.logo)
  const privacyKey = key()
  await client
    .transaction()
    .createOrReplace({
      _id: 'settings',
      _type: 'settings',
      siteTitle: data.settings.siteTitle,
      siteDescription: data.settings.siteDescription,
      logo: {_type: 'imageWithAlt', asset: {_type: 'reference', _ref: logo}, alt: 'Jamb'},
      phone: data.footer.phone,
      email: data.footer.email,
      address: data.footer.address,
      socialLinks: data.footer.social.map((s) => ({_key: key(), _type: 'socialLink', ...s})),
    })
    .createOrReplace({
      _id: 'navigation',
      _type: 'navigation',
      items: data.navigation.map((item) => ({
        _key: key(),
        _type: 'navItem',
        label: item.label,
        ...(item.href && {link: link(item.href)}),
        columns: item.columns.map(navColumn),
      })),
    })
    .createOrReplace({
      _id: 'footer',
      _type: 'footer',
      newsletter: {
        ...data.footer.newsletter,
        consent: [
          paragraph('', [{_key: privacyKey, _type: 'link', link: link('/privacy-notice')}], [
            {_key: key(), _type: 'span', marks: [], text: 'I agree to our '},
            {_key: key(), _type: 'span', marks: [privacyKey], text: 'Privacy Policy'},
          ]),
        ],
      },
      columns: data.footer.columns.map((groups) => ({
        _key: key(),
        _type: 'footerColumn',
        groups: groups.map(navColumn),
      })),
    })
    .createOrReplace({
      _id: 'homePage',
      _type: 'homePage',
      title: 'Home',
      pageBuilder: data.sections.map(section),
      seo: {
        _type: 'seo',
        title: data.settings.siteTitle,
        description: data.settings.siteDescription,
        noIndex: false,
      },
    })
    .commit()
  console.log('✓ settings, navigation, footer, homePage')
}

/* ------------------------------------------------------------------ main */

async function main() {
  const {projectId, dataset} = client.config()
  console.log(`Seeding ${projectId}/${dataset}`)
  await loadExisting()

  const imageIds = data.sections.flatMap((s) => {
    if (s.type === 'hero' || s.type === 'feature') return [s.image.id]
    if (s.type === 'rail') return s.products.map((p) => p.image.id)
    return []
  })
  console.log(`Uploading ${new Set(imageIds).size} images…`)
  await uploadAll(imageIds)

  collectCategoryNames()
  await seedCategories()
  collectPages()
  await seedPages()
  await seedProducts()
  await seedSingletons()
  console.log('Done.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
