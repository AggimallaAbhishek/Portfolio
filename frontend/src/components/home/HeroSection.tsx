import { ArrowRight, Github, Linkedin, Mail } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

import type { DashboardSummary, Profile } from "../../types";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 }
};

export function HeroSection({
  profile,
  summary
}: {
  profile: Profile;
  summary: DashboardSummary;
}) {
  const { scrollYProgress } = useScroll();
  const bgParallax = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);
  const statsParallax = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const ambientParallax = useTransform(scrollYProgress, [0, 1], ["0%", "-22%"]);

  const [firstName, ...restName] = profile.name.trim().split(" ");
  const lastName = restName.join(" ");
  const highlightName = lastName || firstName;
  const headlineName = lastName ? firstName : "";
  const currentYear = new Date().getFullYear();
  const badgeText = profile.location || profile.role;

  const socialLinks = [
    { label: "GitHub", href: profile.social_links.github, icon: Github },
    { label: "LinkedIn", href: profile.social_links.linkedin, icon: Linkedin },
    { label: "Email", href: profile.social_links.email, icon: Mail }
  ];

  return (
    <section className="section-shell pt-14 sm:pt-20">
      <motion.div
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: 0.12 }}
        className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]"
      >
        <div className="space-y-8">
          <motion.span
            variants={fadeUp}
            className="inline-flex rounded-full border border-cyan/30 bg-cyan/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-cyan"
          >
            Portfolio {currentYear}
          </motion.span>

          <motion.div variants={fadeUp} className="space-y-5">
            <h1 className="font-display text-5xl leading-[0.95] text-slate-950 dark:text-white sm:text-6xl lg:text-7xl">
              {headlineName ? (
                <span className="name-glow bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent dark:text-white">
                  {headlineName}{" "}
                </span>
              ) : null}
              <span className="name-glow block bg-gradient-to-r from-cyan via-slate-900/60 to-coral bg-clip-text text-transparent dark:from-cyan dark:via-white dark:to-coral">
                {highlightName}
              </span>
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              {profile.role}. {profile.tagline}
            </p>
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-400"
          >
            I build AI-powered products, resilient backend APIs, and clean user experiences that make complex systems feel approachable.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4">
            <a
              href="#projects"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan to-coral px-6 py-3 font-semibold text-slate-950 transition hover:scale-[1.02]"
            >
              View Projects
              <ArrowRight size={18} />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 font-semibold text-slate-800 transition hover:border-cyan hover:text-cyan dark:text-white"
            >
              Contact Me
            </a>
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/60 px-4 py-2 text-sm text-slate-800 transition hover:border-cyan hover:text-cyan dark:bg-white/10 dark:text-slate-100"
              >
                <Icon size={16} />
                {label}
              </a>
            ))}
          </motion.div>
        </div>

        <motion.div variants={fadeUp} className="relative">
          <div className="glass-card relative overflow-hidden p-8">
            <motion.div
              className="hero-ambient"
              style={{ y: ambientParallax }}
              aria-hidden
            />
            <motion.div
              className="absolute inset-0 bg-hero-mesh opacity-80"
              style={{ y: bgParallax as unknown as number }}
            />
            <div className="relative space-y-8" style={{ transform: `translateY(${statsParallax.get()})` }}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-cyan">Focus Areas</p>
                  <h2 className="mt-3 font-display text-3xl text-white">AI + Backend + Data</h2>
                </div>
                {badgeText ? (
                  <span className="animate-float rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white">
                    {badgeText}
                  </span>
                ) : null}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-white/10 p-5">
                  <p className="text-sm text-slate-300">Projects</p>
                  <p className="mt-3 font-display text-4xl text-white">{summary.project_count}+</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/10 p-5">
                  <p className="text-sm text-slate-300">Published Articles</p>
                  <p className="mt-3 font-display text-4xl text-white">{summary.published_posts}</p>
                </div>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-slate-950/30 p-5">
                <p className="text-sm text-slate-300">Core stack</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {summary.technologies.slice(0, 6).map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-cyan/20 bg-cyan/10 px-3 py-1 text-xs font-medium text-cyan"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
