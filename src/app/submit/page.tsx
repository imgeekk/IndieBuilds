"use client";

import { useSession, signIn } from "@/lib/auth-client";
import Navbar from "@/components/Navbar";
import { useState } from "react";
import { useSubmitLaunch } from "@/hooks/useSubmitLaunch";
import { Loader } from "@/components/loader-4";
import TagInput from "@/components/TagInput";
import { Spinner } from "@/components/ui/spinner";
import { createLaunchSchema } from "@/lib/validations";

export default function SubmitPage() {
  const { data: session, isPending } = useSession();
  const { submit, submitting, error, setError } = useSubmitLaunch();

  const [form, setForm] = useState({
    name: "",
    tagline: "",
    url: "",
    description: "",
    stack: [] as string[],
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  if (isPending) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex justify-center py-20">
          <Loader />
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-lg mx-auto px-4 py-20 text-center">
          <p className="text-muted mb-4">Sign in with GitHub to submit your launch.</p>
          <button
            onClick={() => signIn.social({ provider: "github", callbackURL: "/submit" })}
            className="bg-purple-500 hover:bg-purple-400 text-white font-[inter-medium] px-5 py-2 rounded-sm transition-colors cursor-pointer"
          >
            Sign in with GitHub
          </button>
        </div>
      </div>
    );
  }

  async function handleSubmit() {
    const result = createLaunchSchema.safeParse(form);

    if (!result.success) {
      const errors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as string;
        if (!errors[field]) errors[field] = issue.message;
      }
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setError("");
    submit(result.data);
  }

  return (
    <div className="min-h-screen bg-background font-[inter-regular]">
      <Navbar />
      <main className="max-w-lg mx-auto px-4 py-10 text-secondary">
        <h1 className="text-xl font-[inter-semibold] mb-1">Submit your launch</h1>
        <p className="text-sm text-muted mb-8">One launch per week. Must be live, not a waitlist.</p>

        <div className="flex flex-col gap-5">

          <Field label="Project name">
            <input
              value={form.name}
              onChange={(e) => {
                setForm((f) => ({ ...f, name: e.target.value }));
                setFieldErrors((prev) => ({ ...prev, name: "" }));
              }}
              onBlur={() => {
                const r = createLaunchSchema.shape.name.safeParse(form.name);
                if (!r.success) setFieldErrors((prev) => ({ ...prev, name: r.error.issues[0].message }));
                else setFieldErrors((prev) => ({ ...prev, name: "" }));
              }}
              placeholder="e.g. Cron Monitor"
              maxLength={60}
              className={`bg-card border rounded-md w-full px-3 py-2 text-foreground text-sm placeholder:text-muted outline-offset-1 focus:outline-1 outline-purple-500 ${fieldErrors.name ? "border-red-500" : "border-card-border"}`}
            />
            {fieldErrors.name && <p className="text-xs text-red-400 mt-1">{fieldErrors.name}</p>}
          </Field>

          <Field label="Tagline" hint="Max 100 characters">
            <input
              value={form.tagline}
              onChange={(e) => {
                setForm((f) => ({ ...f, tagline: e.target.value }));
                setFieldErrors((prev) => ({ ...prev, tagline: "" }));
              }}
              onBlur={() => {
                const r = createLaunchSchema.shape.tagline.safeParse(form.tagline);
                if (!r.success) setFieldErrors((prev) => ({ ...prev, tagline: r.error.issues[0].message }));
                else setFieldErrors((prev) => ({ ...prev, tagline: "" }));
              }}
              placeholder="One sentence that says what it does"
              maxLength={100}
              className={`bg-card border rounded-md w-full px-3 py-2 text-foreground text-sm placeholder:text-muted outline-offset-1 focus:outline-1 outline-purple-500 ${fieldErrors.tagline ? "border-red-500" : "border-card-border"}`}
            />
            {fieldErrors.tagline && <p className="text-xs text-red-400 mt-1">{fieldErrors.tagline}</p>}
          </Field>

          <Field label="URL">
            <input
              value={form.url}
              onChange={(e) => {
                setForm((f) => ({ ...f, url: e.target.value }));
                setFieldErrors((prev) => ({ ...prev, url: "" }));
              }}
              onBlur={() => {
                const r = createLaunchSchema.shape.url.safeParse(form.url);
                if (!r.success) setFieldErrors((prev) => ({ ...prev, url: r.error.issues[0].message }));
                else setFieldErrors((prev) => ({ ...prev, url: "" }));
              }}
              placeholder="https://yourapp.com"
              className={`bg-card border rounded-md w-full px-3 py-2 text-foreground text-sm placeholder:text-muted outline-offset-1 focus:outline-1 outline-purple-500 ${fieldErrors.url ? "border-red-500" : "border-card-border"}`}
            />
            {fieldErrors.url && <p className="text-xs text-red-400 mt-1">{fieldErrors.url}</p>}
          </Field>

          <Field label="Description" hint="Optional — shown on launch page">
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="What problem does it solve? How did you build it?"
              rows={4}
              className="bg-card border border-card-border rounded-md w-full px-3 py-2 text-foreground text-sm placeholder:text-muted outline-offset-1 focus:outline-1 outline-purple-500 resize-none"
            />
          </Field>

          <Field label="Stack" hint="Press Enter or comma to add — max 8 tags">
            <TagInput
              stack={form.stack}
              onChange={(tags) => setForm((f) => ({ ...f, stack: tags }))}
              placeholder="Next.js, Postgres, Vercel..."
            />
          </Field>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={submitting || !form.name || !form.tagline || !form.url || Object.values(fieldErrors).some(Boolean)}
            className="bg-purple-500 hover:bg-purple-400 disabled:opacity-50 disabled:pointer-events-none disabled:bg-muted text-white cursor-pointer font-[inter-medium] py-2.5 rounded-md transition-colors"
          >
            {submitting ? <Spinner size="sm" className="text-white" /> : "Launch it"}
          </button>

        </div>
      </main>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="text-sm font-[inter-medium] text-secondary ml-1">{label}</label>
        {hint && <span className="text-xs text-muted">{hint}</span>}
      </div>
      {children}
    </div>
  );
}