import {defineArrayMember, defineField, defineType} from 'sanity'
import {LinkIcon} from '@sanity/icons/Link'

/** Short-form rich text for section copy: paragraphs, emphasis and links only. */
export const richTextType = defineType({
  name: 'richText',
  title: 'Rich text',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [{title: 'Normal', value: 'normal'}],
      lists: [],
      marks: {
        decorators: [
          {title: 'Strong', value: 'strong'},
          {title: 'Emphasis', value: 'em'},
        ],
        annotations: [
          defineArrayMember({
            name: 'link',
            title: 'Link',
            type: 'object',
            icon: LinkIcon,
            fields: [
              defineField({
                name: 'link',
                type: 'link',
                validation: (rule) => rule.required(),
              }),
            ],
          }),
        ],
      },
    }),
  ],
})
