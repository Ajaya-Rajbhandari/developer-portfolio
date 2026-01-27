import { defineField, defineType } from 'sanity'
import React from 'react'
import { IsActiveInput } from '../components/IsActiveInput'

export default defineType({
  name: 'personal',
  title: 'Personal Information',
  type: 'document',
  fieldsets: [
    {
      name: 'seo',
      title: 'SEO & Social Sharing',
      options: { collapsible: true, collapsed: false },
    },
  ],
  fields: [
    defineField({
      name: 'isActive',
      title: 'Use This Profile',
      type: 'boolean',
      description: 'Only one profile can be active at a time. Activating this will automatically deactivate others. This profile will be displayed on your portfolio.',
      initialValue: false,
      components: {
        input: IsActiveInput,
      },
      validation: (Rule) =>
        Rule.custom(async (value, context) => {
          const { document, getClient } = context
          
          // Skip validation if document or ID is missing
          if (!document?._id) {
            return true
          }
          
          const client = getClient({ apiVersion: '2024-01-01' })
          
          // If trying to deactivate (value is false), check if this is the only active profile
          if (value === false) {
            try {
              const otherActiveCount = await client.fetch(
                `count(*[_type == "personal" && isActive == true && _id != $currentId])`,
                { currentId: document._id }
              )
              
              if (otherActiveCount === 0) {
                return 'Cannot deactivate: This is the only active profile. At least one profile must remain active.'
              }
            } catch (error) {
              // If there's an error fetching, allow the change
              console.error('Error validating isActive:', error)
              return true
            }
          }
          
          return true
        }),
    }),
    defineField({
      name: 'name',
      title: 'Full Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'designation',
      title: 'Designation',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'About Me',
      type: 'text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'profileImage',
      title: 'Profile Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'string',
    }),
    defineField({
      name: 'github',
      title: 'GitHub URL',
      type: 'url',
    }),
    defineField({
      name: 'linkedIn',
      title: 'LinkedIn URL',
      type: 'url',
    }),
    defineField({
      name: 'twitter',
      title: 'Twitter URL',
      type: 'url',
    }),
    defineField({
      name: 'facebook',
      title: 'Facebook URL',
      type: 'url',
    }),
    defineField({
      name: 'resume',
      title: 'Resume URL',
      type: 'url',
    }),
    defineField({
      name: 'metaTitle',
      title: 'Meta Title (SEO)',
      type: 'string',
      description: 'Defaults to name if empty',
      fieldset: 'seo',
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description (SEO)',
      type: 'text',
      rows: 3,
      description: 'Short summary for search and social previews',
      fieldset: 'seo',
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Used for social sharing previews',
      fieldset: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'designation',
      media: 'profileImage',
      isActive: 'isActive',
    },
    prepare({ title, subtitle, media, isActive }) {
      return {
        title: `${title}${isActive ? ' (Active)' : ''}`,
        subtitle,
        media,
      }
    },
  },
})
