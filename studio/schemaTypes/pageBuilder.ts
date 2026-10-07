import {defineArrayMember, defineType} from 'sanity'

/** The blocks a page can be composed from. Shared by the home page and other pages. */
export const pageBuilderType = defineType({
  name: 'pageBuilder',
  title: 'Sections',
  type: 'array',
  of: [
    defineArrayMember({type: 'heroSection'}),
    defineArrayMember({type: 'featureSection'}),
    defineArrayMember({type: 'productRail'}),
    defineArrayMember({type: 'videoSection'}),
  ],
  options: {
    insertMenu: {
      groups: [
        {name: 'intro', title: 'Intro', of: ['heroSection']},
        {name: 'content', title: 'Content', of: ['featureSection']},
        {name: 'commerce', title: 'Commerce', of: ['productRail']},
        {name: 'media', title: 'Media', of: ['videoSection']},
      ],
      views: [{name: 'list'}],
    },
  },
})
