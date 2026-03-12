import { Navigate, useNavigate } from "react-router-dom";
import { useState, type FormEvent } from "react";

import { useAuth } from "../context/AuthContext";
import { PageSeo } from "../components/seo/PageSeo";

export function AdminLoginPage() {
  const navigate = useNavigate();
  const { token, login } = useAuth();
  const [email, setEmail] = useState("admin@portfolio.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (token) {
    return <Navigate to="/admin" replace />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(email, password);
      navigate("/admin");
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Unable to sign in");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <PageSeo title="Admin Login" description="Admin access for portfolio dashboard." path="/admin/login" />
      <div className="glass-card w-full max-w-lg p-8">
        <span className="inline-flex rounded-full border border-cyan/30 bg-cyan/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-cyan">
          Admin Access
        </span>
        <h1 className="mt-6 font-display text-4xl text-slate-950 dark:text-white">Manage the portfolio</h1>
        <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
          Use the seeded admin credentials for local development, then rotate them in production.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Email</span>
            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/70 px-4 py-3 text-slate-900 dark:bg-white/10 dark:text-white"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Password</span>
            <input
              required
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/70 px-4 py-3 text-slate-900 dark:bg-white/10 dark:text-white"
            />
          </label>
          {error ? <p className="text-sm text-rose-400">{error}</p> : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-gradient-to-r from-cyan to-coral px-6 py-3 font-semibold text-slate-950 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
