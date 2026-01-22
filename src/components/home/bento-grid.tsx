"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope, FaDownload, FaExternalLinkAlt, FaCode } from "react-icons/fa";

interface Project {
    id: number | string;
    name: string;
    description: string;
    tools: string[];
    role: string;
    code: string;
    demo: string;
    image: string;
}

interface Experience {
    id: number | string;
    title: string;
    company: string;
    duration: string;
}

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
}

interface BentoGridProps {
    projects: Project[];
    skills: string[];
    experiences: Experience[];
    personalData: PersonalData;
}

const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
        const navbarHeight = 80;
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - navbarHeight;
        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });
    }
};

export default function BentoGrid({ projects, skills, experiences, personalData }: BentoGridProps) {
    return (
        <div className="min-h-screen p-4 md:p-8 pt-32 max-w-[1600px] mx-auto space-y-6">
            {/* Hero Section - Full Width */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12"
            >
                {/* Left: Hero Text */}
                <div className="lg:col-span-2 flex flex-col justify-center space-y-6">
                    <div className="space-y-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-sm text-primary-accent font-semibold uppercase tracking-wider"
                        >
                            Hello, I&apos;m
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                            className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight"
                        >
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-gray-400">
                                {personalData.name.split(' ')[0]}
                            </span>
                            <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-accent to-secondary-accent">
                                {personalData.name.split(' ')[1]}
                            </span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-xl md:text-2xl text-text-secondary max-w-2xl leading-relaxed"
                        >
                            {personalData.designation}. Building digital products with a focus on experience and performance.
                        </motion.p>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="text-base text-text-secondary/80 max-w-xl"
                        >
                            {personalData.description.split('.').slice(0, 2).join('.')}.
                        </motion.p>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="flex flex-wrap gap-4 pt-4"
                    >
                        <button
                            onClick={() => scrollToSection("contact")}
                            className="px-8 py-4 bg-gradient-to-r from-primary-accent to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-accent/50 transition-all duration-300 hover:scale-105"
                        >
                            Get In Touch
                        </button>
                        {personalData.resume && (
                            <a
                                href={personalData.resume}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-8 py-4 border-2 border-border-light text-text-primary rounded-xl font-semibold hover:bg-white/5 hover:border-primary-accent transition-all duration-300 flex items-center gap-2"
                            >
                                <FaDownload /> Resume
                            </a>
                        )}
                    </motion.div>
                </div>

                {/* Right: Profile Image */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="relative h-[400px] lg:h-full rounded-3xl overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-accent/20 to-secondary-accent/20 blur-2xl group-hover:blur-3xl transition-all duration-500" />
                    <Image
                        src={personalData.profile || "/profile.png"}
                        alt="Profile"
                        fill
                        sizes="(max-width: 1024px) 100vw, 33vw"
                        loading="eager"
                        className="object-cover relative z-10 transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/60 via-transparent to-transparent z-20" />
                </motion.div>
            </motion.div>

            {/* About Section */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                id="about"
                className="mb-12"
            >
                <Card className="p-8 md:p-12">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1 h-12 bg-gradient-to-b from-primary-accent to-secondary-accent rounded-full" />
                        <h2 className="text-3xl md:text-4xl font-bold">About Me</h2>
                    </div>
                    <p className="text-lg text-text-secondary leading-relaxed max-w-4xl">
                        {personalData.description}
                    </p>
                </Card>
            </motion.section>

            {/* Skills Section */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                id="skills"
                className="mb-12"
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-12 bg-gradient-to-b from-primary-accent to-secondary-accent rounded-full" />
                    <h2 className="text-3xl md:text-4xl font-bold">Tech Stack</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {skills.map((skill, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05, duration: 0.3 }}
                        >
                            <Card className="p-6 text-center hover:border-primary-accent/50 hover:bg-white/5 transition-all duration-300 group cursor-pointer">
                                <div className="text-lg font-semibold text-text-primary group-hover:text-primary-accent transition-colors">
                                    {skill}
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
                transition={{ duration: 0.6 }}
                className="mb-12"
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-12 bg-gradient-to-b from-primary-accent to-secondary-accent rounded-full" />
                    <h2 className="text-3xl md:text-4xl font-bold">Experience</h2>
                </div>
                <div className="space-y-4">
                    {experiences.map((exp, i) => (
                        <motion.div
                            key={exp.id}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                        >
                            <Card className="p-6 hover:border-primary-accent/50 transition-all duration-300">
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
                transition={{ duration: 0.6 }}
                id="projects"
                className="mb-12"
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-12 bg-gradient-to-b from-primary-accent to-secondary-accent rounded-full" />
                    <h2 className="text-3xl md:text-4xl font-bold">Featured Projects</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project, i) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                        >
                            <Card className="overflow-hidden group h-full flex flex-col hover:border-primary-accent/50 transition-all duration-300">
                                <div className="relative h-48 overflow-hidden">
                                    <Image
                                        src={typeof project.image === 'string' ? project.image : "/vercel.svg"}
                                        alt={project.name}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-bg-dark/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <h3 className="text-xl font-bold text-text-primary mb-2">{project.name}</h3>
                                    <p className="text-text-secondary text-sm mb-4 flex-1 line-clamp-3">
                                        {project.description}
                                    </p>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {project.tools.map((tool, j) => (
                                            <span
                                                key={j}
                                                className="text-xs px-3 py-1 bg-primary-accent/20 text-primary-accent rounded-full border border-primary-accent/30"
                                            >
                                                {tool}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex gap-4 pt-2">
                                        {project.demo && (
                                            <a
                                                href={project.demo}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-sm font-medium text-primary-accent hover:text-secondary-accent transition-colors"
                                            >
                                                <FaExternalLinkAlt /> Demo
                                            </a>
                                        )}
                                        {project.code && (
                                            <a
                                                href={project.code}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-primary-accent transition-colors"
                                            >
                                                <FaCode /> Code
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* Contact Section */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                id="contact"
                className="mb-12"
            >
                <Card className="p-8 md:p-12 bg-gradient-to-br from-primary-accent/10 via-secondary-accent/10 to-primary-accent/10 border-primary-accent/30">
                    <div className="max-w-3xl mx-auto text-center space-y-6">
                        <div className="space-y-4">
                            <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-accent to-secondary-accent">
                                Let&apos;s Work Together
                            </h2>
                            <p className="text-lg text-text-secondary">
                                Have a project in mind? I&apos;d love to hear about it. Let&apos;s create something amazing together.
                            </p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-4 pt-4">
                            <a
                                href={`mailto:${personalData.email}`}
                                className="px-8 py-4 bg-gradient-to-r from-primary-accent to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-accent/50 transition-all duration-300 hover:scale-105 flex items-center gap-2"
                            >
                                <FaEnvelope /> Send Email
                            </a>
                            <div className="flex gap-4">
                                <a
                                    href={personalData.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-4 border-2 border-border-light rounded-xl hover:border-primary-accent hover:bg-white/5 transition-all duration-300"
                                    aria-label="GitHub"
                                >
                                    <FaGithub className="text-2xl" />
                                </a>
                                <a
                                    href={personalData.linkedIn}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-4 border-2 border-border-light rounded-xl hover:border-primary-accent hover:bg-white/5 transition-all duration-300"
                                    aria-label="LinkedIn"
                                >
                                    <FaLinkedin className="text-2xl" />
                                </a>
                                <a
                                    href={personalData.twitter}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-4 border-2 border-border-light rounded-xl hover:border-primary-accent hover:bg-white/5 transition-all duration-300"
                                    aria-label="Twitter"
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
};
