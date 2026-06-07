import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 3,
      description: 'A short, portfolio-friendly summary shown on the homepage.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Optional banner shown on the article page and listing card.',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      description: 'The full article content shown on its own page (/writing/your-slug).',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              title: 'Alt text',
              type: 'string',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Planned', value: 'planned' },
          { title: 'Draft', value: 'draft' },
          { title: 'Published', value: 'published' },
        ],
        layout: 'radio',
      },
      initialValue: 'planned',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'External URL',
      type: 'url',
      description: 'Optional. If set (and there is no Body content), the card links to this external link instead of an on-site page.',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      hidden: ({ parent }) => parent?.status !== 'published',
    }),
    defineField({
      name: 'featured',
      title: 'Featured Article',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'status',
    },
    prepare({ title, subtitle }) {
      return {
        title,
        subtitle: subtitle ? `Status: ${subtitle}` : 'Article',
      }
    },
  },
})
