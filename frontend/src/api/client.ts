import type {
  BlogPost,
  BlogPostPayload,
  ContactMessage,
  DashboardSummary,
  ExperienceItem,
  GitHubActivityItem,
  LoginResponse,
  Profile,
  Project,
  ProjectPayload
} from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api/v1";
const API_ASSET_URL =
  import.meta.env.VITE_API_ASSET_URL ?? API_BASE_URL.replace(/\/api\/v1$/, "");

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const headers = new Headers(options.headers ?? {});

  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as { detail?: string } | null;
    throw new ApiError(data?.detail ?? "Something went wrong", response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export const toAssetUrl = (value?: string | null) => {
  if (!value) {
    return "";
  }
  if (value.startsWith("http")) {
    return value;
  }
  return `${API_ASSET_URL}${value}`;
};

export const api = {
  getProfile: () => request<Profile>("/profile"),
  getProjects: () => request<Project[]>("/projects"),
  getProject: (slug: string) => request<Project>(`/projects/${slug}`),
  getExperience: () => request<ExperienceItem[]>("/experience"),
  getBlogPosts: () => request<BlogPost[]>("/blog/posts"),
  getBlogPost: (slug: string) => request<BlogPost>(`/blog/posts/${slug}`),
  getGitHubActivity: () => request<GitHubActivityItem[]>("/github/activity"),
  getSummary: () => request<DashboardSummary>("/summary"),
  sendContactMessage: (payload: { name: string; email: string; subject: string; message: string }) =>
    request<{ detail: string }>("/contact", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  login: (payload: { email: string; password: string }) =>
    request<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  me: (token: string) => request<LoginResponse["user"]>("/auth/me", {}, token),
  getAdminProjects: (token: string) => request<Project[]>("/admin/projects", {}, token),
  createProject: (token: string, payload: ProjectPayload) =>
    request<Project>("/admin/projects", {
      method: "POST",
      body: JSON.stringify(payload)
    }, token),
  updateProject: (token: string, id: number, payload: ProjectPayload) =>
    request<Project>(`/admin/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload)
    }, token),
  deleteProject: (token: string, id: number) =>
    request<void>(`/admin/projects/${id}`, { method: "DELETE" }, token),
  getAdminBlogPosts: (token: string) => request<BlogPost[]>("/admin/blog/posts", {}, token),
  createBlogPost: (token: string, payload: BlogPostPayload) =>
    request<BlogPost>("/admin/blog/posts", {
      method: "POST",
      body: JSON.stringify(payload)
    }, token),
  updateBlogPost: (token: string, id: number, payload: BlogPostPayload) =>
    request<BlogPost>(`/admin/blog/posts/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload)
    }, token),
  deleteBlogPost: (token: string, id: number) =>
    request<void>(`/admin/blog/posts/${id}`, { method: "DELETE" }, token),
  getMessages: (token: string) => request<ContactMessage[]>("/admin/messages", {}, token),
  updateMessage: (token: string, id: number, payload: { status: string; is_read: boolean }) =>
    request<ContactMessage>(`/admin/messages/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload)
    }, token),
  deleteMessage: (token: string, id: number) =>
    request<void>(`/admin/messages/${id}`, { method: "DELETE" }, token),
  uploadImage: async (token: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return request<{ file_name: string; file_url: string }>(
      "/admin/uploads/image",
      {
        method: "POST",
        body: formData
      },
      token
    );
  }
};

export { ApiError };
