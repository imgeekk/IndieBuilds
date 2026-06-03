"use client";

import { signIn } from "@/lib/auth-client";
import { FaGithub } from "react-icons/fa";

export default function LoginPage() {
  return (
    <div className="font-[inter-regular] min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-sm p-8 rounded-lg border border-card-border bg-card flex flex-col items-center gap-6">

        <div className="text-center">
          <h1 className="text-xl text-foreground font-[inter-semibold]">IndieBuilds</h1>
          <p className="text-sm text-muted mt-1">
            Ship it. Track it. Get roasted.
          </p>
        </div>

        <button
          onClick={() =>
            signIn.social({ provider: "github", callbackURL: "/" })
          }
          className="w-full flex items-center justify-center gap-3 bg-card text-foreground font-[inter-medium] py-2.5 px-4 rounded-md hover:bg-card-border transition-colors"
        >
        <FaGithub size={18} />
          Continue with GitHub
        </button>

        <p className="text-xs text-muted text-center">
          Only solo or 2-person teams. <br /> One launch per week. No waitlists.
        </p>

      </div>
    </div>
  );
}