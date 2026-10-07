import {defineArrayMember, defineField, defineType} from 'sanity'
import {MenuIcon} from '@sanity/icons/Menu'

/** Singleton (fixed _id "navigation"): the header menu. */
export const navigationType = defineType({
  name: 'navigation',
  title: 'Header navigation',
  type: 'document',
  icon: MenuIcon,
  fields: [
    defineField({
      name: 'items',
      type: 'array',
      of: [defineArrayMember({type: 'navItem'})],
      validation: (rule) => rule.max(8),
    }),
  ],
  preview: {
    prepare: () => ({title: 'Header navigation', media: MenuIcon}),
  },
})
