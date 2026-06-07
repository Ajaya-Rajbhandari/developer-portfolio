import { fetchProjects, fetchArticles, fetchSkills, fetchExperiences, fetchPersonalData } from '@/lib/data'
import BentoGrid from './bento-grid'

export default async function BentoGridWrapper() {
  const [projects, articles, skills, experiences, personalData] = await Promise.all([
    fetchProjects(),
    fetchArticles(),
    fetchSkills(),
    fetchExperiences(),
    fetchPersonalData(),
  ])

  return (
    <BentoGrid
      projects={projects}
      articles={articles}
      skills={skills}
      experiences={experiences}
      personalData={personalData}
    />
  )
}
