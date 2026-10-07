import {defineArrayMember, defineField, defineType} from 'sanity'
import {MenuIcon} from '@sanity/icons/Menu'

/** Top-level header navigation entry with an optional mega-menu. */
export const navItemType = defineType({
  name: 'navItem',
  title: 'Navigation item',
  type: 'object',
  icon: MenuIcon,
  fields: [
    defineField({
      name: 'label',
      type: 'string',
      validation: (rule) => rule.required().max(30),
    }),
    defineField({
      name: 'link',
      type: 'link',
      description: 'Where the label itself goes. Leave empty if it only opens the menu.',
    }),
    defineField({
      name: 'columns',
      title: 'Menu columns',
      type: 'array',
      of: [defineArrayMember({type: 'navColumn'})],
      validation: (rule) => rule.max(4),
    }),
  ],
  preview: {
    select: {title: 'label', columns: 'columns'},
    prepare({title, columns}) {
      const count = columns?.length ?? 0
      return {
        title: title || 'Untitled',
        subtitle: count ? `Menu · ${count} columns` : 'Link',
        media: MenuIcon,
      }
    },
  },
})
