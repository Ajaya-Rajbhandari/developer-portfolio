import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { colorInput } from '@sanity/color-input'
import { schemaTypes } from './sanity/schema'
import { DuplicatePersonalAction } from './sanity/actions/duplicatePersonal'

export default defineConfig({
  name: 'default',
  title: 'Portfolio CMS',
  basePath: '/studio',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '48v38ttl',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',

  plugins: [structureTool(), colorInput()],

  document: {
    // Swap the default "Duplicate" for a Personal Information copy that starts inactive.
    actions: (prev, context) => {
      if (context.schemaType !== 'personal') return prev
      return [...prev.filter((action) => action.action !== 'duplicate'), DuplicatePersonalAction]
    },
  },

  schema: {
    types: schemaTypes,
  },
})
