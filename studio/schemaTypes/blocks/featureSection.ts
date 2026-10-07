import {defineArrayMember, defineField, defineType} from 'sanity'
import {SplitHorizontalIcon} from '@sanity/icons/SplitHorizontal'
import {toneField} from '../shared/toneField'

/** Editorial introduction to a collection or story: copy, actions and an image. */
export const featureSectionType = defineType({
  name: 'featureSection',
  title: 'Feature',
  type: 'object',
  icon: SplitHorizontalIcon,
  fields: [
    defineField({
      name: 'eyebrow',
      type: 'string',
      description: 'Short label above the title, e.g. "Antique & Reproduction".',
      validation: (rule) => rule.max(40),
    }),
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'body',
      type: 'richText',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'actions',
      type: 'array',
      of: [defineArrayMember({type: 'cta'})],
      validation: (rule) => rule.max(3),
    }),
    defineField({
      name: 'image',
      type: 'imageWithAlt',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'imagePosition',
      type: 'string',
      description: 'Which side the image sits on wide screens.',
      options: {
        list: [
          {title: 'Left', value: 'left'},
          {title: 'Right', value: 'right'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'right',
    }),
    toneField,
  ],
  preview: {
    select: {title: 'title', eyebrow: 'eyebrow', media: 'image'},
    prepare({title, eyebrow, media}) {
      return {
        title: title || 'Untitled',
        subtitle: ['Feature', eyebrow].filter(Boolean).join(' · '),
        media: media ?? SplitHorizontalIcon,
      }
    },
  },
})
