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
    }
  `
  )
}

export async function getArticles() {
  return client.fetch(
    groq`*[_type == "article"] | order(featured desc, publishedAt desc, _createdAt desc) {
      _id,
      title,
      slug,
      summary,
      tags,
      status,
      url,
      publishedAt,
      featured,
      "coverImage": coverImage.asset->url,
      "hasBody": count(body) > 0,
    }
  `
  )
}

export async function getArticleBySlug(slug: string) {
  return client.fetch(
    groq`*[_type == "article" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      summary,
      tags,
      status,
      url,
      publishedAt,
      featured,
      "coverImage": coverImage.asset->url,
      body[]{
        ...,
        _type == "image" => {
          ...,
          "url": asset->url,
        }
      },
    }`,
    { slug }
  )
}

export async function getSkills() {
  return client.fetch(
    groq`*[_type == "skill"] | order(order asc, name asc) {
      _id,
      name,
    }
  `
  )
}

export async function getExperiences() {
  return client.fetch(
    groq`*[_type == "experience"] | order(order asc, _createdAt desc) {
      _id,
      title,
      company,
      duration,
    }
  `
  )
}

export async function getPersonalData() {
  return client.fetch(
    groq`*[_type == "personal" && isActive == true][0] {
      name,
      metaTitle,
      metaDescription,
      description,
      "ogImage": ogImage.asset->url,
      "profileImage": profileImage.asset->url,
      "profileImageRef": profileImage,
      designation,
      email,
      phone,
      address,
      github,
      facebook,
      linkedIn,
      twitter,
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
      activeCharacter->{
        _id,
        title,
        renderMode,
        characterVariant,
        personality,
        message,
        "avatarImage": avatarImage.asset->url,
        avatarSvg,
      },
    }`
  )
}
