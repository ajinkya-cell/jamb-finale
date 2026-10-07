import {defineArrayMember, defineField, defineType} from 'sanity'
import {PackageIcon} from '@sanity/icons/Package'

export const productType = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  icon: PackageIcon,
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      description: 'Appended to the category path, e.g. /fireplaces/…/marble/ailesbury.',
      options: {source: 'name', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      type: 'reference',
      to: [{type: 'category'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'images',
      type: 'array',
      description: 'The first image is used on product cards.',
      of: [defineArrayMember({type: 'imageWithAlt'})],
      options: {layout: 'grid'},
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      description: 'Used to order "latest" product rails.',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
  ],
  orderings: [
    {
      title: 'Newest first',
      name: 'publishedAtDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
  ],
  preview: {
    select: {title: 'name', category: 'category.name', media: 'images.0'},
    prepare({title, category, media}) {
      return {title: title || 'Untitled', subtitle: category, media: media ?? PackageIcon}
    },
  },
})
