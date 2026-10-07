import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: '87o3agrt',
    dataset: 'production'
  },
  deployment: {
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  },
  typegen: {
    // Generate result types for the Next.js app's GROQ queries.
    path: '../nextjs/src/**/*.{ts,tsx}',
    schema: 'schema.json',
    generates: '../nextjs/src/sanity/types.ts',
    overloadClientMethods: true,
  },
})
