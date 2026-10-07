import {defineArrayMember, defineField, defineType} from 'sanity'
import {BlockContentIcon} from '@sanity/icons/BlockContent'

/**
 * Singleton (fixed _id "footer"). Contact details and social links come from
 * Site settings so they are only edited in one place.
 */
export const footerType = defineType({
  name: 'footer',
  title: 'Footer',
  type: 'document',
  icon: BlockContentIcon,
  fields: [
    defineField({
      name: 'newsletter',
      type: 'object',
      options: {collapsible: true, collapsed: false},
      fields: [
        defineField({
          name: 'heading',
          type: 'string',
          initialValue: 'Newsletter',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'body',
          type: 'text',
          rows: 2,
        }),
        defineField({
          name: 'buttonLabel',
          type: 'string',
          initialValue: 'Subscribe',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'consent',
          title: 'Consent text',
          type: 'richText',
          description: 'Shown next to the consent checkbox, e.g. "I agree to our Privacy Policy".',
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'columns',
      title: 'Link columns',
      type: 'array',
      of: [defineArrayMember({type: 'footerColumn'})],
      validation: (rule) => rule.max(6),
    }),
  ],
  preview: {
    prepare: () => ({title: 'Footer', media: BlockContentIcon}),
  },
})
