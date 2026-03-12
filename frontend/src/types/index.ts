export interface Skill {
  id: number;
  name: string;
  category: string;
  sort_order: number;
}

export interface ProjectImage {
  id?: number;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  summary: string;
  description: string;
  tech_stack: string[];
  github_url: string | null;
  live_url: string | null;
  featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  images: ProjectImage[];
}

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
}

export interface BlogTag {
  id: number;
  name: string;
  slug: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content_markdown: string;
  cover_image: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  author_name: string;
  category: BlogCategory | null;
  tags: BlogTag[];
}

export interface ExperienceItem {
  id: number;
  title: string;
  organization: string;
  experience_type: "education" | "internship" | "achievement" | "certification";
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  description: string;
  highlight: string | null;
  sort_order: number;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  is_read: boolean;
  created_at: string;
}

export interface DashboardSummary {
  project_count: number;
  published_posts: number;
  unread_messages: number;
  technologies: string[];
}

export interface Profile {
  name: string;
  role: string;
  bio: string;
  tagline: string;
  location: string;
  social_links: Record<string, string>;
  skills: Record<string, Skill[]>;
}

export interface GitHubActivityItem {
  id: string;
  type: string;
  repo_name: string;
  created_at: string | null;
  url: string | null;
  message: string;
}

export interface AuthUser {
  id: number;
  email: string;
  full_name: string;
  is_admin: boolean;
  created_at: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: "bearer";
  user: AuthUser;
}

export interface ProjectPayload {
  title: string;
  summary: string;
  description: string;
  tech_stack: string[];
  github_url: string | null;
  live_url: string | null;
  featured: boolean;
  sort_order: number;
  images: ProjectImage[];
}

export interface BlogPostPayload {
  title: string;
  excerpt: string;
  content_markdown: string;
  cover_image: string | null;
  published: boolean;
  category: string | null;
  tags: string[];
}
