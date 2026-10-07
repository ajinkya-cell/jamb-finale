import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {presentationTool} from 'sanity/presentation'
import {visionTool} from '@sanity/vision'
import {schemaTypes, SINGLETON_TYPES} from './schemaTypes'
import {structure} from './structure'
import {resolve} from './presentation/resolve'
import {JambIcon} from './components/JambIcon'

// The Next.js front end shown inside Presentation. Override with SANITY_STUDIO_PREVIEW_URL.
const PREVIEW_URL =
  process.env.SANITY_STUDIO_PREVIEW_URL ||
  (process.env.NODE_ENV === 'production' ? 'https://jamb-finale.vercel.app' : 'http://localhost:3000')

// Singletons can only be edited and published, never created, duplicated or deleted.
const SINGLETON_ACTIONS = new Set(['publish', 'discardChanges', 'restore'])

export default defineConfig({
  name: 'default',
  title: 'Jamb',
  subtitle: 'Website content',
  icon: JambIcon,

  projectId: '87o3agrt',
  dataset: 'production',

  plugins: [
    structureTool({structure}),
    presentationTool({
      resolve,
      previewUrl: {
        initial: PREVIEW_URL,
        previewMode: {enable: '/api/draft-mode/enable'},
      },
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter(({schemaType}) => !SINGLETON_TYPES.has(schemaType)),
  },

  document: {
    actions: (input, context) =>
      SINGLETON_TYPES.has(context.schemaType)
        ? input.filter(({action}) => action && SINGLETON_ACTIONS.has(action))
        : input,
    newDocumentOptions: (prev, {creationContext}) =>
      creationContext.type === 'global'
        ? prev.filter((item) => !SINGLETON_TYPES.has(item.templateId))
        : prev,
  },
})
