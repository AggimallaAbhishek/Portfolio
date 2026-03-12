import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import { startTransition, useDeferredValue, useState } from "react";

import { toAssetUrl } from "../../api/client";
import type { Project } from "../../types";
import { SectionHeading } from "../common/SectionHeading";

export function ProjectsSection({ projects }: { projects: Project[] }) {
  const [selectedTech, setSelectedTech] = useState("All");
  const deferredTech = useDeferredValue(selectedTech);

  const technologies = ["All", ...Array.from(new Set(projects.flatMap((project) => project.tech_stack))).sort()];
  const filteredProjects =
    deferredTech === "All"
      ? projects
      : projects.filter((project) => project.tech_stack.includes(deferredTech));

  return (
    <section id="projects" className="section-gap">
      <div className="section-shell space-y-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Projects"
            title="Work that blends product thinking with engineering depth."
            description="Featured projects are loaded from the FastAPI backend, so you can keep this portfolio fresh from the admin dashboard."
          />

          <div className="flex flex-wrap gap-2">
            {technologies.map((technology) => (
              <button
                key={technology}
                type="button"
                onClick={() => {
                  startTransition(() => setSelectedTech(technology));
                }}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  selectedTech === technology
                    ? "bg-gradient-to-r from-cyan to-coral text-slate-950"
                    : "border border-white/10 bg-white/60 text-slate-700 hover:border-cyan hover:text-cyan dark:bg-white/10 dark:text-slate-200"
                }`}
              >
                {technology}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {filteredProjects.map((project, index) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.08 }}
              className="glass-card overflow-hidden"
            >
              {project.images[0]?.image_url ? (
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={toAssetUrl(project.images[0].image_url)}
                    alt={project.images[0].alt_text ?? project.title}
                    className="h-full w-full object-cover transition duration-500 hover:scale-105"
                  />
                </div>
              ) : (
                <div className="aspect-[16/10] bg-gradient-to-br from-cyan/25 via-slate-900 to-coral/20" />
              )}
              <div className="space-y-5 p-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-display text-2xl text-slate-950 dark:text-white">
                        {project.title}
                      </h3>
                      {project.featured ? (
                        <span className="rounded-full border border-cyan/30 bg-cyan/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-cyan">
                          Featured
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                      {project.summary}
                    </p>
                  </div>
                </div>

                <p className="text-sm leading-7 text-slate-600 dark:text-slate-400">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {project.tech_stack.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-slate-300/70 bg-white/70 px-3 py-1 text-xs font-medium text-slate-700 dark:border-white/10 dark:bg-white/10 dark:text-slate-200"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3">
                  {project.github_url ? (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-slate-700 hover:border-cyan hover:text-cyan dark:text-slate-200"
                    >
                      <Github size={16} />
                      GitHub
                    </a>
                  ) : null}
                  {project.live_url ? (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-slate-700 hover:border-cyan hover:text-cyan dark:text-slate-200"
                    >
                      <ExternalLink size={16} />
                      Live Demo
                    </a>
                  ) : null}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
