import {defineField, defineType} from 'sanity'
import {HomeIcon} from '@sanity/icons/Home'

/** Singleton (fixed _id "homePage"), enforced in the desk structure. */
export const homePageType = defineType({
  name: 'homePage',
  title: 'Home page',
  type: 'document',
  icon: HomeIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      description: 'Internal title, also the fallback for the browser tab.',
      group: 'content',
      initialValue: 'Home',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'pageBuilder',
      type: 'pageBuilder',
      group: 'content',
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'seo',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    select: {title: 'title'},
    prepare({title}) {
      return {title: title || 'Home', subtitle: '/', media: HomeIcon}
    },
  },
})
