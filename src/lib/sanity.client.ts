import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '48v38ttl',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  // Use the live API for portfolio content so published Studio edits appear immediately.
  // The CDN can briefly return stale documents, which made avatar colors look like defaults.
  useCdn: false,
  apiVersion: '2024-01-01',
})
