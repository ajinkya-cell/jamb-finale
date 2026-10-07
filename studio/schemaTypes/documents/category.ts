import {defineField, defineType} from 'sanity'
import {FolderIcon} from '@sanity/icons/Folder'

const API_VERSION = '2026-02-01'

const slugifySegment = (input: string) =>
  input
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

/**
 * Product taxonomy, e.g. Fireplaces → Reproduction Fireplaces → Marble.
 * The slug stores the full path (/fireplaces/reproduction-fireplaces/marble)
 * built from the parent, so URLs mirror the hierarchy.
 */
export const categoryType = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  icon: FolderIcon,
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'parent',
      title: 'Parent category',
      type: 'reference',
      to: [{type: 'category'}],
      options: {
        filter: ({document}) => ({
          filter: '_id != $id',
          params: {id: document._id.replace(/^drafts\./, '')},
        }),
      },
      validation: (rule) =>
        rule.custom(async (parent, context) => {
          // Walk up the tree: a category can't sit inside one of its own descendants.
          const selfId = context.document?._id.replace(/^drafts\./, '')
          const client = context.getClient({apiVersion: API_VERSION})
          let ref = (parent as {_ref?: string} | undefined)?._ref
          for (let depth = 0; ref && depth < 20; depth++) {
            if (ref === selfId) return 'A category cannot be placed inside one of its own subcategories'
            ref =
              (await client.fetch<string | null>('*[_id == $id][0].parent._ref', {id: ref})) ??
              undefined
          }
          return true
        }),
    }),
    defineField({
      name: 'slug',
      title: 'Path',
      type: 'slug',
      description: 'Generated from the parent path and the name.',
      options: {
        source: async (doc, {getClient}) => {
          const parentRef = (doc.parent as {_ref?: string} | undefined)?._ref
          const parentPath = parentRef
            ? await getClient({apiVersion: API_VERSION}).fetch<string | null>(
                '*[_id == $id][0].slug.current',
                {id: parentRef},
              )
            : ''
          return `${parentPath ?? ''}/${doc.name ?? ''}`
        },
        slugify: (input) => '/' + input.split('/').map(slugifySegment).filter(Boolean).join('/'),
      },
      validation: (rule) =>
        rule.required().custom((slug) => {
          if (!slug?.current) return true
          return /^(\/[a-z0-9]+(-[a-z0-9]+)*)+$/.test(slug.current)
            ? true
            : 'Path must start with / and use lowercase words separated by hyphens'
        }),
    }),
    defineField({
      name: 'description',
      type: 'text',
      rows: 3,
    }),
  ],
  preview: {
    select: {title: 'name', path: 'slug.current'},
    prepare({title, path}) {
      return {title: title || 'Untitled', subtitle: path, media: FolderIcon}
    },
  },
})
