import groq from 'groq'
import { client } from './sanity.client'

export async function getProjects() {
  return client.fetch(
    groq`*[_type == "project"] | order(order asc) {
      _id,
      name,
      slug,
      description,
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

export async function getPersonalData() {
  // Get the first active profile (ordered by creation date for consistency)
  const activeProfile = await client.fetch(
    groq`*[_type == "personal" && isActive == true] | order(_createdAt asc) [0] {
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
      resume
    }`
  )
  
  // If no active profile, fall back to the most recently created one
  if (activeProfile) {
    return activeProfile
  }
  
  return client.fetch(
    groq`*[_type == "personal"] | order(_createdAt desc) [0] {
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
      resume
    }`
  )
}
