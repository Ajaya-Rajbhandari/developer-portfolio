import groq from 'groq'
import { client } from './sanity.client'

export async function getProjects() {
  return client.fetch(
    groq`*[_type == "project"] | order(order asc) {
      _id,
      name,
      slug,
      description,
      problem,
      outcome,
      "image": image.asset->url,
      metaTitle,
      metaDescription,
      "ogImage": ogImage.asset->url,
      tools,
      role,
      demo,
      code,
      featured,
      order
    }`
  )
}

export async function getArticles() {
  return client.fetch(
    groq`*[_type == "article"] | order(order asc, publishedAt desc) {
      _id,
      title,
      slug,
      summary,
      tags,
      status,
      url,
      publishedAt,
      featured,
      order
    }`
  )
}

export async function getSkills() {
  return client.fetch(
    groq`*[_type == "skill"] | order(order asc) {
      _id,
      name,
      category,
      order
    }`
  )
}

export async function getExperiences() {
  return client.fetch(
    groq`*[_type == "experience"] | order(order asc) {
      _id,
      title,
      company,
      duration,
      startDate,
      endDate,
      description,
      order
    }`
  )
}

const usableCharacterFilter = groq`(
  (renderMode == "animatedRig" && defined(characterVariant)) ||
  (
    renderMode == "staticAsset" &&
    (defined(avatarImage.asset) || defined(avatarSvg.asset))
  )
)`

const personalDataProjection = groq`{
  _id,
  name,
  designation,
  description,
  "profileImage": profileImage.asset->url,
  "profileImageRef": profileImage.asset,
  metaTitle,
  metaDescription,
  "ogImage": ogImage.asset->url,
  email,
  phone,
  address,
  github,
  linkedIn,
  twitter,
  facebook,
  resume,
  availabilityStatus,
  availabilityLabel,
  availabilityNote,
  heroEyebrow,
  heroSubtitle,
  heroSummary,
  primaryCtaLabel,
  secondaryCtaLabel,
  resumeCtaLabel,
  featuredWorkLabel,
  aboutSectionTitle,
  aboutHighlights,
  aboutBringTitle,
  aboutBringItems,
  skillsSectionTitle,
  skillsCountSuffix,
  experienceSectionTitle,
  projectsEyebrow,
  projectsSectionTitle,
  projectsSectionDescription,
  projectsCountLabel,
  writingEyebrow,
  writingSectionTitle,
  writingSectionDescription,
  writingBadgeLabel,
  contactEyebrow,
  contactTitle,
  contactDescription,
  contactCards,
  emailCtaLabel,
  navLabels,
  footerText,
  footerOwnerName,
  footerLink,
  "activeCharacter": coalesce(
    *[
      _type == "character" &&
      _id == ^.activeCharacter._ref &&
      ${usableCharacterFilter}
    ][0] {
      _id,
      title,
      renderMode,
      characterVariant,
      personality,
      message,
      "avatarImage": avatarImage.asset->url,
      "avatarSvg": avatarSvg.asset->url
    },
    *[
      _type == "character" &&
      isDefault == true &&
      ${usableCharacterFilter}
    ] | order(_updatedAt desc)[0] {
      _id,
      title,
      renderMode,
      characterVariant,
      personality,
      message,
      "avatarImage": avatarImage.asset->url,
      "avatarSvg": avatarSvg.asset->url
    },
    *[
      _type == "character" &&
      ${usableCharacterFilter}
    ] | order(_updatedAt desc)[0] {
      _id,
      title,
      renderMode,
      characterVariant,
      personality,
      message,
      "avatarImage": avatarImage.asset->url,
      "avatarSvg": avatarSvg.asset->url
    }
  )
}`

export async function getPersonalData() {
  // Get the first active profile (ordered by creation date for consistency)
  const activeProfile = await client.fetch(
    groq`*[_type == "personal" && isActive == true] | order(_createdAt asc) [0] ${personalDataProjection}`
  )
  
  // If no active profile, fall back to the most recently created one
  if (activeProfile) {
    return activeProfile
  }
  
  return client.fetch(
    groq`*[_type == "personal"] | order(_createdAt desc) [0] ${personalDataProjection}`
  )
}
