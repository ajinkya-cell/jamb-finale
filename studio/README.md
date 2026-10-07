# Jamb — Sanity Studio

Content model and Studio for a replica of the [jamb.co.uk](https://www.jamb.co.uk/) homepage, built so the whole site can be composed in Sanity. The Next.js frontend lives in [`../nextjs`](../nextjs).

## Content model at a glance

```
Singletons (fixed IDs, managed in Structure)
├── homePage        title · pageBuilder[] · seo
├── navigation      items[] navItem → columns[] navColumn → links[] cta
├── footer          newsletter{…} · columns[] footerColumn → groups[] navColumn
└── settings        siteTitle · siteDescription · logo · phone · email · address · socialLinks[]

Documents
├── page            title · slug · pageBuilder[] · seo        (every other page reuses the builder)
├── product         name · slug · category → · images[] · publishedAt
└── category        name · parent → · slug (full path, e.g. /fireplaces/reproduction-fireplaces/marble)

Page-builder blocks (pageBuilder[])
├── heroSection     heading (sr-only h1) · image · tone
├── featureSection  eyebrow · title · body (richText) · actions[] cta · image · imagePosition · tone
├── productRail     title · titleLink → category · source (manual | category) · products[] → | category → + limit · display · tone
└── videoSection    title · url (YouTube) · poster · tone

Shared objects
link (internal reference | external URL) · cta {label, link} · imageWithAlt · richText · seo · navItem · navColumn · footerColumn
```

The homepage is: hero → Fireplaces feature → *Our latest chimneypieces* rail → Lighting feature → two lighting rails → Furniture feature → furniture rail → video → Journal feature.

## Design decisions

Jamb's own site also runs on Sanity, and its page data shows the schema it uses. We reproduce the same **content** but model it more strictly, following Sanity's schema guidance.

| Jamb's schema | This schema | Why |
| --- | --- | --- |
| `sideBySide`, `rail`, `youtubeVideo` | `featureSection`, `productRail`, `videoSection` | Name things by what they are, not how they look: the names survive a redesign. |
| Colour picker (`backgroundColor` hex) on every block | `tone`: `warm` · `grey` · `taupe` | Editors choose from the brand palette; the frontend maps tones to colours. No off-brand hex values. |
| `spacerBlock`, `gap`, `imageStyle`, `railColumns` | Removed | Spacing and column counts are presentation and belong in the frontend. Rails show 4 or 5 cards depending on image orientation, read from asset metadata. |
| `isCarousel: true` | `display`: `carousel` · `grid` (radio) | A list instead of a boolean leaves room to add more display types later. |
| `layout: "imageRight"` | `imagePosition`: `left` · `right` | The field describes data (where the image goes), and the frontend cleans it with `stegaClean`. |
| Links stored as path strings (`href: "/fireplaces"`) | `link` object: a **reference** to a page, category or product, or a validated external URL | Links can't break when a slug changes, and references keep content connected. |
| Hand-picked products only | `source`: hand-picked, or *latest from a category* (conditional fields) | Uses the show/hide pattern: only the fields that apply are visible, and validation follows the choice. |
| Hero `links` (stored but never displayed) | Removed, with a migration | A field with no effect confuses editors. `migrations/remove-hero-quick-links` removed the existing data with `unset()`. |
| No page `<h1>` | `heroSection.heading` rendered as a visually hidden `<h1>` | Accessibility and SEO. Heading *levels* are chosen in the frontend, never stored in the schema. |

### Other rules applied

- **Strict syntax:** `defineType`, `defineField` and `defineArrayMember` everywhere.
- **Icons and previews:** every type has an icon, imported from its own `@sanity/icons/*` subpath, and a preview with a title, a subtitle naming the block, and an image or icon.
  - Previews read a few array items instead of whole arrays, per Sanity's guidance. A product rail reads each slot's `_id`, which comes straight off the reference with no fetch, to show an exact count such as "Product rail · 29 products".
- **References vs objects:**
  - Products, categories and pages are documents, so they can be shared and edited on their own.
  - Blocks, buttons, links and SEO are objects that belong to the page they're on.
- **Singletons** (`homePage`, `settings`, `navigation`, `footer`) are enforced in `structure/` and `sanity.config.ts`, not in the schema:
  - they have fixed IDs and appear first in the sidebar
  - they're left out of generic lists and "create new"
  - their document actions are limited to publish, discard and restore
- **Images:** `imageWithAlt` always enables hotspot and crop, and missing alt text raises a warning.
- **Validation:**
  - required fields
  - YouTube URL format
  - URL schemes
  - slug formats, for page paths and for category paths
  - unique products in a rail, plus a warning above 40
  - no loops in the category tree (a category can't sit inside its own descendant)
  - each nav group needs a heading or at least one link
- **Page builder:**
  - the same `pageBuilder` array is used by `homePage` and `page`
  - the "Add section" menu is grouped and has a thumbnail grid (`static/block-previews`)
  - every block uses `_key` for React keys and Visual Editing
- **Generated IDs:** content documents get random IDs, and relationships are real references. Only singletons have fixed IDs.

## Working on it

```bash
pnpm install
pnpm dev                    # Studio on http://localhost:3333 (also regenerates frontend types)
npx sanity schema validate  # schema check
npx sanity documents validate -y   # validate every document in the dataset
```

- **Types:** `typegen` in `sanity.cli.ts` writes `../nextjs/src/sanity/types.ts` from the frontend's `defineQuery` GROQ queries. It runs automatically during `sanity dev` and `sanity build`, or manually with `npx sanity schema extract --enforce-required-fields --force && npx sanity typegen generate`.
- **Seeding:** `npx sanity exec scripts/seed.ts --with-user-token` recreates the homepage content from `scripts/seed-data.json`, a snapshot of jamb.co.uk. It's safe to re-run, because documents are matched by slug or path and updated in place.
- **Migrations:** `npx sanity migration list`. Runs are dry runs unless `--no-dry-run` is passed.
- **Deploying:** `npx sanity deploy` publishes the Studio and the schema.

## Layout

```
schemaTypes/
  blocks/        page-builder blocks
  documents/     page, product, category
  singletons/    homePage, settings, navigation, footer
  objects/       link, cta, imageWithAlt, richText, seo, navItem, navColumn, footerColumn
  shared/        reusable fields (tone)
  pageBuilder.ts the block array shared by pages
structure/       desk structure (singletons first, catalogue grouped)
migrations/      content migrations
scripts/         seed script and data
static/          insert-menu block thumbnails
```
