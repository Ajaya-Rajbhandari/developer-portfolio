'use client'

import Link from 'next/link'
import { NextStudio } from 'next-sanity/studio'
import config from '../../../../sanity.config'

export default function StudioPage() {
  return (
    <section className="mx-auto min-h-screen w-full max-w-[1440px] px-4 pb-10 pt-28 md:px-8 lg:px-10">
      <div className="mb-6 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-5 shadow-2xl shadow-black/30 backdrop-blur md:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary-accent">
              Portfolio CMS
            </p>
            <h1 className="mt-2 text-2xl font-bold text-white md:text-4xl">
              Manage your portfolio content
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-400 md:text-base">
              Update personal information, projects, skills, experience, articles, character settings,
              navigation labels, footer copy, and availability from one place. The same portfolio navbar
              remains available above this Studio so you can jump back to each public section quickly.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 text-sm font-medium">
            <Link
              href="/"
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-white hover:border-primary-accent/60 hover:bg-primary-accent/15"
            >
              View portfolio
            </Link>
            <Link
              href="/#projects"
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-white hover:border-secondary-accent/60 hover:bg-secondary-accent/15"
            >
              Check projects
            </Link>
          </div>
        </div>
      </div>

      <div className="studio-shell overflow-hidden rounded-3xl border border-white/10 bg-[#0b0f19] shadow-2xl shadow-black/40">
        <NextStudio config={config} />
      </div>
    </section>
  )
}
