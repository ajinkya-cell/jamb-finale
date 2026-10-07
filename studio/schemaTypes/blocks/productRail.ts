import {defineArrayMember, defineField, defineType} from 'sanity'
import {ThLargeIcon} from '@sanity/icons/ThLarge'
import {toneField} from '../shared/toneField'

type RailParent = {source?: string} | undefined

const MAX_PRODUCTS = 40
const PRODUCT_SLOTS = Object.fromEntries(
  Array.from({length: MAX_PRODUCTS}, (_, i) => [`slot${i}`, `products.${i}._key`]),
)

/** A row of product cards, hand-picked or pulled automatically from a category. */
export const productRailType = defineType({
  name: 'productRail',
  title: 'Product rail',
  type: 'object',
  icon: ThLargeIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'titleLink',
      type: 'reference',
      to: [{type: 'category'}],
      description: 'Optional category the title links to.',
    }),
    defineField({
      name: 'source',
      title: 'Products',
      type: 'string',
      options: {
        list: [
          {title: 'Choose products', value: 'manual'},
          {title: 'Latest from a category', value: 'category'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'manual',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'products',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'product'}]})],
      hidden: ({parent}) => parent?.source !== 'manual',
      validation: (rule) => [
        rule.unique(),
        rule.custom((value, context) => {
          if ((context.parent as RailParent)?.source === 'manual' && !value?.length) {
            return 'Add at least one product'
          }
          return true
        }),
        rule
          .max(MAX_PRODUCTS)
          .warning('Rails with more than 40 products get slow to browse; consider a category rail'),
      ],
    }),
    defineField({
      name: 'category',
      type: 'reference',
      to: [{type: 'category'}],
      description: 'Shows the most recently published products in this category.',
      hidden: ({parent}) => parent?.source !== 'category',
      validation: (rule) =>
        rule.custom((value, context) => {
          if ((context.parent as RailParent)?.source === 'category' && !value) {
            return 'Choose a category'
          }
          return true
        }),
    }),
    defineField({
      name: 'limit',
      title: 'Number of products',
      type: 'number',
      initialValue: 12,
      hidden: ({parent}) => parent?.source !== 'category',
      validation: (rule) => rule.integer().min(4).max(40),
    }),
    defineField({
      name: 'display',
      type: 'string',
      options: {
        list: [
          {title: 'Carousel', value: 'carousel'},
          {title: 'Grid', value: 'grid'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'carousel',
    }),
    toneField,
  ],
  initialValue: {tone: 'grey'},
  preview: {
    select: {
      title: 'title',
      source: 'source',
      categoryName: 'category.name',
      media: 'products.0.images.0',
      // Sanity advises selecting individual items rather than whole arrays.
      // Each slot's `_key` lives on the array item itself, so it is read
      // without resolving the reference, giving an exact count up to the
      // 40-product guideline enforced above.
      ...PRODUCT_SLOTS,
    },
    prepare({title, source, categoryName, media, ...slots}) {
      const count = Object.values(slots).filter(Boolean).length
      const detail =
        source === 'category'
          ? `latest from ${categoryName ?? '…'}`
          : count >= MAX_PRODUCTS
            ? `${MAX_PRODUCTS}+ products`
            : `${count} ${count === 1 ? 'product' : 'products'}`
      return {
        title: title || 'Untitled rail',
        subtitle: `Product rail · ${detail}`,
        media: media ?? ThLargeIcon,
      }
    },
  },
})
