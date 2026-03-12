import { useState, type FormEvent } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { api, toAssetUrl } from "../../api/client";
import type { BlogPost, BlogPostPayload } from "../../types";
import { ImageUploader } from "./ImageUploader";

interface BlogManagerProps {
  token: string;
  posts: BlogPost[];
  onPostsChange: (posts: BlogPost[]) => void;
}

interface BlogFormState {
  id?: number;
  title: string;
  excerpt: string;
  content_markdown: string;
  cover_image: string;
  category: string;
  tagsText: string;
  published: boolean;
}

const emptyBlogForm: BlogFormState = {
  title: "",
  excerpt: "",
  content_markdown: "## Start writing here\n",
  cover_image: "",
  category: "",
  tagsText: "",
  published: true
};

function toFormState(post: BlogPost): BlogFormState {
  return {
    id: post.id,
    title: post.title,
    excerpt: post.excerpt,
    content_markdown: post.content_markdown,
    cover_image: post.cover_image ?? "",
    category: post.category?.name ?? "",
    tagsText: post.tags.map((tag) => tag.name).join(", "),
    published: post.published
  };
}

export function BlogManager({ token, posts, onPostsChange }: BlogManagerProps) {
  const [form, setForm] = useState<BlogFormState>(emptyBlogForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sortedPosts = [...posts].sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));

  function resetForm() {
    setForm(emptyBlogForm);
    setError(null);
  }

  function buildPayload(): BlogPostPayload {
    return {
      title: form.title,
      excerpt: form.excerpt,
      content_markdown: form.content_markdown,
      cover_image: form.cover_image || null,
      published: form.published,
      category: form.category || null,
      tags: form.tagsText
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    };
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      let nextPosts: BlogPost[];
      if (form.id) {
        const updated = await api.updateBlogPost(token, form.id, buildPayload());
        nextPosts = posts.map((post) => (post.id === updated.id ? updated : post));
      } else {
        const created = await api.createBlogPost(token, buildPayload());
        nextPosts = [created, ...posts];
      }
      onPostsChange(nextPosts);
      resetForm();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save post");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this blog post?")) {
      return;
    }
    await api.deleteBlogPost(token, id);
    onPostsChange(posts.filter((post) => post.id !== id));
    if (form.id === id) {
      resetForm();
    }
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
      <form onSubmit={handleSubmit} className="glass-card space-y-5 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-2xl text-slate-950 dark:text-white">
              {form.id ? "Edit post" : "Write a new post"}
            </h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Publish Markdown articles with categories, tags, and cover images.
            </p>
          </div>
          {form.id ? (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-700 dark:text-slate-200"
            >
              New
            </button>
          ) : null}
        </div>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Title</span>
          <input
            required
            value={form.title}
            onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
            className="w-full rounded-2xl border border-white/10 bg-white/70 px-4 py-3 text-slate-900 dark:bg-white/10 dark:text-white"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Excerpt</span>
          <textarea
            required
            rows={3}
            value={form.excerpt}
            onChange={(event) => setForm((current) => ({ ...current, excerpt: event.target.value }))}
            className="w-full rounded-2xl border border-white/10 bg-white/70 px-4 py-3 text-slate-900 dark:bg-white/10 dark:text-white"
          />
        </label>

        <div className="grid gap-5 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Category</span>
            <input
              value={form.category}
              onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
              placeholder="Backend"
              className="w-full rounded-2xl border border-white/10 bg-white/70 px-4 py-3 text-slate-900 dark:bg-white/10 dark:text-white"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Tags</span>
            <input
              value={form.tagsText}
              onChange={(event) => setForm((current) => ({ ...current, tagsText: event.target.value }))}
              placeholder="FastAPI, PostgreSQL"
              className="w-full rounded-2xl border border-white/10 bg-white/70 px-4 py-3 text-slate-900 dark:bg-white/10 dark:text-white"
            />
          </label>
        </div>

        <div className="space-y-3">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Cover image</span>
            <input
              value={form.cover_image}
              onChange={(event) => setForm((current) => ({ ...current, cover_image: event.target.value }))}
              className="w-full rounded-2xl border border-white/10 bg-white/70 px-4 py-3 text-slate-900 dark:bg-white/10 dark:text-white"
            />
          </label>
          <ImageUploader token={token} onUploaded={(fileUrl) => setForm((current) => ({ ...current, cover_image: fileUrl }))} />
          {form.cover_image ? (
            <img
              src={toAssetUrl(form.cover_image)}
              alt="Cover preview"
              className="h-48 w-full rounded-3xl object-cover"
            />
          ) : null}
        </div>

        <label className="inline-flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-200">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(event) => setForm((current) => ({ ...current, published: event.target.checked }))}
          />
          Publish immediately
        </label>

        <div className="grid gap-5 xl:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Markdown</span>
            <textarea
              required
              rows={16}
              value={form.content_markdown}
              onChange={(event) => setForm((current) => ({ ...current, content_markdown: event.target.value }))}
              className="w-full rounded-3xl border border-white/10 bg-white/70 px-4 py-4 font-mono text-sm text-slate-900 dark:bg-white/10 dark:text-white"
            />
          </label>
          <div className="space-y-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Preview</span>
            <div className="prose prose-slate max-w-none rounded-3xl border border-white/10 bg-white/60 p-5 dark:prose-invert dark:bg-white/5">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {form.content_markdown}
              </ReactMarkdown>
            </div>
          </div>
        </div>

        {error ? <p className="text-sm text-rose-400">{error}</p> : null}
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-gradient-to-r from-cyan to-coral px-6 py-3 font-semibold text-slate-950 disabled:opacity-60"
        >
          {saving ? "Saving..." : form.id ? "Update post" : "Publish post"}
        </button>
      </form>

      <div className="space-y-5">
        {sortedPosts.map((post) => (
          <article key={post.id} className="glass-card overflow-hidden">
            {post.cover_image ? (
              <img src={toAssetUrl(post.cover_image)} alt={post.title} className="h-44 w-full object-cover" />
            ) : null}
            <div className="space-y-4 p-6">
              <div className="flex items-center justify-between gap-4">
                <h4 className="font-display text-xl text-slate-950 dark:text-white">{post.title}</h4>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] ${
                    post.published
                      ? "border border-emerald-400/20 bg-emerald-400/10 text-emerald-400"
                      : "border border-amber-400/20 bg-amber-400/10 text-amber-400"
                  }`}
                >
                  {post.published ? "Published" : "Draft"}
                </span>
              </div>
              <p className="text-sm leading-7 text-slate-600 dark:text-slate-400">{post.excerpt}</p>
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
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setForm(toFormState(post))}
                  className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-700 dark:text-slate-200"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(post.id)}
                  className="rounded-full border border-rose-400/20 px-4 py-2 text-sm text-rose-400"
                >
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
