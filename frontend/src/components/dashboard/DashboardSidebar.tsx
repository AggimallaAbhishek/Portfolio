import { AnimatePresence, motion } from "framer-motion";
import {
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Mailbox,
  NotebookTabs,
  Settings,
  SquareUser,
  X
} from "lucide-react";
import { Link } from "react-router-dom";

type Section = "overview" | "projects" | "blog" | "messages" | "settings";

const navItems: { id: Section; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "blog", label: "Blog Posts", icon: NotebookTabs },
  { id: "messages", label: "Messages", icon: Mailbox },
  { id: "settings", label: "Settings", icon: Settings }
];

interface DashboardSidebarProps {
  active: Section;
  onChange: (section: Section) => void;
  userName: string;
  userEmail?: string;
  unreadCount: number;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export function DashboardSidebar({
  active,
  onChange,
  userName,
  userEmail,
  unreadCount,
  onLogout,
  isOpen,
  onClose
}: DashboardSidebarProps) {
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : "-100%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-white/10 bg-slate-950 shadow-2xl lg:translate-x-0"
      >
        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-5">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-cyan to-coral text-sm font-bold text-slate-950">
              AA
            </span>
            <div>
              <p className="text-sm font-semibold text-white">Admin Panel</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">Portfolio CMS</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400 lg:hidden"
          >
            <X size={16} />
          </button>
        </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-1">
        {navItems.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-white/10 text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-xl bg-white/10 border border-white/10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              )}
              <span className={`relative z-10 ${isActive ? "text-cyan" : "text-slate-500 group-hover:text-slate-300"}`}>
                <Icon size={17} />
              </span>
              <span className="relative z-10">{label}</span>
              {id === "messages" && unreadCount > 0 && (
                <span className="relative z-10 ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-coral/90 px-1.5 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom: User + Actions */}
      <div className="border-t border-white/10 px-4 py-4 space-y-3">
        <Link
          to="/"
          target="_blank"
          className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-slate-400 hover:bg-white/5 hover:text-slate-200 transition"
        >
          <SquareUser size={14} />
          View public portfolio
        </Link>

        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition"
        >
          <LogOut size={14} />
          Sign out
        </button>

        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple to-cyan text-xs font-bold text-white">
            {initials}
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-slate-200">{userName}</p>
            {userEmail && (
              <p className="truncate text-[10px] text-slate-500">{userEmail}</p>
            )}
          </div>
        </div>
      </div>
      </motion.aside>
    </>
  );
}
