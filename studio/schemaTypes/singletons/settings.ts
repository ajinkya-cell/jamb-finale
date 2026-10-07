import {defineArrayMember, defineField, defineType} from 'sanity'
import {CogIcon} from '@sanity/icons/Cog'
import {ShareIcon} from '@sanity/icons/Share'

/** Singleton (fixed _id "settings"): site identity, contact details and social profiles. */
export const settingsType = defineType({
  name: 'settings',
  title: 'Site settings',
  type: 'document',
  icon: CogIcon,
  groups: [
    {name: 'site', title: 'Site', default: true},
    {name: 'contact', title: 'Contact'},
  ],
  fields: [
    defineField({
      name: 'siteTitle',
      type: 'string',
      group: 'site',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'siteDescription',
      type: 'text',
      rows: 3,
      group: 'site',
      validation: (rule) => rule.max(160).warning('Keep descriptions under 160 characters'),
    }),
    defineField({
      name: 'logo',
      type: 'imageWithAlt',
      group: 'site',
      options: {accept: 'image/svg+xml,image/png'},
    }),
    defineField({
      name: 'defaultSeoImage',
      title: 'Default social sharing image',
      type: 'image',
      group: 'site',
      options: {hotspot: true},
    }),
    defineField({
      name: 'phone',
      type: 'string',
      group: 'contact',
    }),
    defineField({
      name: 'email',
      type: 'string',
      group: 'contact',
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: 'address',
      type: 'text',
      rows: 3,
      group: 'contact',
    }),
    defineField({
      name: 'socialLinks',
      type: 'array',
      group: 'contact',
      of: [
        defineArrayMember({
          name: 'socialLink',
          type: 'object',
          icon: ShareIcon,
          fields: [
            defineField({
              name: 'platform',
              type: 'string',
              options: {
                list: [
                  {title: 'Instagram', value: 'instagram'},
                  {title: 'YouTube', value: 'youtube'},
                  {title: 'Pinterest', value: 'pinterest'},
                  {title: 'Vimeo', value: 'vimeo'},
                  {title: 'Facebook', value: 'facebook'},
                  {title: 'LinkedIn', value: 'linkedin'},
                  {title: 'X', value: 'x'},
                ],
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'url',
              type: 'url',
              validation: (rule) => rule.required().uri({scheme: ['https']}),
            }),
          ],
          preview: {
            select: {title: 'platform', subtitle: 'url'},
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({title: 'Site settings', media: CogIcon}),
  },
})
