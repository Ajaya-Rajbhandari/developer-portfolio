import React, { useState } from 'react'
import { PatchEvent, set, unset } from 'sanity'
import { useClient, useFormValue } from 'sanity'

interface IsActiveInputProps {
  value?: boolean
  onChange: (event: PatchEvent) => void
  schemaType: any
}

export const IsActiveInput = (props: IsActiveInputProps) => {
  const { value, onChange } = props
  const client = useClient({ apiVersion: '2024-01-01' })
  // Get document ID from form context
  const documentId = useFormValue(['_id']) as string | undefined
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = async (newValue: boolean) => {
    setError(null)

    if (!documentId) {
      setError('Document ID not found')
      return
    }

    const baseId = documentId.replace(/^drafts\./, '')
    const draftId = `drafts.${baseId}`
    const idsToExclude = [baseId, draftId]

    // If trying to deactivate, check if this is the only active profile
    if (newValue === false) {
      try {
        const { otherActiveCount, currentPublishedIsActive, currentDraftIsActive } = await client.fetch(
          `{
            "otherActiveCount": count(*[_type == "personal" && isActive == true && !(_id in $idsToExclude)]),
            "currentPublishedIsActive": *[_id == $baseId][0].isActive,
            "currentDraftIsActive": *[_id == $draftId][0].isActive
          }`,
          { baseId, draftId, idsToExclude }
        )

        const currentDocumentIsAlreadyActive = currentPublishedIsActive === true || currentDraftIsActive === true

        if (currentDocumentIsAlreadyActive && otherActiveCount === 0) {
          setError('Cannot deactivate: This is the only active profile. Activate another profile first.')
          return
        }
      } catch (err) {
        setError('Error checking active profiles')
        return
      }
    }

    // If activating, automatically deactivate all other profiles
    if (newValue === true) {
      setIsProcessing(true)
      try {
        // Get all other active profiles, excluding this document's draft/published pair
        const activeProfiles = await client.fetch(
          `*[_type == "personal" && isActive == true && !(_id in $idsToExclude)]._id`,
          { idsToExclude }
        )

        // Deactivate all other profiles
        if (activeProfiles.length > 0) {
          const deactivatePromises = activeProfiles.map((id: string) =>
            client.patch(id).set({ isActive: false }).commit()
          )

          await Promise.all(deactivatePromises)
        }

        // Update the current document
        onChange(PatchEvent.from(set(true)))
        setIsProcessing(false)
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to deactivate other profiles'
        setError(`Error: ${message}`)
        setIsProcessing(false)
        return
      }
    } else {
      // For deactivation, just update the value
      onChange(PatchEvent.from(newValue === undefined ? unset() : set(newValue)))
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
        <input
          type="checkbox"
          checked={value || false}
          onChange={(e) => handleChange(e.target.checked)}
          disabled={isProcessing}
          style={{ cursor: isProcessing ? 'wait' : 'pointer' }}
        />
        <span>Use This Profile</span>
        {isProcessing && <span style={{ fontSize: '12px', color: '#666' }}>(Processing...)</span>}
      </label>
      {error && (
        <div style={{ color: '#e74c3c', fontSize: '14px', padding: '8px', background: '#fee', borderRadius: '4px' }}>
          {error}
        </div>
      )}
      <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
        Only one profile can be active at a time. Activating this will automatically deactivate others.
      </div>
    </div>
  )
}
