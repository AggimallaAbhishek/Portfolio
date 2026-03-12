import { FolderKanban, LogOut, Mailbox, NotebookTabs, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { api } from "../api/client";
import { LoadingPanel } from "../components/common/LoadingPanel";
import { BlogManager } from "../components/dashboard/BlogManager";
import { MessagesManager } from "../components/dashboard/MessagesManager";
import { ProjectManager } from "../components/dashboard/ProjectManager";
import { PageSeo } from "../components/seo/PageSeo";
import { useAuth } from "../context/AuthContext";
import type { BlogPost, ContactMessage, Project } from "../types";

type Tab = "overview" | "projects" | "blog" | "messages";

const tabs: { id: Tab; label: string; icon: typeof Sparkles }[] = [
  { id: "overview", label: "Overview", icon: Sparkles },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "blog", label: "Blog", icon: NotebookTabs },
  { id: "messages", label: "Messages", icon: Mailbox }
];

export function AdminDashboardPage() {
  const { token, user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [projects, setProjects] = useState<Project[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      return;
    }

    let active = true;

    async function load() {
      try {
        const [projectResponse, blogResponse, messageResponse] = await Promise.all([
          api.getAdminProjects(token),
          api.getAdminBlogPosts(token),
          api.getMessages(token)
        ]);

        if (!active) {
          return;
        }

        setProjects(projectResponse);
        setPosts(blogResponse);
        setMessages(messageResponse);
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : "Unable to load dashboard");
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
  }, [token]);

  const unreadCount = messages.filter((message) => !message.is_read).length;

  if (!token) {
    return null;
  }

  return (
    <div className="min-h-screen px-4 py-6 text-slate-900 dark:text-white sm:px-6">
      <PageSeo title="Admin Dashboard" description="Admin tools for projects, blog posts, and contact management." path="/admin" />

      <div className="mx-auto max-w-7xl space-y-8">
        <header className="glass-card p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <span className="inline-flex rounded-full border border-cyan/30 bg-cyan/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-cyan">
                Dashboard
              </span>
              <h1 className="mt-5 font-display text-4xl text-slate-950 dark:text-white">
                Welcome back, {user?.full_name}
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-400">
                Manage featured projects, publish blog posts with Markdown, respond to contact messages, and keep your public portfolio current.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/"
                className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                View site
              </Link>
              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                <LogOut size={16} />
                Sign out
              </button>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/60 p-5 dark:bg-white/5">
              <p className="text-sm text-slate-600 dark:text-slate-400">Projects</p>
              <p className="mt-3 font-display text-4xl text-slate-950 dark:text-white">{projects.length}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/60 p-5 dark:bg-white/5">
              <p className="text-sm text-slate-600 dark:text-slate-400">Posts</p>
              <p className="mt-3 font-display text-4xl text-slate-950 dark:text-white">{posts.length}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/60 p-5 dark:bg-white/5">
              <p className="text-sm text-slate-600 dark:text-slate-400">Unread messages</p>
              <p className="mt-3 font-display text-4xl text-slate-950 dark:text-white">{unreadCount}</p>
            </div>
          </div>
        </header>

        <div className="flex flex-wrap gap-3">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition ${
                activeTab === id
                  ? "bg-gradient-to-r from-cyan to-coral text-slate-950"
                  : "border border-white/10 bg-white/60 text-slate-700 dark:bg-white/10 dark:text-slate-200"
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        {loading ? <LoadingPanel label="Loading dashboard" /> : null}
        {error ? <p className="text-rose-400">{error}</p> : null}

        {!loading && activeTab === "overview" ? (
          <section className="grid gap-6 lg:grid-cols-2">
            <div className="glass-card p-6">
              <h2 className="font-display text-2xl text-slate-950 dark:text-white">Development credentials</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-400">
                Default local admin login is seeded from backend environment variables:
                <br />
                <span className="font-semibold text-slate-800 dark:text-slate-100">admin@portfolio.com / admin123</span>
              </p>
            </div>
            <div className="glass-card p-6">
              <h2 className="font-display text-2xl text-slate-950 dark:text-white">What’s wired in</h2>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
                <li>JWT authentication for admin-only routes</li>
                <li>Image uploads for projects and blog cover images</li>
                <li>Markdown blog authoring with live preview</li>
                <li>Stored contact messages with read/status updates</li>
              </ul>
            </div>
          </section>
        ) : null}

        {!loading && activeTab === "projects" ? (
          <ProjectManager token={token} projects={projects} onProjectsChange={setProjects} />
        ) : null}

        {!loading && activeTab === "blog" ? (
          <BlogManager token={token} posts={posts} onPostsChange={setPosts} />
        ) : null}

        {!loading && activeTab === "messages" ? (
          <MessagesManager token={token} messages={messages} onMessagesChange={setMessages} />
        ) : null}
      </div>
    </div>
  );
}
