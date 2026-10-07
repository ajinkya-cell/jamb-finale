import {defineArrayMember, defineField, defineType} from 'sanity'
import {StackIcon} from '@sanity/icons/Stack'

/** A group of links: a mega-menu column in the header or a link column in the footer. */
export const navColumnType = defineType({
  name: 'navColumn',
  title: 'Link column',
  type: 'object',
  icon: StackIcon,
  fields: [
    defineField({
      name: 'heading',
      type: 'string',
      description: 'Optional, e.g. "Reproduction Fireplaces".',
    }),
    defineField({
      name: 'headingLink',
      type: 'link',
      description: 'Makes the heading clickable.',
      hidden: ({parent}) => !parent?.heading,
    }),
    defineField({
      name: 'links',
      type: 'array',
      of: [defineArrayMember({type: 'cta'})],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: {heading: 'heading', links: 'links'},
    prepare({heading, links}) {
      const labels = (links ?? []).map((l: {label?: string}) => l.label).filter(Boolean)
      return {
        title: heading || labels.slice(0, 3).join(', ') || 'Untitled column',
        subtitle: `${labels.length} links`,
        media: StackIcon,
      }
    },
  },
})
