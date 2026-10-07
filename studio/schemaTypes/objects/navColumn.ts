import {defineArrayMember, defineField, defineType} from 'sanity'
import {StackIcon} from '@sanity/icons/Stack'

/** A group of links: a mega-menu column in the header or a link column in the footer. */
export const navColumnType = defineType({
  name: 'navColumn',
  title: 'Link column',
  type: 'object',
  icon: StackIcon,
  fields: [
    defineField({
      name: 'heading',
      type: 'string',
      description: 'Optional, e.g. "Reproduction Fireplaces".',
    }),
    defineField({
      name: 'headingLink',
      type: 'link',
      description: 'Makes the heading clickable.',
      hidden: ({parent}) => !parent?.heading,
    }),
    defineField({
      name: 'links',
      type: 'array',
      of: [defineArrayMember({type: 'cta'})],
      // A heading-only group is valid (e.g. "Journal" in the footer links straight to /journal).
      validation: (rule) =>
        rule.custom((links, context) => {
          const heading = (context.parent as {heading?: string} | undefined)?.heading
          return heading || (Array.isArray(links) && links.length > 0)
            ? true
            : 'Add a heading or at least one link'
        }),
    }),
  ],
  preview: {
    select: {
      heading: 'heading',
      link0: 'links.0.label',
      link1: 'links.1.label',
      link2: 'links.2.label',
      link3: 'links.3.label',
    },
    prepare({heading, link0, link1, link2, link3}) {
      const labels = [link0, link1, link2].filter(Boolean)
      const list = labels.length ? `${labels.join(', ')}${link3 ? '…' : ''}` : 'No links yet'
      return {
        title: heading || list,
        subtitle: heading ? list : 'Link column',
        media: StackIcon,
      }
    },
  },
})
