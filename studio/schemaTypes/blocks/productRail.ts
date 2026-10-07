import {defineArrayMember, defineField, defineType} from 'sanity'
import {ThLargeIcon} from '@sanity/icons/ThLarge'
import {toneField} from '../shared/toneField'

type RailParent = {source?: string} | undefined

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
      validation: (rule) =>
        rule.unique().custom((value, context) => {
          if ((context.parent as RailParent)?.source === 'manual' && !value?.length) {
            return 'Add at least one product'
          }
          return true
        }),
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
      products: 'products',
      categoryName: 'category.name',
      media: 'products.0.images.0',
    },
    prepare({title, source, products, categoryName, media}) {
      const detail =
        source === 'category'
          ? `latest from ${categoryName ?? '…'}`
          : `${products?.length ?? 0} products`
      return {
        title: title || 'Untitled rail',
        subtitle: `Product rail · ${detail}`,
        media: media ?? ThLargeIcon,
      }
    },
  },
})
