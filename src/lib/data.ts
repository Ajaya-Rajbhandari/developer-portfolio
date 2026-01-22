import { getProjects, getSkills, getExperiences, getPersonalData } from './sanity.queries'
import { projectsData } from '@/utils/data/projects-data'
import { skillsData } from '@/utils/data/skills'
import { experiences } from '@/utils/data/experience'
import { personalData } from '@/utils/data/personal-data'

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
      console.log('Fetching projects from Sanity...')
      const projects = await getProjects()
      console.log('Sanity projects fetched:', projects?.length || 0)
      if (projects && projects.length > 0) {
        return projects.map((project: any, index: number) => ({
          id: project._id || index + 1,
          name: project.name,
          description: project.description,
          tools: project.tools || [],
          role: project.role || '',
          code: project.code || '',
          demo: project.demo || '',
          image: project.image || '/vercel.svg',
        }))
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

// Fetch skills - use Sanity if configured, otherwise use local data
export async function fetchSkills() {
  if (isSanityConfigured()) {
    try {
      const skills = await getSkills()
      if (skills && skills.length > 0) {
        return skills.map((skill: any) => skill.name)
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
        return exps.map((exp: any, index: number) => ({
          id: exp._id || index + 1,
          title: exp.title,
          company: exp.company,
          duration: exp.duration,
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
      const data = await getPersonalData()
      if (data) {
        return {
          name: data.name,
          profile: data.profileImage || '/profile.png',
          designation: data.designation,
          description: data.description,
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
        }
      }
    } catch (error) {
      console.error('Error fetching personal data from Sanity:', error)
    }
  }
  
  // Fallback to local data
  return personalData
}
