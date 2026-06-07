import { CopyIcon } from '@sanity/icons'
import { useState } from 'react'
import { useClient, type DocumentActionComponent, type DocumentActionProps } from 'sanity'
import { useRouter } from 'sanity/router'

/**
 * Custom "Duplicate" action for the Personal Information document.
 *
 * A plain duplicate would copy `isActive: true`, which clashes with the
 * "only one active profile" rule. This clone forces `isActive: false` and
 * suffixes the name with "(Copy)" so you can safely edit only what changed
 * before activating it.
 */
export const DuplicatePersonalAction: DocumentActionComponent = (props: DocumentActionProps) => {
  const { type, published, draft } = props
  const client = useClient({ apiVersion: '2024-01-01' })
  const router = useRouter()
  const [isDuplicating, setIsDuplicating] = useState(false)

  const source = draft || published

  return {
    label: isDuplicating ? 'Duplicating…' : 'Duplicate (editable copy)',
    icon: CopyIcon,
    disabled: !source || isDuplicating,
    onHandle: async () => {
      if (!source) return
      setIsDuplicating(true)

      try {
        // Drop system fields; the new doc gets a fresh id.
        const { _id, _rev, _createdAt, _updatedAt, ...rest } = source as Record<string, unknown>
        const baseId = crypto.randomUUID()

        await client.create({
          ...rest,
          _id: `drafts.${baseId}`,
          _type: type,
          isActive: false,
          name: rest.name ? `${rest.name as string} (Copy)` : 'Untitled (Copy)',
        })

        setIsDuplicating(false)
        // Open the new inactive copy so only the changed fields need editing.
        router.navigateIntent('edit', { id: baseId, type })
      } catch (error) {
        setIsDuplicating(false)
        console.error('Failed to duplicate personal profile:', error)
      }
    },
  }
}
