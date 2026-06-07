import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'avatarPart',
  title: 'Avatar Part',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'kind',
      title: 'Kind',
      type: 'string',
      options: {
        list: [
          { title: 'Head', value: 'head' },
          { title: 'Hair', value: 'hair' },
          { title: 'Eyes', value: 'eyes' },
          { title: 'Mouth', value: 'mouth' },
          { title: 'Body', value: 'body' },
          { title: 'Legs', value: 'legs' },
        ],
      },
    }),
    defineField({
      name: 'preview',
      title: 'Preview',
      type: 'image',
    }),
    defineField({
      name: 'svg',
      title: 'SVG',
      type: 'file',
    }),
    defineField({
      name: 'requiredIds',
      title: 'Required SVG IDs',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'defaultTransform',
      title: 'Default Transform',
      type: 'object',
      fields: [
        defineField({ name: 'x', title: 'X', type: 'number' }),
        defineField({ name: 'y', title: 'Y', type: 'number' }),
        defineField({ name: 'scale', title: 'Scale', type: 'number' }),
        defineField({ name: 'rotate', title: 'Rotate', type: 'number' }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'kind',
      media: 'preview',
    },
  },
})
