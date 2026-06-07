import { defineField, defineType } from 'sanity'
import { IsActiveInput } from '../components/IsActiveInput'

export default defineType({
  name: 'personal',
  title: 'Personal Information',
  type: 'document',
  fieldsets: [
    {
      name: 'availability',
      title: 'Availability & Status',
      options: { collapsible: true, collapsed: false },
    },
    {
      name: 'homepageHero',
      title: 'Homepage Hero',
      options: { collapsible: true, collapsed: false },
    },
    {
      name: 'homepageAbout',
      title: 'Homepage About',
      options: { collapsible: true, collapsed: true },
    },
    {
      name: 'sectionCopy',
      title: 'Section Headings & Labels',
      options: { collapsible: true, collapsed: true },
    },
    {
      name: 'contactSection',
      title: 'Contact Section',
      options: { collapsible: true, collapsed: true },
    },
    {
      name: 'navigationFooter',
      title: 'Navigation & Footer',
      options: { collapsible: true, collapsed: true },
    },
    {
      name: 'seo',
      title: 'SEO & Social Sharing',
      options: { collapsible: true, collapsed: true },
    },
  ],
  fields: [
    defineField({
      name: 'isActive',
      title: 'Use This Profile',
      type: 'boolean',
      description: 'Only one profile can be active at a time. Activating this will automatically deactivate others. This profile will be displayed on your portfolio.',
      initialValue: true,
      components: {
        input: IsActiveInput,
      },
      validation: (Rule) =>
        Rule.custom(async (value, context) => {
          const { document, getClient } = context

          if (value !== false || !document?._id) {
            return true
          }

          const client = getClient({ apiVersion: '2024-01-01' })
          const baseId = document._id.replace(/^drafts\./, '')
          const idsToExclude = [baseId, `drafts.${baseId}`]

          try {
            const { otherActiveCount, currentPublishedIsActive, currentDraftIsActive } = await client.fetch(
              `{
                "otherActiveCount": count(*[_type == "personal" && isActive == true && !(_id in $idsToExclude)]),
                "currentPublishedIsActive": *[_id == $baseId][0].isActive,
                "currentDraftIsActive": *[_id == $draftId][0].isActive
              }`,
              { baseId, draftId: `drafts.${baseId}`, idsToExclude }
            )

            const currentDocumentIsAlreadyActive = currentPublishedIsActive === true || currentDraftIsActive === true

            if (currentDocumentIsAlreadyActive && otherActiveCount === 0) {
              return 'Cannot deactivate: This is the only active profile. Activate another profile first.'
            }
          } catch (error) {
            console.error('Error validating isActive:', error)
            return true
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
      name: 'activeCharacter',
      title: 'Active Character',
      type: 'reference',
      to: [{ type: 'character' }],
      description: 'Controls the floating avatar on the portfolio. Select a Character that uses a ready-made style, or mark one Character as Default.'
    }),
    defineField({
      name: 'availabilityStatus',
      title: 'Availability Status',
      type: 'string',
      fieldset: 'availability',
      description: 'Choose the best current availability message for your hero and contact sections.',
      initialValue: 'freelance',
      options: {
        layout: 'radio',
        list: [
          { title: 'Available for freelance', value: 'freelance' },
          { title: 'Open to full-time roles', value: 'fullTime' },
          { title: 'Open to internships', value: 'internship' },
          { title: 'Open to collaboration', value: 'collaboration' },
          { title: 'Available for selected projects', value: 'selectedProjects' },
          { title: 'Currently busy', value: 'busy' },
          { title: 'Not available', value: 'notAvailable' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'availabilityLabel',
      title: 'Custom Availability Label',
      type: 'string',
      fieldset: 'availability',
      description: 'Optional. Overrides the selected status text on the website. Example: Available for freelance and collaboration.',
      validation: (Rule) => Rule.max(90).warning('Short labels work best in the hero badge.'),
    }),
    defineField({
      name: 'availabilityNote',
      title: 'Availability Note',
      type: 'text',
      rows: 2,
      fieldset: 'availability',
      description: 'Optional supporting note for the contact section. Example: Best suited for frontend builds, portfolio sites, and small business web apps.',
      validation: (Rule) => Rule.max(180).warning('Keep this note short and practical.'),
    }),
    defineField({
      name: 'heroEyebrow',
      title: 'Hero Eyebrow',
      type: 'string',
      fieldset: 'homepageHero',
      description: 'Small uppercase line above your name. Example: Available for web development projects.',
      validation: (Rule) => Rule.max(80).warning('Keep this short so the hero stays clean.'),
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'text',
      rows: 2,
      fieldset: 'homepageHero',
      description: 'Main one-sentence value proposition below your name. If empty, the site uses your designation plus a default sentence.',
      validation: (Rule) => Rule.max(180).warning('Aim for one strong sentence under 180 characters.'),
    }),
    defineField({
      name: 'heroSummary',
      title: 'Hero Short Summary',
      type: 'text',
      rows: 3,
      fieldset: 'homepageHero',
      description: 'Optional shorter supporting paragraph. If empty, the first two sentences of About Me are used.',
      validation: (Rule) => Rule.max(260).warning('Short summaries work best in the first screen.'),
    }),
    defineField({
      name: 'primaryCtaLabel',
      title: 'Primary CTA Label',
      type: 'string',
      fieldset: 'homepageHero',
      description: 'Main hero button text. Usually points to Contact.',
      validation: (Rule) => Rule.max(32),
    }),
    defineField({
      name: 'secondaryCtaLabel',
      title: 'Secondary CTA Label',
      type: 'string',
      fieldset: 'homepageHero',
      description: 'Second hero button text. Usually points to Projects.',
      validation: (Rule) => Rule.max(32),
    }),
    defineField({
      name: 'resumeCtaLabel',
      title: 'Resume CTA Label',
      type: 'string',
      fieldset: 'homepageHero',
      description: 'Text shown on resume buttons when a Resume URL is available.',
      validation: (Rule) => Rule.max(32),
    }),
    defineField({
      name: 'featuredWorkLabel',
      title: 'Featured Work Card Label',
      type: 'string',
      fieldset: 'homepageHero',
      description: 'Small label shown above featured project names in the hero.',
      validation: (Rule) => Rule.max(40),
    }),
    defineField({
      name: 'aboutSectionTitle',
      title: 'About Section Title',
      type: 'string',
      fieldset: 'homepageAbout',
      description: 'Heading for the About section.',
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: 'aboutHighlights',
      title: 'About Highlight Cards',
      type: 'array',
      fieldset: 'homepageAbout',
      description: 'Small proof/positioning cards shown under the About text. Recommended: 3 cards.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required().max(24) }),
            defineField({ name: 'value', title: 'Value', type: 'string', validation: (Rule) => Rule.required().max(80) }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'value' },
          },
        },
      ],
      validation: (Rule) => Rule.max(4).warning('More than 4 cards can crowd the layout.'),
    }),
    defineField({
      name: 'aboutBringTitle',
      title: 'What I Bring Title',
      type: 'string',
      fieldset: 'homepageAbout',
      description: 'Heading for the bullet list in the About section.',
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: 'aboutBringItems',
      title: 'What I Bring Items',
      type: 'array',
      fieldset: 'homepageAbout',
      description: 'Bullet points for strengths, working style, and technical focus. Recommended: 3 items.',
      of: [{ type: 'string' }],
      validation: (Rule) => Rule.max(5).warning('Keep this focused; 3 bullets is ideal.'),
    }),
    defineField({
      name: 'skillsSectionTitle',
      title: 'Skills Section Title',
      type: 'string',
      fieldset: 'sectionCopy',
      description: 'Heading above the skills/tech stack cards.',
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: 'skillsCountSuffix',
      title: 'Skills Count Suffix',
      type: 'string',
      fieldset: 'sectionCopy',
      description: 'Text after the skill count in each card. Example: skills.',
      validation: (Rule) => Rule.max(24),
    }),
    defineField({
      name: 'experienceSectionTitle',
      title: 'Experience Section Title',
      type: 'string',
      fieldset: 'sectionCopy',
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: 'projectsEyebrow',
      title: 'Projects Eyebrow',
      type: 'string',
      fieldset: 'sectionCopy',
      description: 'Small uppercase line above the Projects heading.',
      validation: (Rule) => Rule.max(70),
    }),
    defineField({
      name: 'projectsSectionTitle',
      title: 'Projects Section Title',
      type: 'string',
      fieldset: 'sectionCopy',
      validation: (Rule) => Rule.max(70),
    }),
    defineField({
      name: 'projectsSectionDescription',
      title: 'Projects Section Description',
      type: 'text',
      rows: 3,
      fieldset: 'sectionCopy',
      validation: (Rule) => Rule.max(260).warning('Keep section descriptions concise.'),
    }),
    defineField({
      name: 'projectsCountLabel',
      title: 'Projects Count Label',
      type: 'string',
      fieldset: 'sectionCopy',
      description: 'Text after the project count. Example: projects · frontend logic · responsive UI.',
      validation: (Rule) => Rule.max(80),
    }),
    defineField({
      name: 'writingEyebrow',
      title: 'Writing Eyebrow',
      type: 'string',
      fieldset: 'sectionCopy',
      validation: (Rule) => Rule.max(70),
    }),
    defineField({
      name: 'writingSectionTitle',
      title: 'Writing Section Title',
      type: 'string',
      fieldset: 'sectionCopy',
      validation: (Rule) => Rule.max(70),
    }),
    defineField({
      name: 'writingSectionDescription',
      title: 'Writing Section Description',
      type: 'text',
      rows: 3,
      fieldset: 'sectionCopy',
      validation: (Rule) => Rule.max(260),
    }),
    defineField({
      name: 'writingBadgeLabel',
      title: 'Writing Badge Label',
      type: 'string',
      fieldset: 'sectionCopy',
      description: 'Small pill label on the Writing section. Example: Planned content.',
      validation: (Rule) => Rule.max(40),
    }),
    defineField({
      name: 'contactEyebrow',
      title: 'Contact Eyebrow',
      type: 'string',
      fieldset: 'contactSection',
      validation: (Rule) => Rule.max(80),
    }),
    defineField({
      name: 'contactTitle',
      title: 'Contact Title',
      type: 'text',
      rows: 2,
      fieldset: 'contactSection',
      validation: (Rule) => Rule.max(150),
    }),
    defineField({
      name: 'contactDescription',
      title: 'Contact Description',
      type: 'text',
      rows: 4,
      fieldset: 'contactSection',
      validation: (Rule) => Rule.max(320),
    }),
    defineField({
      name: 'contactCards',
      title: 'Contact Info Cards',
      type: 'array',
      fieldset: 'contactSection',
      description: 'Small cards in the contact section. Recommended: 3 cards.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required().max(32) }),
            defineField({ name: 'value', title: 'Value', type: 'string', validation: (Rule) => Rule.required().max(90) }),
          ],
          preview: { select: { title: 'label', subtitle: 'value' } },
        },
      ],
      validation: (Rule) => Rule.max(4).warning('More than 4 cards can crowd the layout.'),
    }),
    defineField({
      name: 'emailCtaLabel',
      title: 'Email CTA Label',
      type: 'string',
      fieldset: 'contactSection',
      description: 'Text on the main email button.',
      validation: (Rule) => Rule.max(32),
    }),
    defineField({
      name: 'navLabels',
      title: 'Navigation Labels',
      type: 'object',
      fieldset: 'navigationFooter',
      description: 'Rename the visible navbar items without changing their links.',
      fields: [
        defineField({ name: 'home', title: 'Home', type: 'string', validation: (Rule) => Rule.max(20) }),
        defineField({ name: 'about', title: 'About', type: 'string', validation: (Rule) => Rule.max(20) }),
        defineField({ name: 'skills', title: 'Skills', type: 'string', validation: (Rule) => Rule.max(20) }),
        defineField({ name: 'projects', title: 'Projects', type: 'string', validation: (Rule) => Rule.max(20) }),
        defineField({ name: 'writing', title: 'Writing', type: 'string', validation: (Rule) => Rule.max(20) }),
        defineField({ name: 'contact', title: 'Contact', type: 'string', validation: (Rule) => Rule.max(20) }),
      ],
    }),
    defineField({
      name: 'footerText',
      title: 'Footer Text Prefix',
      type: 'string',
      fieldset: 'navigationFooter',
      description: 'Text before your linked name. Example: Portfolio by',
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: 'footerOwnerName',
      title: 'Footer Owner Name',
      type: 'string',
      fieldset: 'navigationFooter',
      description: 'Linked name shown in the footer. Defaults to Full Name.',
      validation: (Rule) => Rule.max(80),
    }),
    defineField({
      name: 'footerLink',
      title: 'Footer Link',
      type: 'url',
      fieldset: 'navigationFooter',
      description: 'URL used for the footer owner link. Defaults to GitHub, then LinkedIn.',
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
