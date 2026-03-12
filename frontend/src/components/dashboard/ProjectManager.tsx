import { Plus, Trash2 } from "lucide-react";
import { useState, type FormEvent } from "react";

import { api, toAssetUrl } from "../../api/client";
import type { Project, ProjectImage, ProjectPayload } from "../../types";
import { ImageUploader } from "./ImageUploader";

interface ProjectManagerProps {
  token: string;
  projects: Project[];
  onProjectsChange: (projects: Project[]) => void;
}

interface ProjectFormState {
  id?: number;
  title: string;
  summary: string;
  description: string;
  techStackText: string;
  github_url: string;
  live_url: string;
  featured: boolean;
  sort_order: number;
  images: ProjectImage[];
}

const emptyProjectForm: ProjectFormState = {
  title: "",
  summary: "",
  description: "",
  techStackText: "",
  github_url: "",
  live_url: "",
  featured: true,
  sort_order: 1,
  images: []
};

function toFormState(project: Project): ProjectFormState {
  return {
    id: project.id,
    title: project.title,
    summary: project.summary,
    description: project.description,
    techStackText: project.tech_stack.join(", "),
    github_url: project.github_url ?? "",
    live_url: project.live_url ?? "",
    featured: project.featured,
    sort_order: project.sort_order,
    images: project.images.map((image) => ({ ...image }))
  };
}

export function ProjectManager({ token, projects, onProjectsChange }: ProjectManagerProps) {
  const [form, setForm] = useState<ProjectFormState>(emptyProjectForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sortedProjects = [...projects].sort((a, b) => a.sort_order - b.sort_order);

  function resetForm() {
    setForm(emptyProjectForm);
    setError(null);
  }

  function updateImage(index: number, field: keyof ProjectImage, value: string | number) {
    setForm((current) => ({
      ...current,
      images: current.images.map((image, imageIndex) =>
        imageIndex === index ? { ...image, [field]: value } : image
      )
    }));
  }

  function buildPayload(): ProjectPayload {
    return {
      title: form.title,
      summary: form.summary,
      description: form.description,
      tech_stack: form.techStackText
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      github_url: form.github_url || null,
      live_url: form.live_url || null,
      featured: form.featured,
      sort_order: Number(form.sort_order),
      images: form.images
        .filter((image) => image.image_url.trim())
        .map((image, index) => ({
          image_url: image.image_url,
          alt_text: image.alt_text ?? "",
          sort_order: image.sort_order || index + 1
        }))
    };
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      let nextProjects: Project[];
      if (form.id) {
        const updated = await api.updateProject(token, form.id, buildPayload());
        nextProjects = projects.map((project) => (project.id === updated.id ? updated : project));
      } else {
        const created = await api.createProject(token, buildPayload());
        nextProjects = [...projects, created];
      }
      onProjectsChange(nextProjects);
      resetForm();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save project");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this project?")) {
      return;
    }
    await api.deleteProject(token, id);
    onProjectsChange(projects.filter((project) => project.id !== id));
    if (form.id === id) {
      resetForm();
    }
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[1fr_0.9fr]">
      <form onSubmit={handleSubmit} className="glass-card space-y-5 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-2xl text-slate-950 dark:text-white">
              {form.id ? "Edit project" : "Create project"}
            </h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Manage portfolio cards, technology filters, and project gallery images.
            </p>
          </div>
          {form.id ? (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-700 dark:text-slate-200"
            >
              New
            </button>
          ) : null}
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Title</span>
            <input
              required
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
              className="w-full rounded-2xl border border-white/10 bg-white/70 px-4 py-3 text-slate-900 dark:bg-white/10 dark:text-white"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Sort order</span>
            <input
              required
              type="number"
              value={form.sort_order}
              onChange={(event) => setForm((current) => ({ ...current, sort_order: Number(event.target.value) }))}
              className="w-full rounded-2xl border border-white/10 bg-white/70 px-4 py-3 text-slate-900 dark:bg-white/10 dark:text-white"
            />
          </label>
        </div>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Summary</span>
          <input
            required
            value={form.summary}
            onChange={(event) => setForm((current) => ({ ...current, summary: event.target.value }))}
            className="w-full rounded-2xl border border-white/10 bg-white/70 px-4 py-3 text-slate-900 dark:bg-white/10 dark:text-white"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Description</span>
          <textarea
            required
            rows={5}
            value={form.description}
            onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
            className="w-full rounded-2xl border border-white/10 bg-white/70 px-4 py-3 text-slate-900 dark:bg-white/10 dark:text-white"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Tech stack</span>
          <input
            required
            value={form.techStackText}
            onChange={(event) => setForm((current) => ({ ...current, techStackText: event.target.value }))}
            placeholder="Python, FastAPI, React, PostgreSQL"
            className="w-full rounded-2xl border border-white/10 bg-white/70 px-4 py-3 text-slate-900 dark:bg-white/10 dark:text-white"
          />
        </label>

        <div className="grid gap-5 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">GitHub URL</span>
            <input
              value={form.github_url}
              onChange={(event) => setForm((current) => ({ ...current, github_url: event.target.value }))}
              className="w-full rounded-2xl border border-white/10 bg-white/70 px-4 py-3 text-slate-900 dark:bg-white/10 dark:text-white"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Live demo URL</span>
            <input
              value={form.live_url}
              onChange={(event) => setForm((current) => ({ ...current, live_url: event.target.value }))}
              className="w-full rounded-2xl border border-white/10 bg-white/70 px-4 py-3 text-slate-900 dark:bg-white/10 dark:text-white"
            />
          </label>
        </div>

        <label className="inline-flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-200">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(event) => setForm((current) => ({ ...current, featured: event.target.checked }))}
          />
          Featured project
        </label>

        <div className="space-y-4 rounded-3xl border border-white/10 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-display text-xl text-slate-950 dark:text-white">Project images</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Add screenshots for the public gallery.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setForm((current) => ({
                  ...current,
                  images: [...current.images, { image_url: "", alt_text: "", sort_order: current.images.length + 1 }]
                }))
              }
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-slate-700 dark:text-slate-200"
            >
              <Plus size={16} />
              Add image
            </button>
          </div>

          <ImageUploader
            token={token}
            onUploaded={(fileUrl) =>
              setForm((current) => ({
                ...current,
                images: [
                  ...current.images,
                  { image_url: fileUrl, alt_text: current.title || "Project image", sort_order: current.images.length + 1 }
                ]
              }))
            }
          />

          <div className="space-y-4">
            {form.images.map((image, index) => (
              <div key={`${image.image_url}-${index}`} className="rounded-3xl border border-white/10 p-4">
                <div className="grid gap-4 md:grid-cols-[1.1fr_0.8fr_auto]">
                  <div className="space-y-2">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Image URL</span>
                    <input
                      value={image.image_url}
                      onChange={(event) => updateImage(index, "image_url", event.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-white/70 px-4 py-3 text-slate-900 dark:bg-white/10 dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Alt text</span>
                    <input
                      value={image.alt_text ?? ""}
                      onChange={(event) => updateImage(index, "alt_text", event.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-white/70 px-4 py-3 text-slate-900 dark:bg-white/10 dark:text-white"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setForm((current) => ({
                        ...current,
                        images: current.images.filter((_, imageIndex) => imageIndex !== index)
                      }))
                    }
                    className="self-end rounded-full border border-rose-400/20 px-4 py-3 text-rose-400"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                {image.image_url ? (
                  <img
                    src={toAssetUrl(image.image_url)}
                    alt={image.alt_text ?? "Project preview"}
                    className="mt-4 h-40 w-full rounded-3xl object-cover"
                  />
                ) : null}
              </div>
            ))}
          </div>
        </div>

        {error ? <p className="text-sm text-rose-400">{error}</p> : null}
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-gradient-to-r from-cyan to-coral px-6 py-3 font-semibold text-slate-950 disabled:opacity-60"
        >
          {saving ? "Saving..." : form.id ? "Update project" : "Publish project"}
        </button>
      </form>

      <div className="space-y-5">
        {sortedProjects.map((project) => (
          <article key={project.id} className="glass-card overflow-hidden">
            {project.images[0] ? (
              <img
                src={toAssetUrl(project.images[0].image_url)}
                alt={project.images[0].alt_text ?? project.title}
                className="h-48 w-full object-cover"
              />
            ) : null}
            <div className="space-y-4 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-display text-xl text-slate-950 dark:text-white">{project.title}</h4>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{project.summary}</p>
                </div>
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-500 dark:text-slate-300">
                  #{project.sort_order}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.tech_stack.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-700 dark:text-slate-200"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setForm(toFormState(project))}
                  className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-700 dark:text-slate-200"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(project.id)}
                  className="rounded-full border border-rose-400/20 px-4 py-2 text-sm text-rose-400"
                >
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
