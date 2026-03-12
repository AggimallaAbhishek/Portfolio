import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Link, useParams } from "react-router-dom";

import { api, toAssetUrl } from "../api/client";
import { LoadingPanel } from "../components/common/LoadingPanel";
import { Footer } from "../components/layout/Footer";
import { Navbar } from "../components/layout/Navbar";
import { PageSeo } from "../components/seo/PageSeo";
import type { BlogPost, Profile } from "../types";

export function BlogPostPage() {
  const { slug = "" } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const [profileResponse, postResponse] = await Promise.all([api.getProfile(), api.getBlogPost(slug)]);
        if (!active) {
          return;
        }
        setProfile(profileResponse);
        setPost(postResponse);
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : "Unable to load article");
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
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen text-slate-900 dark:text-white">
        <Navbar profile={profile} />
        <LoadingPanel label="Loading article" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen text-slate-900 dark:text-white">
        <Navbar profile={profile} />
        <div className="section-shell py-24">
          <div className="glass-card p-8">
            <p className="text-rose-400">{error ?? "Article not found"}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-900 dark:text-white">
      <PageSeo
        title={post.title}
        description={post.excerpt}
        path={`/blog/${post.slug}`}
        image={toAssetUrl(post.cover_image)}
      />
      <Navbar profile={profile} />
      <main className="section-shell section-gap">
        <article className="mx-auto max-w-4xl">
          <Link to="/blog" className="text-sm font-semibold text-cyan">
            ← Back to blog
          </Link>
          <div className="mt-8 space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-cyan/30 bg-cyan/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-cyan">
                {post.category?.name ?? "Article"}
              </span>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {post.published_at
                  ? new Date(post.published_at).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric"
                    })
                  : "Draft"}
              </span>
            </div>
            <h1 className="font-display text-5xl text-slate-950 dark:text-white">{post.title}</h1>
            <p className="text-lg leading-8 text-slate-600 dark:text-slate-300">{post.excerpt}</p>
          </div>
          {post.cover_image ? (
            <img
              src={toAssetUrl(post.cover_image)}
              alt={post.title}
              className="mt-10 h-[28rem] w-full rounded-[2rem] object-cover"
            />
          ) : null}
          <div className="prose prose-slate mt-10 max-w-none rounded-[2rem] border border-white/10 bg-white/60 p-8 dark:prose-invert dark:bg-white/5">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content_markdown}</ReactMarkdown>
          </div>
        </article>
      </main>
      <Footer profile={profile} />
    </div>
  );
}
