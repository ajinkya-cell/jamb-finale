import {defineField, defineType} from 'sanity'
import {SearchIcon} from '@sanity/icons/Search'

/** Optional per-page SEO overrides; the frontend falls back to page/site values. */
export const seoType = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  icon: SearchIcon,
  options: {collapsible: true, collapsed: false},
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      description: 'Overrides the page title in search results and browser tabs.',
      validation: (rule) => rule.max(60).warning('Keep titles under 60 characters'),
    }),
    defineField({
      name: 'description',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.max(160).warning('Keep descriptions under 160 characters'),
    }),
    defineField({
      name: 'image',
      title: 'Social sharing image',
      type: 'image',
      description: '1200×630 recommended.',
      options: {hotspot: true},
    }),
    defineField({
      name: 'noIndex',
      title: 'Hide from search engines',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})
