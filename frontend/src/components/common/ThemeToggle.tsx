import { MoonStar, SunMedium } from "lucide-react";
import { useEffect, useState } from "react";

type Theme = "dark" | "light";

function getInitialTheme(): Theme {
  const stored = localStorage.getItem("portfolio_theme");
  if (stored === "dark" || stored === "light") {
    return stored;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme());

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark", "light");
    root.classList.add(theme);
    localStorage.setItem("portfolio_theme", theme);
  }, [theme]);

  return (
    <button
      type="button"
      onClick={() => setTheme((value) => (value === "dark" ? "light" : "dark"))}
      className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/90 px-4 py-2 text-sm font-medium text-slate-900 transition hover:border-cyan hover:text-cyan dark:border-white/15 dark:bg-white/10 dark:text-white"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <SunMedium size={16} /> : <MoonStar size={16} />}
      <span>{theme === "dark" ? "Light" : "Dark"}</span>
    </button>
  );
}
