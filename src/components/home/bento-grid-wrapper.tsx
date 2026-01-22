import { fetchProjects, fetchSkills, fetchExperiences, fetchPersonalData } from '@/lib/data'
import BentoGrid from './bento-grid'

export default async function BentoGridWrapper() {
  const [projects, skills, experiences, personalData] = await Promise.all([
    fetchProjects(),
    fetchSkills(),
    fetchExperiences(),
    fetchPersonalData(),
  ])

  return (
    <BentoGrid
      projects={projects}
      skills={skills}
      experiences={experiences}
      personalData={personalData}
    />
  )
}
