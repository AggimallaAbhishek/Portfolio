import { CheckCheck, FolderKanban, Mailbox, MessageCircle, NotebookTabs, Rocket } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { api } from "../api/client";
import { ActivityFeed } from "../components/dashboard/ActivityFeed";
import { DashboardSidebar } from "../components/dashboard/DashboardSidebar";
import { DashboardTopBar } from "../components/dashboard/DashboardTopBar";
import { OverviewCharts } from "../components/dashboard/OverviewCharts";
import { StatsCard } from "../components/dashboard/StatsCard";
import { BlogManager } from "../components/dashboard/BlogManager";
import { MessagesManager } from "../components/dashboard/MessagesManager";
import { ProjectManager } from "../components/dashboard/ProjectManager";
import { LoadingPanel } from "../components/common/LoadingPanel";
import { PageSeo } from "../components/seo/PageSeo";
import { useAuth } from "../context/AuthContext";
import type { BlogPost, ContactMessage, Project } from "../types";

type Section = "overview" | "projects" | "blog" | "messages" | "settings";

export function AdminDashboardPage() {
  const { token, user, logout } = useAuth();
  const [active, setActive] = useState<Section>("overview");
  const [projects, setProjects] = useState<Project[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!token) return;
    const authToken = token;
    let active = true;

    async function load() {
      try {
        const [projectResponse, blogResponse, messageResponse] = await Promise.all([
          api.getAdminProjects(authToken),
          api.getAdminBlogPosts(authToken),
          api.getMessages(authToken)
        ]);
        if (!active) return;
        setProjects(projectResponse);
        setPosts(blogResponse);
        setMessages(messageResponse);
      } catch (e) {
        if (active) setError(e instanceof Error ? e.message : "Failed to load dashboard");
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => { active = false; };
  }, [token]);

  const unreadCount = messages.filter((m) => !m.is_read).length;
  const publishedPosts = posts.filter((p) => p.published);

  // Build activity feed from available data
  const activityItems = useMemo(() => {
    const items: { type: "project" | "blog" | "message"; label: string; time: string }[] = [];

    for (const p of projects.slice(0, 3)) {
      items.push({
        type: "project",
        label: `Project added: "${p.title}"`,
        time: new Date(p.created_at).toLocaleDateString()
      });
    }
    for (const post of publishedPosts.slice(0, 3)) {
      items.push({
        type: "blog",
        label: `Blog published: "${post.title}"`,
        time: post.published_at ? new Date(post.published_at).toLocaleDateString() : "—"
      });
    }
    for (const msg of messages.slice(0, 3)) {
      items.push({
        type: "message",
        label: `Message from ${msg.name}: "${msg.subject}"`,
        time: new Date(msg.created_at).toLocaleDateString()
      });
    }

    return items.sort(() => Math.random() - 0.5).slice(0, 8);
  }, [projects, publishedPosts, messages]);

  if (!token) return null;

  return (
    <div className="flex min-h-screen">
      <PageSeo
        title="Admin Dashboard"
        description="Admin tools for projects, blog posts, and contact management."
        path="/admin"
      />

      {/* Left Sidebar */}
      <DashboardSidebar
        active={active}
        onChange={(s) => {
          setActive(s as Section);
          setIsSidebarOpen(false); // Close on mobile navigation
        }}
        userName={user?.full_name ?? "Admin"}
        userEmail={user?.email}
        unreadCount={unreadCount}
        onLogout={logout}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Content area — offset for sidebar on large screens */}
      <div className="flex flex-1 flex-col min-h-screen lg:ml-64">
        <DashboardTopBar
          section={active}
          unreadCount={unreadCount}
          onMenuClick={() => setIsSidebarOpen(true)}
        />

        <main className="flex-1 p-6 lg:p-8 space-y-8">
          {loading ? <LoadingPanel label="Loading dashboard…" /> : null}
          {error ? (
            <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-6 py-4 text-sm text-rose-400">
              {error}
            </div>
          ) : null}

          {/* ─── Overview ─── */}
          {!loading && active === "overview" && (
            <div className="space-y-8">
              {/* Stats Row */}
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatsCard
                  label="Total Projects"
                  value={projects.length}
                  icon={FolderKanban}
                  accentColor="cyan"
                  delay={0}
                />
                <StatsCard
                  label="Published Posts"
                  value={publishedPosts.length}
                  icon={NotebookTabs}
                  accentColor="purple"
                  delay={0.08}
                />
                <StatsCard
                  label="Unread Messages"
                  value={unreadCount}
                  icon={Mailbox}
                  accentColor="coral"
                  delay={0.16}
                />
                <StatsCard
                  label="Total Messages"
                  value={messages.length}
                  icon={MessageCircle}
                  accentColor="emerald"
                  delay={0.24}
                />
              </div>

              {/* Charts */}
              <OverviewCharts projects={projects} posts={posts} />

              {/* Activity + Quick Wins */}
              <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                <ActivityFeed items={activityItems} />

                {/* Quick actions */}
                <div className="glass-card p-6 space-y-4">
                  <h2 className="font-display text-sm font-semibold text-white mb-2">Quick Actions</h2>
                  {[
                    { label: "Add a new project", icon: Rocket, onClick: () => setActive("projects"), colorClass: "text-cyan" },
                    { label: "Write a blog post", icon: NotebookTabs, onClick: () => setActive("blog"), colorClass: "text-purple-400" },
                    { label: "Read messages", icon: CheckCheck, onClick: () => setActive("messages"), colorClass: "text-coral" }
                  ].map(({ label, icon: Icon, onClick, colorClass }) => (
                    <button
                      key={label}
                      type="button"
                      onClick={onClick}
                      className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
                    >
                      <Icon size={16} className={colorClass} />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ─── Projects ─── */}
          {!loading && active === "projects" && (
            <ProjectManager token={token} projects={projects} onProjectsChange={setProjects} />
          )}

          {/* ─── Blog ─── */}
          {!loading && active === "blog" && (
            <BlogManager token={token} posts={posts} onPostsChange={setPosts} />
          )}

          {/* ─── Messages ─── */}
          {!loading && active === "messages" && (
            <MessagesManager token={token} messages={messages} onMessagesChange={setMessages} />
          )}

          {/* ─── Settings (placeholder) ─── */}
          {!loading && active === "settings" && (
            <div className="glass-card p-8">
              <h2 className="font-display text-2xl font-bold text-white mb-2">Site Settings</h2>
              <p className="text-sm text-slate-400 mb-8">
                Edit your profile information, social links, and public portfolio settings.
              </p>

              <div className="grid gap-6 max-w-xl">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500">
                    Admin Email
                  </label>
                  <input
                    type="text"
                    readOnly
                    defaultValue={user?.email ?? ""}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500">
                    Display Name
                  </label>
                  <input
                    type="text"
                    readOnly
                    defaultValue={user?.full_name ?? ""}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300 outline-none"
                  />
                </div>
                <p className="text-xs text-slate-600 italic">
                  Profile CMS integration coming soon — edit profile via backend .env for now.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
