import { defineField, defineType } from 'sanity'
import CharacterVariantInput from '../components/CharacterVariantInput'

const BUILT_IN_CHARACTER_OPTIONS = [
  {
    title: 'Developer — recommended for this portfolio',
    value: 'developer',
  },
  {
    title: 'Creator — friendly and playful',
    value: 'creator',
  },
  {
    title: 'Minimal — clean professional',
    value: 'minimal',
  },
  {
    title: 'Explorer — bright and energetic',
    value: 'explorer',
  },
  {
    title: 'Tech Lead — mature and confident',
    value: 'techLead',
  },
  {
    title: 'AI Builder — futuristic accent',
    value: 'aiBuilder',
  },
]

export default defineType({
  name: 'character',
  title: 'Character',
  type: 'document',
  validation: (Rule) =>
    Rule.custom((document: any) => {
      if (!document) return true

      if (!document.title) {
        return 'Character title is required before publishing.'
      }

      if (!document.renderMode) {
        return 'Choose a Render Mode before publishing.'
      }

      if (document.renderMode === 'animatedRig' && !document.characterVariant) {
        return 'Choose one ready-made built-in character.'
      }

      if (document.renderMode === 'staticAsset' && !document.avatarImage?.asset?._ref && !document.avatarSvg?.asset?._ref) {
        return 'Static uploaded asset mode requires either Avatar Image or Avatar SVG.'
      }

      return true
    }),
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'A simple label, for example “Main Portfolio Character”.',
      validation: (Rule) => Rule.required().min(2).max(60),
    }),
    defineField({
      name: 'isDefault',
      title: 'Default Character',
      type: 'boolean',
      description: 'Use this character if Personal Information does not select one.',
      initialValue: false,
    }),
    defineField({
      name: 'renderMode',
      title: 'Character Source',
      type: 'string',
      initialValue: 'animatedRig',
      description: 'Choose a complete ready-made character, or upload one finished avatar image/SVG.',
      options: {
        list: [
          { title: 'Ready-made built-in character', value: 'animatedRig' },
          { title: 'Upload finished avatar', value: 'staticAsset' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'characterVariant',
      title: 'Ready-made Character',
      type: 'string',
      initialValue: 'developer',
      description: 'Pick one complete pre-designed character. Hover a card to preview its “pick me up” animation.',
      components: {
        input: CharacterVariantInput,
      },
      options: {
        list: BUILT_IN_CHARACTER_OPTIONS,
      },
      hidden: ({ parent }) => parent?.renderMode === 'staticAsset',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as { renderMode?: string } | undefined
          if (parent?.renderMode === 'staticAsset') return true
          return value ? true : 'Choose one ready-made character.'
        }),
    }),
    defineField({
      name: 'personality',
      title: 'Personality / Expression Style',
      type: 'string',
      initialValue: 'friendly',
      description: 'Controls how the built-in character behaves: mouth expressions, speech frequency, action speed, and popup rhythm. Friendly = balanced, Professional = steadier/slower, Playful = faster/more expressive, Calm = slow/subtle.',
      options: {
        list: [
          { title: 'Friendly', value: 'friendly' },
          { title: 'Professional', value: 'professional' },
          { title: 'Playful', value: 'playful' },
          { title: 'Calm', value: 'calm' },
        ],
        layout: 'radio',
      },
      hidden: ({ parent }) => parent?.renderMode === 'staticAsset',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as { renderMode?: string } | undefined
          if (parent?.renderMode === 'staticAsset') return true
          return value ? true : 'Choose a personality for the built-in character.'
        }),
    }),
    defineField({
      name: 'message',
      title: 'Avatar Message',
      type: 'string',
      initialValue: '',
      description: 'Optional custom line added into the rotating speech pool. Leave empty to use the portfolio-focused built-in messages with light sarcasm.',
      validation: (Rule) => Rule.max(80),
    }),
    defineField({
      name: 'avatarImage',
      title: 'Finished Avatar Image',
      type: 'image',
      description: 'Optional alternative to the ready-made characters. Upload a complete avatar image.',
      hidden: ({ parent }) => parent?.renderMode !== 'staticAsset',
    }),
    defineField({
      name: 'avatarSvg',
      title: 'Finished Avatar SVG',
      type: 'file',
      description: 'Optional alternative to the ready-made characters. Upload a complete SVG avatar.',
      hidden: ({ parent }) => parent?.renderMode !== 'staticAsset',
      options: {
        accept: '.svg,image/svg+xml',
      },
    }),
  ],
  preview: {
    select: {
      title: 'title',
      isDefault: 'isDefault',
      renderMode: 'renderMode',
      characterVariant: 'characterVariant',
      media: 'avatarImage',
    },
    prepare({ title, isDefault, renderMode, characterVariant, media }) {
      const variantLabel = BUILT_IN_CHARACTER_OPTIONS.find((option) => option.value === characterVariant)?.title.split(' — ')[0]
      const modeLabel = renderMode === 'staticAsset' ? 'Uploaded finished avatar' : `Ready-made: ${variantLabel || 'Developer'}`
      return {
        title: `${title || 'Character'}${isDefault ? ' (Default)' : ''}`,
        subtitle: modeLabel,
        media,
      }
    },
  },
})
