import { motion } from "framer-motion";

import type { Profile } from "../../types";
import { SectionHeading } from "../common/SectionHeading";

const categoryOrder = ["Programming", "Data Science", "Web Development", "Tools & Technologies"];

export function AboutSection({ profile }: { profile: Profile }) {
  return (
    <section id="about" className="section-gap">
      <div className="section-shell grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <SectionHeading
            eyebrow="About"
            title="A builder who enjoys both systems and intelligence."
            description={profile.bio}
          />
          <div className="glass-card p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan">Why I build</p>
            <p className="mt-4 text-base leading-8 text-slate-700 dark:text-slate-300">
              I’m especially interested in products where machine learning, secure backend design, and thoughtful UX need to work together. That intersection is where I do my best work.
            </p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {categoryOrder.map((category, index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: index * 0.08 }}
              className="glass-card p-6"
            >
              <p className="font-display text-xl text-slate-950 dark:text-white">{category}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {(profile.skills[category] ?? []).map((skill) => (
                  <span
                    key={skill.id}
                    className="rounded-full border border-slate-300/70 bg-white/70 px-3 py-1 text-sm text-slate-700 dark:border-white/10 dark:bg-white/10 dark:text-slate-200"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
