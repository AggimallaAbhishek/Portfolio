import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import { toAssetUrl } from "../../api/client";
import type { BlogPost } from "../../types";
import { SectionHeading } from "../common/SectionHeading";

function formatDate(value: string | null) {
  if (!value) {
    return "Draft";
  }
  return new Date(value).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

export function BlogSection({ posts }: { posts: BlogPost[] }) {
  return (
    <section id="blog" className="section-gap">
      <div className="section-shell space-y-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Blog"
            title="Writing about backend architecture, AI workflows, and growth."
            description="Posts are powered by the same API as the admin panel, with Markdown-based publishing and tag support."
          />
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-cyan hover:text-cyan dark:text-slate-200"
          >
            View all articles
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {posts.slice(0, 3).map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.08 }}
              className="glass-card overflow-hidden"
            >
              {post.cover_image ? (
                <img
                  src={toAssetUrl(post.cover_image)}
                  alt={post.title}
                  className="h-52 w-full object-cover"
                />
              ) : (
                <div className="h-52 w-full bg-gradient-to-br from-cyan/25 via-slate-900 to-coral/20" />
              )}
              <div className="space-y-4 p-6">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs uppercase tracking-[0.25em] text-cyan">
                    {post.category?.name ?? "Insights"}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {formatDate(post.published_at)}
                  </span>
                </div>
                <h3 className="font-display text-2xl text-slate-950 dark:text-white">{post.title}</h3>
                <p className="text-sm leading-7 text-slate-600 dark:text-slate-400">{post.excerpt}</p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="rounded-full border border-slate-300/70 bg-white/70 px-3 py-1 text-xs text-slate-700 dark:border-white/10 dark:bg-white/10 dark:text-slate-200"
                    >
                      #{tag.name}
                    </span>
                  ))}
                </div>
                <Link
                  to={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-cyan"
                >
                  Read article
                  <ArrowRight size={15} />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
