import { ArrowRight, Github, Linkedin, Mail } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

import type { DashboardSummary, Profile } from "../../types";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
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
  const statsParallax = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);

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
    <section className="section-shell pt-14 sm:pt-24 pb-16">
      <motion.div
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: 0.15 }}
        className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]"
      >
        <div className="space-y-8">
          <motion.span
            variants={fadeUp}
            className="inline-flex rounded-full border border-cyan/40 bg-cyan/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-cyan backdrop-blur-md"
          >
            Portfolio {currentYear}
          </motion.span>

          <motion.div variants={fadeUp} className="space-y-6">
            <h1 className="font-display text-5xl leading-[1.05] tracking-tight text-slate-900 sm:text-6xl lg:text-7xl dark:text-white">
              {headlineName ? (
                <span className="block mb-2">
                  {headlineName}{" "}
                </span>
              ) : null}
              <span className="name-glow block bg-gradient-to-r from-cyan via-purple to-coral bg-clip-text text-transparent dark:from-cyan dark:via-purple dark:to-coral">
                {highlightName}
              </span>
            </h1>
            <p className="max-w-2xl text-xl leading-relaxed text-slate-700 dark:text-slate-300">
              {profile.role}. {profile.tagline}
            </p>
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-400"
          >
            I build AI-powered products, resilient backend APIs, and clean user experiences that make complex systems feel approachable.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-5 pt-4">
            <motion.a
              href="#projects"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-7 py-3.5 font-semibold text-white shadow-xl transition-all hover:shadow-cyan/20 dark:bg-white dark:text-slate-950"
            >
              View Projects
              <ArrowRight size={18} />
            </motion.a>
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/50 backdrop-blur-sm px-7 py-3.5 font-semibold text-slate-800 transition hover:border-cyan hover:bg-cyan/5 hover:text-cyan dark:border-white/20 dark:bg-white/5 dark:text-white"
            >
              Contact Me
            </motion.a>
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-4 pt-4">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/60 backdrop-blur-md px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-cyan hover:bg-cyan/10 hover:text-cyan dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
              >
                <Icon size={16} />
                {label}
              </motion.a>
            ))}
          </motion.div>
        </div>

        <motion.div variants={fadeUp} className="relative mt-8 lg:mt-0">
          <div className="glass-card relative overflow-hidden p-8 lg:p-10 border-white/40 dark:border-white/20">
            {/* Inner Content - Lifted parallax removed bg elements */}
            <div className="relative space-y-10" style={{ transform: `translateY(${statsParallax.get()})` }}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold tracking-[0.2em] text-cyan uppercase mb-3">Focus Areas</p>
                  <h2 className="font-display text-3xl font-bold text-slate-900 dark:text-white">AI + Backend + Data</h2>
                </div>
                {badgeText ? (
                  <span className="animate-float rounded-full border border-slate-300 dark:border-white/20 bg-white/50 dark:bg-white/10 backdrop-blur-md px-4 py-2 text-sm font-medium text-slate-800 dark:text-white shadow-sm">
                    {badgeText}
                  </span>
                ) : null}
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="rounded-[2rem] border border-slate-200 dark:border-white/10 bg-white/40 dark:bg-white/5 p-6 backdrop-blur-sm">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Projects Built</p>
                  <p className="mt-2 font-display text-5xl font-bold text-slate-900 dark:text-white">{summary.project_count}+</p>
                </div>
                <div className="rounded-[2rem] border border-slate-200 dark:border-white/10 bg-white/40 dark:bg-white/5 p-6 backdrop-blur-sm">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Articles Written</p>
                  <p className="mt-2 font-display text-5xl font-bold text-slate-900 dark:text-white">{summary.published_posts}</p>
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-200 dark:border-white/10 bg-white/40 dark:bg-slate-950/40 p-6 backdrop-blur-sm">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-4">Core Technology Stack</p>
                <div className="flex flex-wrap gap-2.5">
                  {summary.technologies.slice(0, 6).map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-cyan/30 bg-cyan/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-cyan dark:text-cyan"
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
