import { startTransition, useEffect, useState } from "react";

import { api } from "../api/client";
import { LoadingPanel } from "../components/common/LoadingPanel";
import { AboutSection } from "../components/home/AboutSection";
import { BlogSection } from "../components/home/BlogSection";
import { ContactSection } from "../components/home/ContactSection";
import { GitHubActivitySection } from "../components/home/GitHubActivitySection";
import { HeroSection } from "../components/home/HeroSection";
import { ProjectsSection } from "../components/home/ProjectsSection";
import { TimelineSection } from "../components/home/TimelineSection";
import { Footer } from "../components/layout/Footer";
import { Navbar } from "../components/layout/Navbar";
import { PageSeo } from "../components/seo/PageSeo";
import type {
  BlogPost,
  DashboardSummary,
  ExperienceItem,
  GitHubActivityItem,
  Profile,
  Project
} from "../types";

interface HomeState {
  profile: Profile;
  summary: DashboardSummary;
  projects: Project[];
  experiences: ExperienceItem[];
  posts: BlogPost[];
  activity: GitHubActivityItem[];
}

export function HomePage() {
  const [data, setData] = useState<HomeState | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const [profile, summary, projects, experiences, posts, activity] = await Promise.all([
          api.getProfile(),
          api.getSummary(),
          api.getProjects(),
          api.getExperience(),
          api.getBlogPosts(),
          api.getGitHubActivity()
        ]);

        if (!active) {
          return;
        }

        startTransition(() => {
          setData({ profile, summary, projects, experiences, posts, activity });
        });
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : "Unable to load portfolio");
        }
      }
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  if (error) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="section-shell py-24">
          <div className="glass-card p-8">
            <p className="text-lg text-rose-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <LoadingPanel label="Loading portfolio" />
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-900 dark:text-white">
      <PageSeo
        title="Portfolio"
        description="Portfolio of Aggimalla Abhishek, a Data Science and AI student at IIIT Dharwad building intelligent systems and full-stack applications."
      />
      <Navbar profile={data.profile} />
      <main>
        <HeroSection profile={data.profile} summary={data.summary} />
        <AboutSection profile={data.profile} />
        <ProjectsSection projects={data.projects} />
        <TimelineSection experiences={data.experiences} />
        <BlogSection posts={data.posts} />
        <GitHubActivitySection items={data.activity} />
        <ContactSection profile={data.profile} />
      </main>
      <Footer profile={data.profile} />
    </div>
  );
}
