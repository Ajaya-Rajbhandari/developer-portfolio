import { getProjects, getArticles, getArticleBySlug, getSkills, getExperiences, getPersonalData } from './sanity.queries'
import { urlFor } from './sanity.image'
import { projectsData } from '@/utils/data/projects-data'
import { articlesData } from '@/utils/data/articles-data'
import { skillsData } from '@/utils/data/skills'
import { experiences } from '@/utils/data/experience'
import { personalData } from '@/utils/data/personal-data'

type SlugValue = {
  current?: string
}

type SanityProject = {
  _id?: string
  name?: string
  slug?: SlugValue
  metaTitle?: string
  metaDescription?: string
  ogImage?: string
  description?: string
  problem?: string
  outcome?: string
  tools?: string[]
  role?: string
  code?: string
  demo?: string
  image?: string
  featured?: boolean
}

type SanityArticle = {
  _id?: string
  title?: string
  slug?: SlugValue
  summary?: string
  tags?: string[]
  status?: 'planned' | 'draft' | 'published'
  url?: string
  publishedAt?: string
  featured?: boolean
  coverImage?: string
  hasBody?: boolean
  body?: unknown[]
}

type SanitySkill = {
  name: string
}

type SanityExperience = {
  _id?: string
  title?: string
  company?: string
  duration?: string
}

type LabelValue = {
  label?: string
  value?: string
}

type NavLabels = {
  home?: string
  about?: string
  skills?: string
  projects?: string
  writing?: string
  contact?: string
}

type AvailabilityStatus = 'freelance' | 'fullTime' | 'internship' | 'collaboration' | 'selectedProjects' | 'busy' | 'notAvailable'

const AVAILABILITY_LABELS: Record<AvailabilityStatus, string> = {
  freelance: 'Available for freelance',
  fullTime: 'Open to full-time roles',
  internship: 'Open to internships',
  collaboration: 'Open to collaboration',
  selectedProjects: 'Available for selected projects',
  busy: 'Currently busy',
  notAvailable: 'Not available',
}

const normalizeAvailabilityStatus = (value: unknown): AvailabilityStatus => {
  return value === 'fullTime' ||
    value === 'internship' ||
    value === 'collaboration' ||
    value === 'selectedProjects' ||
    value === 'busy' ||
    value === 'notAvailable' ||
    value === 'freelance'
    ? value
    : 'freelance'
}

type SanityPersonalData = {
  name?: string
  metaTitle?: string
  metaDescription?: string
  description?: string
  ogImage?: string
  profileImage?: string
  profileImageRef?: Parameters<typeof urlFor>[0]
  designation?: string
  email?: string
  phone?: string
  address?: string
  github?: string
  facebook?: string
  linkedIn?: string
  twitter?: string
  resume?: string
  availabilityStatus?: AvailabilityStatus
  availabilityLabel?: string
  availabilityNote?: string
  heroEyebrow?: string
  heroSubtitle?: string
  heroSummary?: string
  primaryCtaLabel?: string
  secondaryCtaLabel?: string
  resumeCtaLabel?: string
  featuredWorkLabel?: string
  aboutSectionTitle?: string
  aboutHighlights?: LabelValue[]
  aboutBringTitle?: string
  aboutBringItems?: string[]
  skillsSectionTitle?: string
  skillsCountSuffix?: string
  experienceSectionTitle?: string
  projectsEyebrow?: string
  projectsSectionTitle?: string
  projectsSectionDescription?: string
  projectsCountLabel?: string
  writingEyebrow?: string
  writingSectionTitle?: string
  writingSectionDescription?: string
  writingBadgeLabel?: string
  contactEyebrow?: string
  contactTitle?: string
  contactDescription?: string
  contactCards?: LabelValue[]
  emailCtaLabel?: string
  navLabels?: NavLabels
  footerText?: string
  footerOwnerName?: string
  footerLink?: string
  activeCharacter?: {
    _id?: string
    title?: string
    renderMode?: 'animatedRig' | 'staticAsset'
    characterVariant?: 'developer' | 'creator' | 'minimal' | 'explorer' | 'techLead' | 'aiBuilder'
    personality?: 'friendly' | 'professional' | 'playful' | 'calm'
    message?: string
    avatarImage?: string
    avatarSvg?: string
  } | null
}

type PersonJsonLdInput = {
  name?: string
  designation?: string
  description?: string
  email?: string
  address?: string
  github?: string
  linkedIn?: string
  ogImage?: string
  profile?: string
}

type ProjectJsonLdInput = {
  name?: string
  metaDescription?: string
  description?: string
  demo?: string
  code?: string
  ogImage?: string
  image?: string
}

// Check if Sanity is configured
const isSanityConfigured = () => {
  return !!(
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID &&
    process.env.NEXT_PUBLIC_SANITY_DATASET
  )
}

// Fetch projects - use Sanity if configured, otherwise use local data
export async function fetchProjects() {
  if (isSanityConfigured()) {
    try {
      const projects = await getProjects()
      if (projects && projects.length > 0) {
        return (projects as SanityProject[]).map((project, index: number) => {
          const name = project.name || 'Untitled Project'
          const description = project.description || 'Project details coming soon.'

          return {
            id: project._id || index + 1,
            name,
            slug: project.slug?.current || '',
            metaTitle: project.metaTitle || name,
            metaDescription: project.metaDescription || description,
            ogImage: project.ogImage || project.image || '/vercel.svg',
            description,
            problem: project.problem || '',
            outcome: project.outcome || '',
            tools: Array.isArray(project.tools) ? project.tools : [],
            role: project.role || 'Developer',
            code: project.code || '',
            demo: project.demo || '',
            image: project.image || '/vercel.svg',
            featured: !!project.featured,
          }
        })
      }
    } catch (error) {
      console.error('Error fetching projects from Sanity:', error)
    }
  } else {
    console.log('Sanity not configured, using local data')
  }
  
  // Fallback to local data
  return projectsData
}

// Fetch articles - use Sanity if configured, otherwise use local fallback notes
export async function fetchArticles() {
  if (isSanityConfigured()) {
    try {
      const articles = await getArticles()
      if (articles && articles.length > 0) {
        return (articles as SanityArticle[]).map((article, index: number) => ({
          id: article._id || index + 1,
          title: article.title || 'Untitled Article',
          slug: article.slug?.current || '',
          summary: article.summary || 'Article summary coming soon.',
          tags: Array.isArray(article.tags) ? article.tags : [],
          status: article.status || 'planned',
          url: article.url || '',
          publishedAt: article.publishedAt || '',
          featured: !!article.featured,
          coverImage: article.coverImage || '',
          hasBody: !!article.hasBody,
        }))
      }
    } catch (error) {
      console.error('Error fetching articles from Sanity:', error)
    }
  }

  return articlesData
}

// Fetch a single article (with full body) by its slug, for the /writing/[slug] page.
export async function fetchArticleBySlug(slug: string) {
  if (!slug) return null

  if (isSanityConfigured()) {
    try {
      const article = (await getArticleBySlug(slug)) as SanityArticle | null
      if (article) {
        return {
          id: article._id || slug,
          title: article.title || 'Untitled Article',
          slug: article.slug?.current || slug,
          summary: article.summary || '',
          tags: Array.isArray(article.tags) ? article.tags : [],
          status: article.status || 'planned',
          url: article.url || '',
          publishedAt: article.publishedAt || '',
          featured: !!article.featured,
          coverImage: article.coverImage || '',
          body: Array.isArray(article.body) ? article.body : [],
        }
      }
    } catch (error) {
      console.error('Error fetching article by slug from Sanity:', error)
    }
  }

  // Fallback: match against local notes (no rich body available)
  const local = articlesData.find((a) => a.id === slug)
  if (!local) return null
  return {
    id: local.id,
    title: local.title,
    slug: local.id,
    summary: local.summary,
    tags: local.tags,
    status: local.status,
    url: local.url,
    publishedAt: '',
    featured: !!local.featured,
    coverImage: '',
    body: [] as unknown[],
  }
}

// Fetch skills - use Sanity if configured, otherwise use local data
export async function fetchSkills() {
  if (isSanityConfigured()) {
    try {
      const skills = await getSkills()
      if (skills && skills.length > 0) {
        return (skills as SanitySkill[]).map((skill) => skill.name)
      }
    } catch (error) {
      console.error('Error fetching skills from Sanity:', error)
    }
  }
  
  // Fallback to local data
  return skillsData
}

// Fetch experiences - use Sanity if configured, otherwise use local data
export async function fetchExperiences() {
  if (isSanityConfigured()) {
    try {
      const exps = await getExperiences()
      if (exps && exps.length > 0) {
        return (exps as SanityExperience[]).map((exp, index: number) => ({
          id: exp._id || index + 1,
          title: exp.title || 'Experience',
          company: exp.company || 'Independent / Personal Project',
          duration: exp.duration || 'Present',
        }))
      }
    } catch (error) {
      console.error('Error fetching experiences from Sanity:', error)
    }
  }
  
  // Fallback to local data
  return experiences
}

// Fetch personal data - use Sanity if configured, otherwise use local data
export async function fetchPersonalData() {
  if (isSanityConfigured()) {
    try {
      const data = (await getPersonalData()) as SanityPersonalData | null
      if (data) {
        // Build high-quality profile image URL using Sanity's image builder
        let profileUrl = data.profileImage || '/profile.png'
        if (data.profileImageRef) {
          profileUrl = urlFor(data.profileImageRef)
            .width(3000)
            .quality(100)
            .format('jpg')
            .url()
        }
        
        const name = data.name || 'Portfolio Owner'
        const designation = data.designation || 'Front-End Developer'
        const description = data.description || 'I build responsive, accessible web experiences with clean interfaces and practical user flows.'
        const availabilityStatus = normalizeAvailabilityStatus(data.availabilityStatus)
        const availabilityLabel = data.availabilityLabel?.trim() || AVAILABILITY_LABELS[availabilityStatus]
        const availabilityNote = data.availabilityNote?.trim() || ''
        const cleanCards = (items: LabelValue[] | undefined, fallback: Required<LabelValue>[]) => {
          const validItems = Array.isArray(items)
            ? items.filter((item) => item?.label && item?.value).map((item) => ({ label: item.label || '', value: item.value || '' }))
            : []
          return validItems.length > 0 ? validItems : fallback
        }
        const cleanList = (items: string[] | undefined, fallback: string[]) => {
          const validItems = Array.isArray(items) ? items.filter(Boolean) : []
          return validItems.length > 0 ? validItems : fallback
        }

        return {
          name,
          metaTitle: data.metaTitle || `${name} | ${designation}`,
          metaDescription: data.metaDescription || description,
          ogImage: data.ogImage || profileUrl || '/profile.png',
          profile: profileUrl,
          designation,
          description,
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
          github: data.github || '',
          facebook: data.facebook || '',
          linkedIn: data.linkedIn || '',
          twitter: data.twitter || '',
          stackOverflow: '',
          leetcode: '',
          devUsername: '',
          resume: data.resume || '',
          availabilityStatus,
          availabilityLabel,
          availabilityNote,
          heroEyebrow: data.heroEyebrow || availabilityLabel,
          heroSubtitle: data.heroSubtitle || `${designation} building fast, responsive web applications with React, Next.js, and modern JavaScript.`,
          heroSummary: data.heroSummary || `${description.split('.').slice(0, 2).join('.')}.`,
          primaryCtaLabel: data.primaryCtaLabel || 'Get In Touch',
          secondaryCtaLabel: data.secondaryCtaLabel || 'View Projects',
          resumeCtaLabel: data.resumeCtaLabel || 'Resume',
          featuredWorkLabel: data.featuredWorkLabel || 'Featured work',
          aboutSectionTitle: data.aboutSectionTitle || 'About Me',
          aboutHighlights: cleanCards(data.aboutHighlights, [
            { label: 'Focus', value: 'Responsive web apps' },
            { label: 'Strength', value: 'Clear problem solving' },
            { label: 'Approach', value: 'Clean, practical delivery' },
          ]),
          aboutBringTitle: data.aboutBringTitle || 'What I bring',
          aboutBringItems: cleanList(data.aboutBringItems, [
            'Frontend foundations in JavaScript, TypeScript, React, Next.js, and accessible UI patterns.',
            'Backend awareness with Node.js, databases, APIs, and deployment-focused thinking.',
            'Teaching and leadership experience that helps me explain trade-offs, document decisions, and collaborate well.',
          ]),
          skillsSectionTitle: data.skillsSectionTitle || 'Tech Stack',
          skillsCountSuffix: data.skillsCountSuffix || 'skills',
          experienceSectionTitle: data.experienceSectionTitle || 'Experience',
          projectsEyebrow: data.projectsEyebrow || 'Selected case studies',
          projectsSectionTitle: data.projectsSectionTitle || 'Featured Projects',
          projectsSectionDescription: data.projectsSectionDescription || 'A closer look at projects where I practiced turning a clear problem into a usable interface, with attention to role, stack, implementation choices, and outcome.',
          projectsCountLabel: data.projectsCountLabel || 'projects · frontend logic · responsive UI',
          writingEyebrow: data.writingEyebrow || 'Writing & learning notes',
          writingSectionTitle: data.writingSectionTitle || 'Articles',
          writingSectionDescription: data.writingSectionDescription || 'Short, practical notes about frontend development, JavaScript concepts, UI decisions, and lessons learned while building projects.',
          writingBadgeLabel: data.writingBadgeLabel || 'Planned content',
          contactEyebrow: data.contactEyebrow || availabilityLabel,
          contactTitle: data.contactTitle || `Let's build a fast, user-friendly web experience.`,
          contactDescription: data.contactDescription || availabilityNote || `Have a project, internship opportunity, or frontend idea in mind? Send a short message about your goal, timeline, and the best way to reach you. I'll respond through email as my primary contact channel.`,
          contactCards: cleanCards(data.contactCards, [
            { label: 'Availability', value: availabilityLabel },
            { label: 'Preferred contact', value: 'Email' },
            { label: 'Response', value: 'As soon as possible' },
          ]),
          emailCtaLabel: data.emailCtaLabel || 'Email Me',
          navLabels: {
            home: data.navLabels?.home || 'Home',
            about: data.navLabels?.about || 'About',
            skills: data.navLabels?.skills || 'Skills',
            projects: data.navLabels?.projects || 'Projects',
            writing: data.navLabels?.writing || 'Writing',
            contact: data.navLabels?.contact || 'Contact',
          },
          footerText: data.footerText || 'Portfolio by',
          footerOwnerName: data.footerOwnerName || name,
          footerLink: data.footerLink || data.github || data.linkedIn || '',
          activeCharacter: data.activeCharacter
            ? {
                id: data.activeCharacter._id || '',
                title: data.activeCharacter.title || 'Selected character',
                renderMode: data.activeCharacter.renderMode || 'animatedRig',
                characterVariant: data.activeCharacter.characterVariant || 'developer',
                personality: data.activeCharacter.personality || 'friendly',
                message: data.activeCharacter.message || 'Drag me across the screen!',
                avatarSvg: data.activeCharacter.avatarSvg || '',
                avatarImage: data.activeCharacter.avatarImage || '',
              }
            : null,
        }
      }
    } catch (error) {
      console.error('Error fetching personal data from Sanity:', error)
    }
  }
  
  // Fallback to local data
  return personalData
}

export function buildPersonJsonLd(data: PersonJsonLdInput | null) {
  if (!data) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: data.name,
    jobTitle: data.designation,
    description: data.description,
    email: data.email,
    address: data.address,
    url: data.github || data.linkedIn || '',
    image: data.ogImage || data.profile,
  }
}

export function buildProjectJsonLd(project: ProjectJsonLdInput | null) {
  if (!project) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.name,
    description: project.metaDescription || project.description,
    url: project.demo || project.code || '',
    image: project.ogImage || project.image,
  }
}
