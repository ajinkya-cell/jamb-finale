import {defineField, defineType} from 'sanity'
import {InlineIcon} from '@sanity/icons/Inline'

/** A labelled link: buttons, hero quick links and navigation links. */
export const ctaType = defineType({
  name: 'cta',
  title: 'Call to action',
  type: 'object',
  icon: InlineIcon,
  fields: [
    defineField({
      name: 'label',
      type: 'string',
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: 'link',
      type: 'link',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'label',
      linkType: 'link.linkType',
      externalUrl: 'link.externalUrl',
      internalTitle: 'link.internalLink.title',
      internalName: 'link.internalLink.name',
    },
    prepare({title, linkType, externalUrl, internalTitle, internalName}) {
      return {
        title: title || 'Untitled link',
        subtitle:
          linkType === 'external' ? externalUrl : `→ ${internalTitle || internalName || 'No page'}`,
        media: InlineIcon,
      }
    },
  },
})
