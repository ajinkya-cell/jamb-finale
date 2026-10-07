import {defineField, defineType} from 'sanity'
import {LinkIcon} from '@sanity/icons/Link'

/**
 * Reusable link: either a reference to a document on this site (so links
 * survive slug changes) or an external URL. Used by CTAs, navigation,
 * footer and rich text annotations.
 */
export const linkType = defineType({
  name: 'link',
  title: 'Link',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'linkType',
      title: 'Link type',
      type: 'string',
      options: {
        list: [
          {title: 'Internal page', value: 'internal'},
          {title: 'External URL', value: 'external'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'internal',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'internalLink',
      title: 'Internal page',
      type: 'reference',
      to: [{type: 'homePage'}, {type: 'page'}, {type: 'category'}, {type: 'product'}],
      hidden: ({parent}) => parent?.linkType !== 'internal',
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as {linkType?: string} | undefined
          if (parent?.linkType === 'internal' && !value) return 'Choose a page to link to'
          return true
        }),
    }),
    defineField({
      name: 'externalUrl',
      title: 'External URL',
      type: 'url',
      hidden: ({parent}) => parent?.linkType !== 'external',
      validation: (rule) =>
        rule
          .uri({scheme: ['http', 'https', 'mailto', 'tel']})
          .custom((value, context) => {
            const parent = context.parent as {linkType?: string} | undefined
            if (parent?.linkType === 'external' && !value) return 'Enter a URL'
            return true
          }),
    }),
    defineField({
      name: 'openInNewTab',
      title: 'Open in new tab',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      linkType: 'linkType',
      internalTitle: 'internalLink.title',
      internalName: 'internalLink.name',
      externalUrl: 'externalUrl',
    },
    prepare({linkType, internalTitle, internalName, externalUrl}) {
      return {
        title:
          linkType === 'external' ? externalUrl : internalTitle || internalName || 'No page selected',
        subtitle: linkType === 'external' ? 'External link' : 'Internal link',
        media: LinkIcon,
      }
    },
  },
})
