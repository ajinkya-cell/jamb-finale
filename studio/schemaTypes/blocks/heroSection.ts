import {defineField, defineType} from 'sanity'
import {HomeIcon} from '@sanity/icons/Home'
import {toneField} from '../shared/toneField'

export const heroSectionType = defineType({
  name: 'heroSection',
  title: 'Hero',
  type: 'object',
  icon: HomeIcon,
  fields: [
    defineField({
      name: 'heading',
      type: 'string',
      description:
        'Main page heading. Used for accessibility and SEO even when it is not shown visually.',
    }),
    defineField({
      name: 'image',
      type: 'imageWithAlt',
      description: 'Full-width image. Set the hotspot so the focal point survives cropping.',
      validation: (rule) => rule.required(),
    }),
    toneField,
  ],
  preview: {
    select: {heading: 'heading', media: 'image'},
    prepare({heading, media}) {
      return {title: heading || 'Hero', subtitle: 'Hero', media: media ?? HomeIcon}
    },
  },
})
