"use client";

import { useSession, signIn } from "@/lib/auth-client";
import Navbar from "@/components/Navbar";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSubmitLaunch } from "@/hooks/useSubmitLaunch";
import { Loader } from "@/components/loader-4";
import TagInput from "@/components/TagInput";
import { Spinner } from "@/components/ui/spinner";

export default function SubmitPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const { submit, submitting, error, setError } = useSubmitLaunch();

  const [form, setForm] = useState({
    name: "",
    tagline: "",
    url: "",
    description: "",
    stack: [] as string[],
  });

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
            className="bg-purple-500 hover:bg-purple-400 text-zinc-900 font-[inter-medium] px-5 py-2 rounded-lg transition-colors"
          >
            Sign in with GitHub
          </button>
        </div>
      </div>
    );
  }

  async function handleSubmit() {
    if (!form.name || !form.tagline || !form.url) {
      setError("Name, tagline and URL are required.");
      return;
    }
    const ok = await submit({
      name: form.name,
      tagline: form.tagline,
      url: form.url,
      description: form.description,
      stack: form.stack,
    });
    if (ok) router.push("/");
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
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Cron Monitor"
              maxLength={60}
              className="p-1 outline-offset-1 focus:outline-1 outline-purple-500 "
            />
          </Field>

          <Field label="Tagline" hint="Max 100 characters">
            <input
              value={form.tagline}
              onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))}
              placeholder="One sentence that says what it does"
              maxLength={100}
              className="p-1 outline-offset-1 focus:outline-1 outline-purple-500"
            />
          </Field>

          <Field label="URL">
            <input
              value={form.url}
              onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
              placeholder="https://yourapp.com"
              className="p-1 outline-offset-1 focus:outline-1 outline-purple-500"
            />
          </Field>

          <Field label="Description" hint="Optional — shown on launch page">
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="What problem does it solve? How did you build it?"
              rows={4}
              className="p-1 outline-offset-1 focus:outline-1 outline-purple-500 resize-none"
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
            disabled={submitting}
            className="bg-purple-500 hover:bg-purple-400 disabled:opacity-50 text-white cursor-pointer font-[inter-medium] py-2.5 rounded-md transition-colors"
          >
            {submitting ? <Spinner size="sm" className="text-white" /> : "Launch it"}
          </button>

        </div>
      </main>

      <style jsx>{`
        .input {
          width: 100%;
          background: #18181b;
          border: 1px solid #3f3f46;
          border-radius: 8px;
          padding: 8px 12px;
          color: white;
          font-size: 14px;
          outline: none;
          transition: border-color 0.15s;
        }
        .input:focus { border-color: #71717a; }
        .input::placeholder { color: #52525b; }
      `}</style>
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