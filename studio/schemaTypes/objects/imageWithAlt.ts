import {defineField, defineType} from 'sanity'
import {ImageIcon} from '@sanity/icons/Image'

/** Image with hotspot/crop and alt text, used for every content image. */
export const imageWithAltType = defineType({
  name: 'imageWithAlt',
  title: 'Image',
  type: 'image',
  icon: ImageIcon,
  options: {hotspot: true},
  fields: [
    defineField({
      name: 'alt',
      title: 'Alternative text',
      type: 'string',
      description: 'Describe the image for screen readers and search engines.',
      validation: (rule) => rule.required().warning('Alt text is important for accessibility and SEO'),
    }),
  ],
})
