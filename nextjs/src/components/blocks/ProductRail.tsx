import Link from 'next/link'
import {stegaClean} from 'next-sanity'
import {ProductCarousel} from '../ProductCarousel'
import {SanityImage} from '../SanityImage'
import {toneClass} from '@/lib/tone'
import type {ProductCard as ProductCardData, ProductRailBlock} from '@/sanity/types-helpers'

/** Landscape products (chimneypieces) show 4 per row on desktop, portrait ones 5. */
function columnsFor(products: ProductCardData[]): 4 | 5 {
  const ratio = products[0]?.image?.asset?.metadata?.dimensions?.aspectRatio ?? 1
  return ratio > 1 ? 4 : 5
}

function ProductCard({product}: {product: ProductCardData}) {
  return (
    <div className="flex flex-col overflow-hidden">
      <Link href={product.href ?? '#'} className="flex flex-col gap-2">
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <SanityImage
            image={product.image}
            width={600}
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain object-center"
            fill
          />
        </div>
        <h3 className="truncate text-center text-lg leading-[150%] text-graphite">{product.name}</h3>
      </Link>
      {product.category?.name && (
        <Link href={product.category.href ?? '#'}>
          <p className="text-center text-base leading-6 text-slate">{product.category.name}</p>
        </Link>
      )}
    </div>
  )
}

export function ProductRail({block}: {block: ProductRailBlock}) {
  const limit = stegaClean(block.source) === 'category' ? (block.limit ?? 12) : undefined
  const products = (block.products ?? []).filter(Boolean).slice(0, limit)
  if (!products.length) return null

  const columns = columnsFor(products)
  const cards = products.map((product) => ({
    key: product._id,
    node: <ProductCard product={product} />,
  }))
  const titleClass = 'mx-auto mb-8 text-center text-2xl leading-9 font-medium'

  return (
    <section className={toneClass(block.tone)}>
      <div className="page-container py-pagebuilder">
        <div className="flex w-full justify-center">
          {block.titleHref ? (
            <Link href={block.titleHref} className={titleClass}>
              <h2>{block.title}</h2>
            </Link>
          ) : (
            <h2 className={titleClass}>{block.title}</h2>
          )}
        </div>
        {stegaClean(block.display) === 'grid' ? (
          <div className={`grid grid-cols-2 gap-8 ${columns === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-5'}`}>
            {cards.map((card) => (
              <div key={card.key}>{card.node}</div>
            ))}
          </div>
        ) : (
          <ProductCarousel columns={columns} label={block.title}>
            {cards.map((card) => (
              <div key={card.key}>{card.node}</div>
            ))}
          </ProductCarousel>
        )}
      </div>
    </section>
  )
}
