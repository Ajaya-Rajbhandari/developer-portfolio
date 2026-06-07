"use client";

import Image from "next/image";
import { motion as baseMotion } from "framer-motion";
import dynamic from "next/dynamic";
import { Card } from "@/components/ui/card";
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope, FaDownload, FaExternalLinkAlt, FaCode } from "react-icons/fa";
import FloatingAvatar, { MouthExpression } from "./floating-avatar";

type LocalMotionProps = {
  initial?: Record<string, unknown>;
  animate?: Record<string, unknown>;
  whileInView?: Record<string, unknown>;
  whileHover?: Record<string, unknown>;
  transition?: Record<string, unknown>;
  viewport?: Record<string, unknown>;
};

type MotionDivProps = React.ComponentProps<typeof baseMotion.div> & LocalMotionProps;
type MotionSectionProps = React.ComponentProps<typeof baseMotion.section> & LocalMotionProps;
type MotionHeadingProps = React.ComponentProps<typeof baseMotion.h1> & LocalMotionProps;
type MotionParagraphProps = React.ComponentProps<typeof baseMotion.p> & LocalMotionProps;

const motion = {
  ...baseMotion,
  div: baseMotion.div as React.ComponentType<MotionDivProps>,
  section: baseMotion.section as React.ComponentType<MotionSectionProps>,
  h1: baseMotion.h1 as React.ComponentType<MotionHeadingProps>,
  p: baseMotion.p as React.ComponentType<MotionParagraphProps>,
};

const HeroAccent = dynamic(() => import("../three/hero-accent"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-6 rounded-3xl bg-gradient-to-br from-primary-accent/30 via-secondary-accent/20 to-transparent blur-2xl" />
  ),
});

interface Project {
  id: number | string;
  name: string;
  description: string;
  problem?: string;
  outcome?: string;
  tools: string[];
  role: string;
  code: string;
  demo: string;
  image: string;
  featured?: boolean;
}

interface Experience {
  id: number | string;
  title: string;
  company: string;
  duration: string;
}

interface Article {
  id: number | string;
  title: string;
  summary: string;
  tags: string[];
  status: string;
  url: string;
  featured?: boolean;
}

interface ActiveCharacterAvatar {
  id?: string;
  title?: string;
  renderMode?: 'animatedRig' | 'staticAsset';
  characterVariant?: 'developer' | 'creator' | 'minimal' | 'explorer' | 'techLead' | 'aiBuilder';
  personality?: 'friendly' | 'professional' | 'playful' | 'calm';
  message?: string;
  avatarSvg?: string;
  avatarImage?: string;
}

type LabelValue = {
  label: string;
  value: string;
};

type NavLabels = {
  home: string;
  about: string;
  skills: string;
  projects: string;
  writing: string;
  contact: string;
};

interface PersonalData {
  name: string;
  profile: string;
  designation: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  github: string;
  linkedIn: string;
  twitter: string;
  resume: string;
  heroEyebrow: string;
  heroSubtitle: string;
  heroSummary: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
  resumeCtaLabel: string;
  featuredWorkLabel: string;
  aboutSectionTitle: string;
  aboutHighlights: LabelValue[];
  aboutBringTitle: string;
  aboutBringItems: string[];
  skillsSectionTitle: string;
  skillsCountSuffix: string;
  experienceSectionTitle: string;
  projectsEyebrow: string;
  projectsSectionTitle: string;
  projectsSectionDescription: string;
  projectsCountLabel: string;
  writingEyebrow: string;
  writingSectionTitle: string;
  writingSectionDescription: string;
  writingBadgeLabel: string;
  contactEyebrow: string;
  contactTitle: string;
  contactDescription: string;
  contactCards: LabelValue[];
  emailCtaLabel: string;
  navLabels: NavLabels;
  footerText: string;
  footerOwnerName: string;
  footerLink: string;
  activeCharacter?: ActiveCharacterAvatar | null;
}

interface BentoGridProps {
  projects: Project[];
  articles: Article[];
  skills: string[];
  experiences: Experience[];
  personalData: PersonalData;
}

const buildOptimizedUrl = (src: string | undefined, width = 1200, quality = 90) => {
  if (!src) return "/vercel.svg";
  if (src.includes("cdn.sanity.io")) {
    return `${src}?auto=format&w=${width}&q=${quality}`;
  }
  return src;
};

const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    const navbarHeight = 80;
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - navbarHeight;
    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }
};

type SkillCategory = {
  label: string;
  skills: string[];
};

const groupSkills = (skills: string[]): SkillCategory[] => {
  const categories: { label: string; keywords: string[] }[] = [
    { label: "Frontend", keywords: ["html", "css", "javascript", "typescript", "react", "next", "tailwind", "bootstrap", "materialui", "material ui"] },
    { label: "Backend", keywords: ["node", "express", "go", "strapi"] },
    { label: "Databases", keywords: ["mongo", "mysql", "postgres", "postgresql", "firebase"] },
    { label: "Cloud & DevOps", keywords: ["aws", "docker", "nginx"] },
    { label: "Tools & Design", keywords: ["git", "figma"] },
  ];

  const normalized = skills.map((s) => ({ raw: s, key: s.toLowerCase() }));
  const bucket: Record<string, string[]> = {};
  categories.forEach((cat) => (bucket[cat.label] = []));
  bucket["Other"] = [];

  normalized.forEach(({ raw, key }) => {
    const match = categories.find((cat) => cat.keywords.some((kw) => key.includes(kw)));
    if (match) {
      bucket[match.label].push(raw);
    } else {
      bucket["Other"].push(raw);
    }
  });

  const grouped = categories
    .map(({ label }) => ({ label, skills: bucket[label] }))
    .filter((c) => c.skills.length > 0);

  if (bucket["Other"].length > 0) {
    grouped.push({ label: "Other", skills: bucket["Other"] });
  }

  return grouped;
};

const setAvatarMood = (expression: MouthExpression, duration = 1200) => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("avatar:set-mouth", {
      detail: { expression, duration },
    })
  );
};

export default function BentoGrid({ projects, articles, skills, experiences, personalData }: BentoGridProps) {
  const skillGroups = groupSkills(skills);
  const featuredProjects = projects.filter((project) => project.featured).length > 0
    ? projects.filter((project) => project.featured).slice(0, 3)
    : projects.slice(0, 3);
  const featuredArticles = articles.filter((article) => article.featured).length > 0
    ? articles.filter((article) => article.featured).slice(0, 3)
    : articles.slice(0, 3);

  return (
    <div className="relative min-h-screen px-4 md:px-8 pt-28 pb-16 max-w-[1200px] mx-auto space-y-10">
      <FloatingAvatar avatar={personalData.activeCharacter} />
      {/* Hero Section - Full Width */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12"
      >
        {/* Left: Hero Text */}
        <div className="lg:col-span-2 flex flex-col justify-center space-y-6">
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="text-sm text-primary-accent font-semibold uppercase tracking-wider"
            >
              {personalData.heroEyebrow}
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25, duration: 0.45 }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--hero-name-from)] via-[var(--hero-name-via)] to-[var(--hero-name-to)]">
                {personalData.name.split(" ")[0]}
              </span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-accent to-secondary-accent">
                {personalData.name.split(" ")[1]}
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-text-secondary max-w-2xl leading-relaxed"
            >
              {personalData.heroSubtitle}
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-base text-text-secondary/80 max-w-xl"
            >
              {personalData.heroSummary}
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="flex flex-wrap gap-4 pt-4"
          >
            <button
              onMouseEnter={() => setAvatarMood("smile")}
              onMouseLeave={() => setAvatarMood("neutral")}
              onClick={() => {
                setAvatarMood("talking", 900);
                scrollToSection("contact");
              }}
              className="px-8 py-4 bg-gradient-to-r from-primary-accent to-button-gradient-to text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-accent/40 transition-all duration-200 hover:scale-105"
            >
              {personalData.primaryCtaLabel}
            </button>
            <button
              onMouseEnter={() => setAvatarMood("smile")}
              onMouseLeave={() => setAvatarMood("neutral")}
              onClick={() => scrollToSection("projects")}
              className="px-8 py-4 border-2 border-border-light text-text-primary rounded-xl font-semibold hover:bg-surface-muted hover:border-primary-accent transition-all duration-200 flex items-center gap-2"
            >
              {personalData.secondaryCtaLabel}
            </button>
            {personalData.resume && (
              <a
                href={personalData.resume}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setAvatarMood("smile")}
                onMouseLeave={() => setAvatarMood("neutral")}
                onClick={() => setAvatarMood("talking", 900)}
                className="px-8 py-4 border-2 border-border-light text-text-primary rounded-xl font-semibold hover:bg-surface-muted hover:border-primary-accent transition-all duration-200 flex items-center gap-2"
              >
                <FaDownload /> {personalData.resumeCtaLabel}
              </a>
            )}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2"
          >
            {featuredProjects.map((project) => (
              <button
                key={project.id}
                onClick={() => scrollToSection("projects")}
                className="text-left rounded-2xl border border-border-light bg-surface-soft p-4 hover:border-primary-accent/60 hover:bg-surface-muted transition-all duration-200"
              >
                <span className="text-xs uppercase tracking-wider text-primary-accent font-semibold">{personalData.featuredWorkLabel}</span>
                <p className="mt-2 text-sm font-semibold text-text-primary line-clamp-2">{project.name}</p>
              </button>
            ))}
          </motion.div>
        </div>

        {/* Right: Profile Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="relative h-[420px] lg:h-full rounded-3xl overflow-hidden group bg-gradient-to-br from-primary-accent/10 via-bg-card to-secondary-accent/10 border border-border-light lg:mt-6"
        >
          <HeroAccent />
          <div className="absolute inset-6 rounded-3xl bg-gradient-to-br from-primary-accent/15 via-secondary-accent/10 to-transparent blur-2xl group-hover:blur-3xl transition-all duration-500" />
          <Image
            src={personalData.profile || "/profile.png"}
            alt="Profile"
            fill
            sizes="(max-width: 1024px) 100vw, 33vw"
            quality={100}
            unoptimized={!!(personalData.profile && personalData.profile.includes("cdn.sanity.io"))}
            priority
            className="object-cover relative z-10 transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 z-20 bg-gradient-to-t from-image-overlay-from via-image-overlay-via to-transparent" />
          <div className="absolute inset-0 z-20 bg-gradient-to-r from-bg-card/45 via-transparent to-bg-card/20" />
          <div className="pointer-events-none absolute right-0 top-0 z-20 h-40 w-40 rounded-bl-[4rem] bg-bg-card/45 blur-xl lg:h-48 lg:w-48" />
          <div className="absolute bottom-4 left-4 right-4 z-30 rounded-2xl border border-border-light bg-bg-card/90 p-4 text-text-primary shadow-2xl shadow-black/20 backdrop-blur-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-accent">Available for focused product work</p>
            <p className="mt-1 text-sm leading-snug text-text-secondary">{personalData.designation}</p>
          </div>
        </motion.div>
      </motion.div>

      {/* About Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
        id="about"
        className="mb-12"
      >
        <Card className="p-8 md:p-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-12 bg-gradient-to-b from-primary-accent to-secondary-accent rounded-full" />
            <h2 className="text-3xl md:text-4xl font-bold">{personalData.aboutSectionTitle}</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8 items-start">
            <div className="space-y-5">
              <p className="text-lg text-text-secondary leading-relaxed max-w-[68ch]">{personalData.description}</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {personalData.aboutHighlights.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-border-light bg-surface-soft p-4">
                    <p className="text-xs uppercase tracking-wider text-primary-accent font-semibold">{item.label}</p>
                    <p className="mt-2 text-sm text-text-primary font-medium">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-primary-accent/20 bg-primary-accent/5 p-6 space-y-4">
              <h3 className="text-xl font-semibold text-text-primary">{personalData.aboutBringTitle}</h3>
              <ul className="space-y-3 text-sm text-text-secondary leading-relaxed">
                {personalData.aboutBringItems.map((item, index) => (
                  <li key={item} className="flex gap-3">
                    <span className={`mt-2 h-2 w-2 shrink-0 rounded-full ${index % 2 === 0 ? "bg-primary-accent" : "bg-secondary-accent"}`} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      </motion.section>

      {/* Skills Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
        id="skills"
        className="mb-12"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-12 bg-gradient-to-b from-primary-accent to-secondary-accent rounded-full" />
          <h2 className="text-3xl md:text-4xl font-bold">{personalData.skillsSectionTitle}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skillGroups.map((group, i) => (
            <motion.div
              key={group.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
            >
              <Card className="p-6 h-full hover:border-primary-accent/40 hover:bg-surface-muted transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-primary-accent/70" />
                    <h3 className="text-lg font-semibold">{group.label}</h3>
                  </div>
                  <span className="text-xs text-text-secondary/80">{group.skills.length} {personalData.skillsCountSuffix}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs px-3 py-1 bg-primary-accent/10 text-text-primary rounded-full border border-primary-accent/20"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Experience Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
        className="mb-12"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-12 bg-gradient-to-b from-primary-accent to-secondary-accent rounded-full" />
          <h2 className="text-3xl md:text-4xl font-bold">{personalData.experienceSectionTitle}</h2>
        </div>
        <div className="relative space-y-4 pl-4">
          <div className="absolute left-0 top-0 bottom-0 w-px bg-border-light/70" />
          {experiences.map((exp, i) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <Card className="p-6 hover:border-primary-accent/40 transition-all duration-200 relative md:pl-8">
                <div className="absolute -left-6 top-8 h-3 w-3 rounded-full bg-primary-accent shadow-[0_0_0_6px_var(--timeline-ring)]" />
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-text-primary mb-1">{exp.title}</h3>
                    <p className="text-text-secondary">{exp.company}</p>
                  </div>
                  <div className="text-sm text-text-secondary/80 font-medium">{exp.duration}</div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Projects Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
        id="projects"
        className="mb-12"
      >
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-1 h-12 bg-gradient-to-b from-primary-accent to-secondary-accent rounded-full" />
            <div>
              <p className="text-sm text-primary-accent font-semibold uppercase tracking-wider mb-2">{personalData.projectsEyebrow}</p>
              <h2 className="text-3xl md:text-4xl font-bold">{personalData.projectsSectionTitle}</h2>
              <p className="mt-3 max-w-2xl text-text-secondary leading-relaxed">
                {personalData.projectsSectionDescription}
              </p>
            </div>
          </div>
          <div className="rounded-2xl border border-border-light bg-surface-soft px-4 py-3 text-sm text-text-secondary">
            <span className="font-semibold text-text-primary">{projects.length}</span> {personalData.projectsCountLabel}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.45 }}
            >
              <Card className="overflow-hidden group h-full flex flex-col hover:border-primary-accent/40 hover:-translate-y-1 hover:shadow-[0_15px_40px_-20px_rgba(6,182,212,0.45)] transition-all duration-200">
                <div className="relative aspect-[16/9] overflow-hidden bg-bg-card">
                  <Image
                    src={buildOptimizedUrl(typeof project.image === "string" ? project.image : "/vercel.svg")}
                    alt={`${project.name} project preview`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    loading="lazy"
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-image-overlay-from via-image-overlay-via to-transparent opacity-70" />
                  <div className="absolute left-4 top-4 rounded-full border border-border-light bg-case-badge-bg px-3 py-1 text-xs font-semibold text-case-badge-text backdrop-blur">
                    Case Study {String(i + 1).padStart(2, "0")}
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-text-primary mb-2">{project.name}</h3>
                    <p className="text-text-secondary text-sm leading-relaxed">{project.description}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5 text-sm">
                    <div className="rounded-2xl border border-border-light bg-surface-soft p-4">
                      <p className="text-xs uppercase tracking-wider text-primary-accent font-semibold mb-2">Problem</p>
                      <p className="text-text-secondary leading-relaxed">{project.problem || "Designed and built a focused web experience around a clear user need."}</p>
                    </div>
                    <div className="rounded-2xl border border-border-light bg-surface-soft p-4">
                      <p className="text-xs uppercase tracking-wider text-secondary-accent font-semibold mb-2">Outcome</p>
                      <p className="text-text-secondary leading-relaxed">{project.outcome || "Delivered a responsive implementation with practical functionality and clean interactions."}</p>
                    </div>
                  </div>

                  <div className="mb-5 space-y-3">
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="text-xs uppercase tracking-wider text-text-secondary/80 font-semibold">Role</span>
                      <span className="rounded-full border border-secondary-accent/30 bg-secondary-accent/10 px-3 py-1 text-xs font-semibold text-secondary-accent">
                        {project.role || "Developer"}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-text-secondary/80 font-semibold mb-2">Stack</p>
                      <div className="flex flex-wrap gap-2">
                        {project.tools.map((tool, j) => (
                          <span
                            key={j}
                            className="text-xs px-3 py-1 bg-primary-accent/20 text-primary-accent rounded-full border border-primary-accent/30"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 pt-2 mt-auto border-t border-border-light/70">
                    {project.demo ? (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm font-medium text-primary-accent hover:text-secondary-accent transition-colors"
                      >
                        <FaExternalLinkAlt /> Live Demo
                      </a>
                    ) : (
                      <span className="text-sm text-text-secondary/70">Demo link coming soon</span>
                    )}
                    {project.code ? (
                      <a
                        href={project.code}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-primary-accent transition-colors"
                      >
                        <FaCode /> Source Code
                      </a>
                    ) : (
                      <span className="text-sm text-text-secondary/70">Code link available on request</span>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Writing / Articles Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
        id="writing"
        className="mb-12"
      >
        <Card className="p-8 md:p-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
            <div className="flex items-start gap-3">
              <div className="w-1 h-12 bg-gradient-to-b from-primary-accent to-secondary-accent rounded-full" />
              <div>
                <p className="text-sm text-primary-accent font-semibold uppercase tracking-wider mb-2">{personalData.writingEyebrow}</p>
                <h2 className="text-3xl md:text-4xl font-bold">{personalData.writingSectionTitle}</h2>
                <p className="mt-3 max-w-2xl text-text-secondary leading-relaxed">
                  {personalData.writingSectionDescription}
                </p>
              </div>
            </div>
            <span className="rounded-full border border-secondary-accent/30 bg-secondary-accent/10 px-4 py-2 text-sm font-semibold text-secondary-accent">
              {personalData.writingBadgeLabel}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredArticles.map((article) => {
              const statusLabel = article.status === "published" ? "Published article" : article.status === "draft" ? "Draft in progress" : "Upcoming article";
              const cardContent = (
                <>
                  <p className="text-xs uppercase tracking-wider text-primary-accent font-semibold mb-3">{statusLabel}</p>
                  <h3 className="text-xl font-bold text-text-primary mb-3">{article.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed mb-4">{article.summary}</p>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <span key={tag} className="text-xs px-3 py-1 rounded-full border border-primary-accent/20 bg-primary-accent/10 text-primary-accent">
                        {tag}
                      </span>
                    ))}
                  </div>
                  {article.url && (
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-secondary-accent">
                      Read article <FaExternalLinkAlt />
                    </span>
                  )}
                </>
              );

              return article.url ? (
                <a
                  key={article.id}
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-3xl border border-border-light bg-surface-soft p-6 hover:border-primary-accent/40 hover:bg-surface-muted transition-all duration-200"
                >
                  {cardContent}
                </a>
              ) : (
                <div key={article.id} className="rounded-3xl border border-border-light bg-surface-soft p-6 hover:border-primary-accent/40 hover:bg-surface-muted transition-all duration-200">
                  {cardContent}
                </div>
              );
            })}
          </div>
        </Card>
      </motion.section>

      {/* Contact Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
        id="contact"
        className="mb-12"
      >
        <Card className="p-8 md:p-12 bg-gradient-to-br from-primary-accent/12 via-secondary-accent/8 to-primary-accent/12 border-primary-accent/30">
          <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-8 items-center">
            <div className="space-y-6">
              <div className="space-y-4">
                <p className="text-sm text-primary-accent font-semibold uppercase tracking-wider">{personalData.contactEyebrow}</p>
                <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-accent to-secondary-accent">
                  {personalData.contactTitle}
                </h2>
                <p className="text-lg text-text-secondary leading-relaxed max-w-2xl">
                  {personalData.contactDescription}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {personalData.contactCards.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-border-light bg-surface-raised p-4">
                    <p className="text-xs uppercase tracking-wider text-primary-accent font-semibold">{item.label}</p>
                    <p className="mt-2 text-sm text-text-primary font-medium">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-border-light bg-surface-soft p-6 space-y-5">
              <a
                href={`mailto:${personalData.email}`}
                className="w-full px-8 py-4 bg-gradient-to-r from-primary-accent to-button-gradient-to text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-accent/40 transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-2"
                onMouseEnter={() => setAvatarMood("smile")}
                onMouseLeave={() => setAvatarMood("neutral")}
                onClick={() => setAvatarMood("talking", 900)}
              >
                <FaEnvelope /> {personalData.emailCtaLabel}
              </a>

              <div className="space-y-3 text-sm text-text-secondary">
                {personalData.email && (
                  <div className="flex items-center justify-between gap-4 rounded-2xl border border-border-light bg-surface-soft p-3">
                    <span>Email</span>
                    <a href={`mailto:${personalData.email}`} className="font-medium text-text-primary hover:text-primary-accent transition-colors break-all">
                      {personalData.email}
                    </a>
                  </div>
                )}
                {personalData.address && (
                  <div className="flex items-center justify-between gap-4 rounded-2xl border border-border-light bg-surface-soft p-3">
                    <span>Location</span>
                    <span className="font-medium text-text-primary text-right">{personalData.address}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                {personalData.resume && (
                  <a
                    href={personalData.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={() => setAvatarMood("smile")}
                    onMouseLeave={() => setAvatarMood("neutral")}
                    onClick={() => setAvatarMood("talking", 900)}
                    className="flex-1 min-w-[150px] px-4 py-3 border-2 border-border-light text-text-primary rounded-xl font-semibold hover:bg-surface-muted hover:border-primary-accent transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <FaDownload /> {personalData.resumeCtaLabel}
                  </a>
                )}
                <a
                  href={personalData.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => setAvatarMood("smile")}
                  onMouseLeave={() => setAvatarMood("neutral")}
                  onClick={() => setAvatarMood("talking", 900)}
                  className="p-3 border-2 border-border-light rounded-xl hover:border-primary-accent hover:bg-surface-muted transition-all duration-200"
                  aria-label="GitHub profile"
                >
                  <FaGithub className="text-2xl" />
                </a>
                <a
                  href={personalData.linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => setAvatarMood("smile")}
                  onMouseLeave={() => setAvatarMood("neutral")}
                  onClick={() => setAvatarMood("talking", 900)}
                  className="p-3 border-2 border-border-light rounded-xl hover:border-primary-accent hover:bg-surface-muted transition-all duration-200"
                  aria-label="LinkedIn profile"
                >
                  <FaLinkedin className="text-2xl" />
                </a>
                <a
                  href={personalData.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => setAvatarMood("smile")}
                  onMouseLeave={() => setAvatarMood("neutral")}
                  onClick={() => setAvatarMood("talking", 900)}
                  className="p-3 border-2 border-border-light rounded-xl hover:border-primary-accent hover:bg-surface-muted transition-all duration-200"
                  aria-label="Twitter profile"
                >
                  <FaTwitter className="text-2xl" />
                </a>
              </div>
            </div>
          </div>
        </Card>
      </motion.section>
    </div>
  );
}
