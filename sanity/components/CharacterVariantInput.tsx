import React, {useCallback} from 'react'
import {set, type StringInputProps} from 'sanity'

type VariantValue = 'developer' | 'creator' | 'minimal' | 'explorer' | 'techLead' | 'aiBuilder'

type CharacterOption = {
  value: VariantValue
  title: string
  mood: string
  prompt: string
  timing: string
  items: string
  colors: {
    skin: string
    shirt: string
    pants: string
    accent: string
    hair: string
    laptop: string
  }
  accessory: 'laptop' | 'spark' | 'none'
  shape: 'hoodie' | 'jacket' | 'tee' | 'minimal'
}

const CHARACTER_OPTIONS: CharacterOption[] = [
  {
    value: 'developer',
    title: 'Developer',
    mood: 'Focused',
    prompt: 'focused + laptop glow',
    timing: 'Messages: 8–14s • Actions: 5.6–8.2s',
    items: 'Items: bug, check, idea',
    accessory: 'laptop',
    shape: 'hoodie',
    colors: {skin: '#F2C6A0', shirt: '#7C3AED', pants: '#111827', accent: '#8B5CF6', hair: '#1F2937', laptop: '#CBD5E1'},
  },
  {
    value: 'creator',
    title: 'Creator',
    mood: 'Talkative',
    prompt: 'chatty + expressive',
    timing: 'Messages: 8–14s • Actions: 3.6–5.6s',
    items: 'Items: chat, idea, rocket',
    accessory: 'spark',
    shape: 'tee',
    colors: {skin: '#D99A6C', shirt: '#06B6D4', pants: '#1E293B', accent: '#22D3EE', hair: '#3B2416', laptop: '#E0F2FE'},
  },
  {
    value: 'minimal',
    title: 'Minimal',
    mood: 'Bored / calm',
    prompt: 'slow blink + chill',
    timing: 'Messages: 8–14s • Actions: 7.2–10.4s',
    items: 'Items: check',
    accessory: 'none',
    shape: 'minimal',
    colors: {skin: '#F2C6A0', shirt: '#334155', pants: '#0F172A', accent: '#64748B', hair: '#1F2937', laptop: '#CBD5E1'},
  },
  {
    value: 'explorer',
    title: 'Explorer',
    mood: 'Excited',
    prompt: 'bouncy + surprised',
    timing: 'Messages: 8–14s • Actions: 2.6–4.6s',
    items: 'Items: rocket, idea, chat',
    accessory: 'spark',
    shape: 'jacket',
    colors: {skin: '#B77952', shirt: '#0F766E', pants: '#1E293B', accent: '#F59E0B', hair: '#111827', laptop: '#FDE68A'},
  },
  {
    value: 'techLead',
    title: 'Tech Lead',
    mood: 'Confident',
    prompt: 'steady + sharp',
    timing: 'Messages: 8–14s • Actions: 6.2–9s',
    items: 'Items: check, idea',
    accessory: 'laptop',
    shape: 'jacket',
    colors: {skin: '#C08457', shirt: '#1D4ED8', pants: '#0F172A', accent: '#60A5FA', hair: '#171717', laptop: '#E2E8F0'},
  },
  {
    value: 'aiBuilder',
    title: 'AI Builder',
    mood: 'Curious',
    prompt: 'scanning + neon pulse',
    timing: 'Messages: 8–14s • Actions: 3.2–5.6s',
    items: 'Items: neural, idea, spark',
    accessory: 'spark',
    shape: 'hoodie',
    colors: {skin: '#E0B089', shirt: '#581C87', pants: '#111827', accent: '#A78BFA', hair: '#312E81', laptop: '#DDD6FE'},
  },
]

function MiniCharacter({option}: {option: CharacterOption}) {
  const {colors} = option

  return (
    <svg viewBox="0 0 160 190" role="img" aria-label={`${option.title} preview`} className="character-preview__svg">
      <ellipse cx="80" cy="174" rx="38" ry="8" fill={colors.accent} opacity="0.22" />
      <g className="character-preview__body">
        <rect x="69" y="67" width="22" height="24" rx="9" fill={colors.skin} />
        <rect x="54" y="80" width="52" height="60" rx={option.shape === 'jacket' ? 10 : 15} fill={colors.shirt} />
        {option.shape === 'jacket' && <path d="M80 80 L94 140 H66 Z" fill="#020617" opacity="0.28" />}
        {option.shape === 'hoodie' && <path d="M62 88 Q80 104 98 88" stroke="#F5F3FF" strokeWidth="4" fill="none" opacity="0.75" />}
        {option.shape === 'minimal' && <rect x="65" y="94" width="30" height="4" rx="2" fill={colors.accent} opacity="0.7" />}
        {option.shape === 'tee' && <circle cx="80" cy="104" r="10" fill={colors.accent} opacity="0.22" />}
        <rect x="42" y="86" width="16" height="45" rx="8" fill={colors.shirt} opacity="0.92" />
        <rect x="102" y="86" width="16" height="45" rx="8" fill={colors.shirt} opacity="0.92" />
        <circle cx="50" cy="132" r="7" fill={colors.skin} />
        <circle cx="110" cy="132" r="7" fill={colors.skin} />
        <rect x="62" y="137" width="16" height="36" rx="8" fill={colors.pants} />
        <rect x="82" y="137" width="16" height="36" rx="8" fill={colors.pants} />
        {option.accessory === 'laptop' && (
          <g className="character-preview__laptop">
            <rect x="56" y="116" width="48" height="28" rx="4" fill={colors.laptop} />
            <rect x="61" y="121" width="38" height="18" rx="3" fill="#0F172A" opacity="0.85" />
            <circle cx="80" cy="130" r="3" fill={colors.accent} />
          </g>
        )}
        {option.accessory === 'spark' && (
          <g className="character-preview__spark" fill={colors.accent}>
            <path d="M122 72 L127 83 L138 88 L127 93 L122 104 L117 93 L106 88 L117 83 Z" />
            <circle cx="111" cy="64" r="3" />
          </g>
        )}
      </g>
      <g className="character-preview__head">
        <circle cx="80" cy="48" r="33" fill={colors.skin} />
        {option.value !== 'minimal' && <path d="M48 46 C50 20 68 8 90 13 C109 17 120 31 118 51 C106 41 95 36 80 36 C65 36 56 40 48 46 Z" fill={colors.hair} />}
        <circle cx="70" cy="46" r="8" fill="#F8FAFC" />
        <circle cx="90" cy="46" r="8" fill="#F8FAFC" />
        <circle className="character-preview__eye" cx="70" cy="46" r="3" fill="#020617" />
        <circle className="character-preview__eye" cx="90" cy="46" r="3" fill="#020617" />
        <path d="M70 60 Q80 68 90 60" stroke="#020617" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  )
}

export default function CharacterVariantInput(props: StringInputProps) {
  const {value, onChange, readOnly} = props
  const handleSelect = useCallback(
    (nextValue: VariantValue) => {
      if (readOnly) return
      onChange(set(nextValue))
    },
    [onChange, readOnly],
  )

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>, nextValue: VariantValue) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        handleSelect(nextValue)
      }
    },
    [handleSelect],
  )

  return (
    <div className="character-picker">
      <style>{`
        .character-picker {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(165px, 1fr));
          gap: 12px;
        }
        .character-picker__guide {
          grid-column: 1 / -1;
          border: 1px solid rgba(139,92,246,0.28);
          border-radius: 14px;
          background: linear-gradient(135deg, rgba(124,58,237,0.14), rgba(14,165,233,0.08));
          padding: 12px 14px;
          font-size: 13px;
          line-height: 1.45;
        }
        .character-picker__guide strong {
          display: block;
          margin-bottom: 3px;
          font-size: 14px;
        }
        .character-picker__guide-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
          gap: 8px;
          margin-top: 10px;
        }
        .character-picker__guide-chip {
          border: 1px solid rgba(148,163,184,0.18);
          border-radius: 10px;
          background: rgba(15,23,42,0.12);
          padding: 8px 9px;
          font-size: 11px;
        }
        .character-picker__guide-chip b {
          display: block;
          margin-bottom: 2px;
          font-size: 11px;
        }
        .character-preview-card {
          appearance: none;
          width: 100%;
          text-align: left;
          color: inherit;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.16);
          border-radius: 14px;
          padding: 12px;
          cursor: pointer;
          transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease, background 180ms ease;
          overflow: hidden;
        }
        .character-preview-card.is-selected {
          border-color: #8B5CF6;
          background: rgba(124,58,237,0.12);
          box-shadow: inset 0 0 0 1px rgba(139,92,246,0.3);
        }
        .character-preview-card.is-readonly {
          cursor: default;
          opacity: 0.72;
        }
        .character-preview-card:not(.is-readonly):hover,
        .character-preview-card:not(.is-readonly):focus-visible {
          transform: translateY(-7px) scale(1.025);
          border-color: rgba(139,92,246,0.75);
          box-shadow: 0 18px 38px rgba(124,58,237,0.24);
          outline: none;
        }
        .character-preview-card:not(.is-readonly):hover .character-preview__svg,
        .character-preview-card:not(.is-readonly):focus-visible .character-preview__svg {
          animation: pickMeUpFloat 780ms ease-in-out infinite alternate;
        }
        .character-preview-card:not(.is-readonly):hover .character-preview__head,
        .character-preview-card:not(.is-readonly):focus-visible .character-preview__head {
          animation: pickMeUpNod 650ms ease-in-out infinite alternate;
          transform-origin: 80px 70px;
        }
        .character-preview-card:not(.is-readonly):hover .character-preview__eye,
        .character-preview-card:not(.is-readonly):focus-visible .character-preview__eye {
          animation: pickMeUpEyes 700ms ease-in-out infinite alternate;
        }
        .character-preview-card:not(.is-readonly):hover .character-preview__spark,
        .character-preview-card:not(.is-readonly):hover .character-preview__laptop,
        .character-preview-card:not(.is-readonly):focus-visible .character-preview__spark,
        .character-preview-card:not(.is-readonly):focus-visible .character-preview__laptop {
          animation: pickMeUpPulse 700ms ease-in-out infinite alternate;
          transform-origin: center;
        }
        .character-preview__frame {
          margin-bottom: 10px;
          border-radius: 10px;
          background: linear-gradient(180deg, rgba(124,58,237,0.14), rgba(15,23,42,0.04));
        }
        .character-preview__svg {
          width: 100%;
          height: 132px;
          display: block;
        }
        .character-preview__meta {
          display: grid;
          gap: 4px;
        }
        .character-preview__row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }
        .character-preview__title {
          font-size: 14px;
          font-weight: 700;
          line-height: 1.2;
        }
        .character-preview__selected {
          border-radius: 999px;
          background: #7C3AED;
          color: white;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .02em;
          padding: 3px 7px;
          white-space: nowrap;
        }
        .character-preview__mood {
          color: inherit;
          font-size: 12px;
          font-weight: 600;
          opacity: .82;
        }
        .character-preview__prompt {
          color: inherit;
          font-size: 11px;
          opacity: .62;
        }
        .character-preview__timing,
        .character-preview__items {
          border-radius: 999px;
          padding: 4px 7px;
          font-size: 10px;
          line-height: 1.2;
          color: inherit;
          background: rgba(148,163,184,0.12);
          border: 1px solid rgba(148,163,184,0.18);
          opacity: .78;
        }
        .character-preview__items {
          background: rgba(139,92,246,0.11);
          border-color: rgba(139,92,246,0.18);
        }
        @keyframes pickMeUpFloat { from { transform: translateY(0) rotate(-1deg); } to { transform: translateY(-5px) rotate(1deg); } }
        @keyframes pickMeUpNod { from { transform: rotate(-2deg); } to { transform: rotate(3deg); } }
        @keyframes pickMeUpEyes { from { transform: translateX(-1px); } to { transform: translateX(2px); } }
        @keyframes pickMeUpPulse { from { opacity: .72; transform: scale(.96); } to { opacity: 1; transform: scale(1.08); } }
      `}</style>
      <div className="character-picker__guide">
        <strong>Live avatar behavior</strong>
        The selected persona controls idle expression, blink speed, eye movement, speech message rotation, and occasional floating item popups. Hover a card to preview the “pick me up” motion.
        <div className="character-picker__guide-grid">
          <span className="character-picker__guide-chip"><b>Speech bubble</b>First line after ~3s, then random built-in/manual lines every 8–14s.</span>
          <span className="character-picker__guide-chip"><b>Eyes</b>Click/tap the avatar to make the eyes follow the cursor for ~4s; otherwise they use normal idle drift.</span>
          <span className="character-picker__guide-chip"><b>Items</b>Small persona items appear after ~4–7s, then repeat on that character’s action rhythm.</span>
        </div>
      </div>
      {CHARACTER_OPTIONS.map((option) => {
        const selected = value === option.value || (!value && option.value === 'developer')
        return (
          <div
            key={option.value}
            className={`character-preview-card${selected ? ' is-selected' : ''}${readOnly ? ' is-readonly' : ''}`}
            onClick={() => handleSelect(option.value)}
            role="button"
            tabIndex={readOnly ? -1 : 0}
            aria-pressed={selected}
            onKeyDown={(event) => handleKeyDown(event, option.value)}
          >
            <div className="character-preview__frame">
              <MiniCharacter option={option} />
            </div>
            <div className="character-preview__meta">
              <div className="character-preview__row">
                <span className="character-preview__title">{option.title}</span>
                {selected && <span className="character-preview__selected">Selected</span>}
              </div>
              <span className="character-preview__mood">{option.mood}</span>
              <span className="character-preview__prompt">{option.prompt}</span>
              <span className="character-preview__timing">{option.timing}</span>
              <span className="character-preview__items">{option.items}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
