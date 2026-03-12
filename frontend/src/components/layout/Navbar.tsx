import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import type { Profile } from "../../types";
import { ThemeToggle } from "../common/ThemeToggle";

const homeLinks = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Timeline", href: "#timeline" },
  { label: "Blog", href: "#blog" },
  { label: "Contact", href: "#contact" }
];

export function Navbar({ profile }: { profile?: Profile | null }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-white/70 backdrop-blur-xl dark:bg-slate-950/70">
      <div className="section-shell flex h-20 items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan to-coral font-display text-lg font-bold text-slate-950">
            AA
          </span>
          <div>
            <p className="font-display text-base font-semibold text-slate-950 dark:text-white">
              {profile?.name ?? "Aggimalla Abhishek"}
            </p>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
              Data Science & AI
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {isHome
            ? homeLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-sm font-medium text-slate-600 transition hover:text-cyan dark:text-slate-300"
                >
                  {item.label}
                </a>
              ))
            : null}
          <Link to="/blog" className="text-sm font-medium text-slate-600 transition hover:text-cyan dark:text-slate-300">
            Articles
          </Link>
          <Link
            to="/admin/login"
            className="rounded-full border border-cyan/30 px-4 py-2 text-sm font-medium text-slate-800 transition hover:border-cyan hover:text-cyan dark:text-white"
          >
            Admin
          </Link>
          <ThemeToggle />
        </nav>

        <button
          type="button"
          className="inline-flex rounded-full border border-white/15 p-3 text-slate-900 dark:text-white lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open ? (
        <div className="section-shell pb-6 lg:hidden">
          <div className="glass-card space-y-4 p-4">
            {isHome
              ? homeLinks.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-2xl px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-200/60 dark:text-slate-100 dark:hover:bg-white/10"
                  >
                    {item.label}
                  </a>
                ))
              : null}
            <Link
              to="/blog"
              onClick={() => setOpen(false)}
              className="block rounded-2xl px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-200/60 dark:text-slate-100 dark:hover:bg-white/10"
            >
              Articles
            </Link>
            <Link
              to="/admin/login"
              onClick={() => setOpen(false)}
              className="block rounded-2xl px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-200/60 dark:text-slate-100 dark:hover:bg-white/10"
            >
              Admin
            </Link>
            <ThemeToggle />
          </div>
        </div>
      ) : null}
    </header>
  );
}
