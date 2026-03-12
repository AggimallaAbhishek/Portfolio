import { motion } from "framer-motion";
import { ExternalLink, GitCommitVertical } from "lucide-react";

import type { GitHubActivityItem } from "../../types";
import { SectionHeading } from "../common/SectionHeading";

function formatDate(value: string | null) {
  return value
    ? new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "Recently";
}

export function GitHubActivitySection({ items }: { items: GitHubActivityItem[] }) {
  return (
    <section className="section-gap">
      <div className="section-shell space-y-10">
        <SectionHeading
          eyebrow="GitHub Activity"
          title="Recent coding signals from public repositories."
          description="This feed uses the backend GitHub integration to surface recent public activity without hardcoding updates."
        />

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {items.map((item, index) => (
            <motion.a
              key={item.id}
              href={item.url ?? "#"}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.06 }}
              className="glass-card flex h-full flex-col justify-between gap-6 p-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="inline-flex rounded-full border border-cyan/20 bg-cyan/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-cyan">
                    {item.type.replace("Event", "")}
                  </span>
                  <GitCommitVertical className="text-coral" size={18} />
                </div>
                <div>
                  <p className="font-display text-xl text-slate-950 dark:text-white">{item.repo_name}</p>
                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">{item.message}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                <span>{formatDate(item.created_at)}</span>
                <ExternalLink size={15} />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
