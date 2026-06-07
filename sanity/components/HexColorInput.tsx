import React, { useId, useMemo } from 'react'
import { PatchEvent, set, unset, StringInputProps, StringSchemaType } from 'sanity'

const HEX_COLOR_PATTERN = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/

const PRESET_COLORS = [
  '#FFD93D',
  '#F2C6A0',
  '#EF4444',
  '#F97316',
  '#F59E0B',
  '#22C55E',
  '#4A90E2',
  '#357ABD',
  '#8B5CF6',
  '#FFFFFF',
  '#111827',
  '#000000',
]

type HexColorInputProps = StringInputProps<StringSchemaType>

type ColorInputOptions = {
  fallback?: string
  presets?: string[]
}

const normalizeHex = (value: string) => {
  const trimmed = value.trim()
  if (!trimmed) return ''
  return trimmed.startsWith('#') ? trimmed : `#${trimmed}`
}

const isValidHex = (value: string) => HEX_COLOR_PATTERN.test(value)

export const HexColorInput = (props: HexColorInputProps) => {
  const { value, onChange, schemaType } = props
  const inputId = useId()
  const colorOptions = (schemaType?.options || {}) as ColorInputOptions
  const fallback = colorOptions.fallback || '#8B5CF6'
  const displayValue = value || ''
  const normalizedValue = normalizeHex(displayValue)
  const validValue = isValidHex(normalizedValue)
  const previewColor = validValue ? normalizedValue : fallback
  const presets = useMemo(
    () => Array.from(new Set([...(colorOptions.presets || []), ...PRESET_COLORS])),
    [colorOptions.presets]
  )

  const updateValue = (nextValue: string) => {
    const normalized = normalizeHex(nextValue)
    onChange(PatchEvent.from(normalized ? set(normalized) : unset()))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <label htmlFor={inputId} style={{ width: 44, height: 36, position: 'relative', cursor: 'pointer' }}>
          <span
            aria-hidden="true"
            style={{
              display: 'block',
              width: 44,
              height: 36,
              borderRadius: 8,
              background: previewColor,
              border: `1px solid ${validValue ? 'rgba(255,255,255,0.25)' : '#ef4444'}`,
              boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.2)',
            }}
          />
          <input
            id={inputId}
            aria-label={`${schemaType?.title || 'Color'} picker`}
            type="color"
            value={previewColor}
            onChange={(event) => updateValue(event.currentTarget.value)}
            style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
          />
        </label>

        <input
          aria-label={`${schemaType?.title || 'Color'} hex value`}
          type="text"
          value={displayValue}
          placeholder={fallback}
          onChange={(event) => updateValue(event.currentTarget.value)}
          onBlur={(event) => updateValue(event.currentTarget.value)}
          style={{
            flex: 1,
            minWidth: 0,
            borderRadius: 6,
            border: `1px solid ${displayValue && !validValue ? '#ef4444' : 'rgba(255,255,255,0.2)'}`,
            padding: '8px 10px',
            fontFamily: 'monospace',
            fontSize: 14,
            background: 'var(--card-bg-color, rgba(255,255,255,0.04))',
            color: 'inherit',
          }}
        />
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {presets.map((color) => (
          <button
            key={color}
            type="button"
            title={color}
            aria-label={`Use ${color}`}
            onClick={() => updateValue(color)}
            style={{
              width: 24,
              height: 24,
              borderRadius: 999,
              border: color.toLowerCase() === normalizedValue.toLowerCase() ? '2px solid currentColor' : '1px solid rgba(255,255,255,0.25)',
              background: color,
              cursor: 'pointer',
            }}
          />
        ))}
      </div>

      {displayValue && !validValue && (
        <div style={{ color: '#ef4444', fontSize: 12 }}>
          Use a valid hex color like #8B5CF6 or #fff.
        </div>
      )}

      <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12 }}>
        Click the swatch to pick a color, use presets, or type a hex value manually.
      </div>
    </div>
  )
}
