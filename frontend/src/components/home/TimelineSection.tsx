import { motion } from "framer-motion";

import type { ExperienceItem } from "../../types";
import { SectionHeading } from "../common/SectionHeading";

function formatDateRange(start?: string | null, end?: string | null) {
  const format = (value?: string | null) =>
    value
      ? new Date(value).toLocaleDateString("en-US", { month: "short", year: "numeric" })
      : "Present";

  return `${format(start)} - ${format(end)}`;
}

export function TimelineSection({ experiences }: { experiences: ExperienceItem[] }) {
  return (
    <section id="timeline" className="section-gap">
      <div className="section-shell space-y-10">
        <SectionHeading
          eyebrow="Timeline"
          title="Education, internships, and milestones."
          description="A quick view of the learning path and practical experience shaping how I build products today."
        />

        <div className="relative space-y-8 before:absolute before:left-5 before:top-4 before:h-[calc(100%-2rem)] before:w-px before:bg-gradient-to-b before:from-cyan before:to-transparent md:before:left-1/2">
          {experiences.map((item, index) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.06 }}
              className={`relative md:grid md:grid-cols-2 ${index % 2 === 0 ? "" : ""}`}
            >
              <div className={`hidden md:block ${index % 2 === 0 ? "pr-10" : "order-2 pl-10"}`} />
              <div
                className={`pl-14 md:pl-0 ${
                  index % 2 === 0 ? "md:pr-10" : "md:order-1 md:pl-10"
                }`}
              >
                <span className="absolute left-0 top-6 h-10 w-10 rounded-full border border-cyan/30 bg-cyan/10 shadow-[0_0_0_10px_rgba(86,212,221,0.06)] md:left-1/2 md:-ml-5" />
                <div className="glass-card p-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full border border-coral/30 bg-coral/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-coral">
                      {item.experience_type}
                    </span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {formatDateRange(item.start_date, item.end_date)}
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-2xl text-slate-950 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                    {item.organization}
                    {item.location ? ` • ${item.location}` : ""}
                  </p>
                  <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-400">
                    {item.description}
                  </p>
                  {item.highlight ? (
                    <p className="mt-4 rounded-2xl border border-white/10 bg-white/60 px-4 py-3 text-sm text-slate-700 dark:bg-white/5 dark:text-slate-300">
                      {item.highlight}
                    </p>
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
