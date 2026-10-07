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
    select: {groups: 'groups'},
    prepare({groups}) {
      const headings = (groups ?? [])
        .map((g: {heading?: string}) => g.heading)
        .filter(Boolean)
      return {
        title: headings.join(' + ') || 'Footer column',
        subtitle: `${groups?.length ?? 0} groups`,
        media: ThLargeIcon,
      }
    },
  },
})
