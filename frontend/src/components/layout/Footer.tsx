import { Github, Linkedin, Mail } from "lucide-react";

import type { Profile } from "../../types";

export function Footer({ profile }: { profile?: Profile | null }) {
  const socials = [
    { label: "GitHub", href: profile?.social_links.github, icon: Github },
    { label: "LinkedIn", href: profile?.social_links.linkedin, icon: Linkedin },
    { label: "Email", href: profile?.social_links.email, icon: Mail }
  ];

  return (
    <footer className="border-t border-white/10 py-10">
      <div className="section-shell flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-display text-lg font-semibold text-slate-950 dark:text-white">
            {profile?.name ?? "Aggimalla Abhishek"}
          </p>
          <p className="mt-2 max-w-xl text-sm text-slate-600 dark:text-slate-400">
            Building intelligent systems, secure backends, and thoughtful data-driven products.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {socials.map(({ label, href, icon: Icon }) =>
            href ? (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-slate-700 transition hover:border-cyan hover:text-cyan dark:text-slate-200"
              >
                <Icon size={16} />
                {label}
              </a>
            ) : null
          )}
        </div>
      </div>
    </footer>
  );
}
