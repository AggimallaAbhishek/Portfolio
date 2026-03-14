import { Bell, Menu, Search } from "lucide-react";

const sectionTitles = {
  overview: "Overview",
  projects: "Project Manager",
  blog: "Blog Manager",
  messages: "Message Inbox",
  settings: "Settings"
};

interface DashboardTopBarProps {
  section: keyof typeof sectionTitles;
  unreadCount: number;
  onMenuClick: () => void;
}

export function DashboardTopBar({ section, unreadCount, onMenuClick }: DashboardTopBarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-white/10 bg-slate-950/60 px-4 sm:px-6 backdrop-blur-xl">
      <button
        type="button"
        onClick={onMenuClick}
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition hover:border-white/20 hover:text-white lg:hidden"
        aria-label="Toggle menu"
      >
        <Menu size={18} />
      </button>

      <div className="flex-1">
        <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Admin</p>
        <h1 className="font-display text-lg font-semibold text-white leading-tight">
          {sectionTitles[section]}
        </h1>
      </div>

      {/* Search */}
      <div className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 sm:flex">
        <Search size={14} className="text-slate-500" />
        <input
          type="text"
          placeholder="Search..."
          className="w-40 bg-transparent text-sm text-slate-300 placeholder-slate-600 outline-none"
        />
      </div>

      {/* Notifications */}
      <button
        type="button"
        className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition hover:border-white/20 hover:text-white"
        aria-label="Notifications"
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-coral text-[9px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>
    </header>
  );
}
