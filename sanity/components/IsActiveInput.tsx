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

    // If trying to deactivate, check if this is the only active profile
    if (newValue === false) {
      try {
        const otherActiveCount = await client.fetch(
          `count(*[_type == "personal" && isActive == true && _id != $currentId])`,
          { currentId: documentId }
        )

        if (otherActiveCount === 0) {
          setError('Cannot deactivate: This is the only active profile. At least one profile must remain active.')
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
        // Get all other active profiles
        const activeProfiles = await client.fetch(
          `*[_type == "personal" && isActive == true && _id != $currentId]._id`,
          { currentId: documentId }
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
      } catch (err: any) {
        setError(`Error: ${err.message || 'Failed to deactivate other profiles'}`)
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
