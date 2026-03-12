import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { api, toAssetUrl } from "../api/client";
import { LoadingPanel } from "../components/common/LoadingPanel";
import { Footer } from "../components/layout/Footer";
import { Navbar } from "../components/layout/Navbar";
import { PageSeo } from "../components/seo/PageSeo";
import type { BlogPost, Profile } from "../types";

function formatDate(value: string | null) {
  return value
    ? new Date(value).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })
    : "Draft";
}

export function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const [profileResponse, postResponse] = await Promise.all([api.getProfile(), api.getBlogPosts()]);
        if (!active) {
          return;
        }
        setProfile(profileResponse);
        setPosts(postResponse);
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : "Unable to load blog");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-screen text-slate-900 dark:text-white">
      <PageSeo
        title="Blog"
        description="Notes and articles by Aggimalla Abhishek on AI engineering, backend systems, and product building."
        path="/blog"
      />
      <Navbar profile={profile} />
      <main className="section-shell section-gap space-y-10">
        <div className="max-w-3xl space-y-5">
          <span className="inline-flex rounded-full border border-cyan/30 bg-cyan/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-cyan">
            Articles
          </span>
          <h1 className="font-display text-5xl text-slate-950 dark:text-white">Writing in public.</h1>
          <p className="text-lg leading-8 text-slate-600 dark:text-slate-300">
            Thoughts on AI systems, full-stack engineering, backend design, and the lessons that come from building real projects end to end.
          </p>
        </div>

        {loading ? <LoadingPanel label="Loading articles" /> : null}
        {error ? <p className="text-rose-400">{error}</p> : null}

        <div className="grid gap-6 lg:grid-cols-2">
          {posts.map((post) => (
            <article key={post.id} className="glass-card overflow-hidden">
              {post.cover_image ? (
                <img src={toAssetUrl(post.cover_image)} alt={post.title} className="h-64 w-full object-cover" />
              ) : null}
              <div className="space-y-4 p-7">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs uppercase tracking-[0.28em] text-cyan">
                    {post.category?.name ?? "Article"}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {formatDate(post.published_at)}
                  </span>
                </div>
                <h2 className="font-display text-3xl text-slate-950 dark:text-white">{post.title}</h2>
                <p className="text-sm leading-8 text-slate-600 dark:text-slate-400">{post.excerpt}</p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-700 dark:text-slate-200"
                    >
                      #{tag.name}
                    </span>
                  ))}
                </div>
                <Link to={`/blog/${post.slug}`} className="text-sm font-semibold text-cyan">
                  Read more
                </Link>
              </div>
            </article>
          ))}
        </div>
      </main>
      <Footer profile={profile} />
    </div>
  );
}
