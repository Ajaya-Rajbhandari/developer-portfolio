import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { colorInput } from '@sanity/color-input'
import { schemaTypes } from './sanity/schema'

export default defineConfig({
  name: 'default',
  title: 'Portfolio CMS',
  basePath: '/studio',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '48v38ttl',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',

  plugins: [structureTool(), colorInput()],

  schema: {
    types: schemaTypes,
  },
})
