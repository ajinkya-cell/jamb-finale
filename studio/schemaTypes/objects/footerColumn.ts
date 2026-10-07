import {defineArrayMember, defineField, defineType} from 'sanity'
import {ThLargeIcon} from '@sanity/icons/ThLarge'

/** One column of the footer navigation; can stack several link groups. */
export const footerColumnType = defineType({
  name: 'footerColumn',
  title: 'Footer column',
  type: 'object',
  icon: ThLargeIcon,
  fields: [
    defineField({
      name: 'groups',
      title: 'Link groups',
      type: 'array',
      of: [defineArrayMember({type: 'navColumn'})],
      validation: (rule) => rule.required().min(1).max(3),
    }),
  ],
  preview: {
    select: {group0: 'groups.0.heading', group1: 'groups.1.heading', group2: 'groups.2.heading'},
    prepare({group0, group1, group2}) {
      const headings = [group0, group1, group2].filter(Boolean)
      return {
        title: headings.join(' + ') || 'Footer column',
        subtitle: 'Footer column',
        media: ThLargeIcon,
      }
    },
  },
})
