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
  return client.fetch(
    groq`*[_type == "personal"][0] {
      _id,
      name,
      designation,
      description,
      "profileImage": profileImage.asset->url,
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
