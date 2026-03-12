import { MailOpen, Trash2 } from "lucide-react";

import { api } from "../../api/client";
import type { ContactMessage } from "../../types";

export function MessagesManager({
  token,
  messages,
  onMessagesChange
}: {
  token: string;
  messages: ContactMessage[];
  onMessagesChange: (messages: ContactMessage[]) => void;
}) {
  async function updateMessage(message: ContactMessage, payload: { status: string; is_read: boolean }) {
    const updated = await api.updateMessage(token, message.id, payload);
    onMessagesChange(messages.map((item) => (item.id === updated.id ? updated : item)));
  }

  async function deleteMessage(messageId: number) {
    if (!window.confirm("Delete this message?")) {
      return;
    }
    await api.deleteMessage(token, messageId);
    onMessagesChange(messages.filter((message) => message.id !== messageId));
  }

  return (
    <div className="grid gap-5">
      {messages.map((message) => (
        <article key={message.id} className="glass-card space-y-5 p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="font-display text-2xl text-slate-950 dark:text-white">{message.subject}</h3>
                <span
                  className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] ${
                    message.is_read
                      ? "border border-emerald-400/20 bg-emerald-400/10 text-emerald-400"
                      : "border border-coral/30 bg-coral/10 text-coral"
                  }`}
                >
                  {message.is_read ? "Read" : "New"}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                {message.name} • {message.email}
              </p>
              <p className="mt-2 text-xs uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
                {new Date(message.created_at).toLocaleString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "numeric",
                  minute: "numeric"
                })}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <select
                value={message.status}
                onChange={(event) =>
                  updateMessage(message, { status: event.target.value, is_read: message.is_read })
                }
                className="rounded-full border border-white/10 bg-white/70 px-4 py-2 text-sm text-slate-900 dark:bg-white/10 dark:text-white"
              >
                <option value="new">new</option>
                <option value="in-progress">in-progress</option>
                <option value="resolved">resolved</option>
              </select>
              <button
                type="button"
                onClick={() => updateMessage(message, { status: message.status, is_read: !message.is_read })}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-slate-700 dark:text-slate-200"
              >
                <MailOpen size={16} />
                {message.is_read ? "Mark unread" : "Mark read"}
              </button>
              <button
                type="button"
                onClick={() => deleteMessage(message.id)}
                className="inline-flex items-center gap-2 rounded-full border border-rose-400/20 px-4 py-2 text-sm text-rose-400"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
          <p className="rounded-3xl border border-white/10 bg-white/60 p-5 text-sm leading-8 text-slate-700 dark:bg-white/5 dark:text-slate-300">
            {message.message}
          </p>
        </article>
      ))}
    </div>
  );
}
