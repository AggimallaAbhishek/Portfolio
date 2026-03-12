import { Send } from "lucide-react";
import { useState, type FormEvent } from "react";

import { api } from "../../api/client";
import type { Profile } from "../../types";
import { SectionHeading } from "../common/SectionHeading";

const initialForm = {
  name: "",
  email: "",
  subject: "",
  message: ""
};

export function ContactSection({ profile }: { profile: Profile }) {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setFeedback(null);
    setError(null);

    try {
      const response = await api.sendContactMessage(form);
      setFeedback(response.detail);
      setForm(initialForm);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Unable to send message");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="contact" className="section-gap">
      <div className="section-shell grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-6">
          <SectionHeading
            eyebrow="Contact"
            title="Let’s build something useful together."
            description="If you want to collaborate on AI, backend engineering, or full-stack product work, send a message here or reach out directly."
          />
          <div className="glass-card space-y-4 p-6">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Email
            </p>
            <a
              href={profile.social_links.email}
              className="font-display text-2xl text-slate-950 hover:text-cyan dark:text-white"
            >
              abhishek.aggimalla.dev@gmail.com
            </a>
            <p className="text-sm leading-7 text-slate-600 dark:text-slate-400">
              I’m happy to discuss internships, research ideas, portfolio collaborations, and interesting product problems.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="glass-card space-y-5 p-8">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Name</span>
              <input
                required
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                className="w-full rounded-2xl border border-white/10 bg-white/70 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan dark:bg-white/10 dark:text-white"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Email</span>
              <input
                required
                type="email"
                value={form.email}
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                className="w-full rounded-2xl border border-white/10 bg-white/70 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan dark:bg-white/10 dark:text-white"
              />
            </label>
          </div>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Subject</span>
            <input
              required
              value={form.subject}
              onChange={(event) => setForm((current) => ({ ...current, subject: event.target.value }))}
              className="w-full rounded-2xl border border-white/10 bg-white/70 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan dark:bg-white/10 dark:text-white"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Message</span>
            <textarea
              required
              rows={6}
              value={form.message}
              onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
              className="w-full rounded-2xl border border-white/10 bg-white/70 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan dark:bg-white/10 dark:text-white"
            />
          </label>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan to-coral px-6 py-3 font-semibold text-slate-950 disabled:opacity-60"
            >
              <Send size={16} />
              {submitting ? "Sending..." : "Send message"}
            </button>
            {feedback ? <p className="text-sm text-emerald-400">{feedback}</p> : null}
            {error ? <p className="text-sm text-rose-400">{error}</p> : null}
          </div>
        </form>
      </div>
    </section>
  );
}
