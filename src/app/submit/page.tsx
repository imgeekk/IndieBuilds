"use client";

import { useSession, signIn } from "@/lib/auth-client";
import Navbar from "@/components/Navbar";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaXRay } from "react-icons/fa";

export default function SubmitPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    tagline: "",
    url: "",
    description: "",
    stack: [] as string[],
    stackInput: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (isPending) return null;

  if (!session) {
    return (
      <div className="min-h-screen bg-[#EEF0E8]">
        <Navbar />
        <div className="max-w-lg mx-auto px-4 py-20 text-center">
          <p className="text-zinc-300 mb-4">Sign in with GitHub to submit your launch.</p>
          <button
            onClick={() => signIn.social({ provider: "github", callbackURL: "/submit" })}
            className="bg-orange-500 hover:bg-orange-400 text-white font-[inter-medium] px-5 py-2 rounded-lg transition-colors"
          >
            Sign in with GitHub
          </button>
        </div>
      </div>
    );
  }

  function addStackTag() {
    const val = form.stackInput.trim();
    if (val && !form.stack.includes(val) && form.stack.length < 8) {
      setForm((f) => ({ ...f, stack: [...f.stack, val], stackInput: "" }));
    }
  }

  async function handleSubmit() {
    setError("");
    if (!form.name || !form.tagline || !form.url) {
      setError("Name, tagline and URL are required.");
      return;
    }
    setSubmitting(true);
    const res = await fetch("/api/launches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        tagline: form.tagline,
        url: form.url,
        description: form.description,
        stack: form.stack,
      }),
    });

    if (res.ok) {
      router.push("/");
    } else {
      const data = await res.json();
      setError(data.error ?? "Something went wrong.");
    }
    setSubmitting(false);
  }

  return (
    <div className="min-h-screen bg-[#EEF0E8] font-[inter-regular]">
      <Navbar />
      <main className="max-w-lg mx-auto px-4 py-10 text-zinc-700">
        <h1 className="text-xl font-[inter-semibold] mb-1">Submit your launch</h1>
        <p className="text-sm text-zinc-500 mb-8">One launch per week. Must be live, not a waitlist.</p>

        <div className="flex flex-col gap-5">

          <Field label="Project name">
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Cron Monitor"
              maxLength={60}
              className="p-1 outline-offset-1 focus:outline-1 outline-orange-500 "
            />
          </Field>

          <Field label="Tagline" hint="Max 100 characters">
            <input
              value={form.tagline}
              onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))}
              placeholder="One sentence that says what it does"
              maxLength={100}
              className="p-1 outline-offset-1 focus:outline-1 outline-orange-500"
            />
          </Field>

          <Field label="URL">
            <input
              value={form.url}
              onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
              placeholder="https://yourapp.com"
              className="p-1 outline-offset-1 focus:outline-1 outline-orange-500"
            />
          </Field>

          <Field label="Description" hint="Optional — shown on launch page">
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="What problem does it solve? How did you build it?"
              rows={4}
              className="p-1 outline-offset-1 focus:outline-1 outline-orange-500 resize-none"
            />
          </Field>

          <Field label="Stack" hint="Press Enter to add — max 8 tags">
            <div className="flex flex-wrap gap-2">
              {form.stack.map((t) => (
                <span key={t} className="flex items-center gap-1 text-xs bg-zinc-800 border border-zinc-700 text-zinc-300 px-2 py-1 rounded-md">
                  {t}
                  <button onClick={() => setForm((f) => ({ ...f, stack: f.stack.filter((s) => s !== t) }))}>
                  <FaXRay size={11} />
                  </button>
                </span>
              ))}
            </div>
            <input
              value={form.stackInput}
              onChange={(e) => setForm((f) => ({ ...f, stackInput: e.target.value }))}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addStackTag())}
              placeholder="Next.js, Postgres, Vercel..."
              className="p-1 outline-offset-1 focus:outline-1 outline-orange-500"
            />
          </Field>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-zinc-900 cursor-pointer font-[inter-medium] py-2.5 rounded-lg transition-colors"
          >
            {submitting ? "Submitting..." : "Launch it"}
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
        <label className="text-sm font-[inter-medium] text-zinc-700 ml-1">{label}</label>
        {hint && <span className="text-xs text-zinc-500">{hint}</span>}
      </div>
      {children}
    </div>
  );
}