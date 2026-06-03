"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "@/lib/auth-client";
import { FaGithub, FaRocket } from "react-icons/fa";

const Navbar = () => {
  const { data: session } = useSession();
  const user = session?.user;
  return (
    <nav className="border-b border-zinc-300 sticky top-0 z-50 text-black">
      <div className="max-w-4xl mx-auto px-4 h-15 flex items-center justify-between">
        <Link
          href="/"
          className=" text-3xl font-[base] text-zinc-700"
        >
          <span>IndieBuilds</span>
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                href="/submit"
                className="bg-orange-500 hover:bg-orange-400 text-zinc-900 text-sm font-[inter-medium] px-4 py-2 rounded-xs transition-colors"
              >
                + Submit
              </Link>
            <div className="flex items-center gap-2 bg-white border border-zinc-300 px-4 py-1 rounded-xs">
              <Link href={`/profile/${user.githubHandle ?? user.id}`}>
                <img
                  src={user.image ?? ""}
                  alt={user.name}
                  className="w-7 h-7 rounded-full border border-zinc-500 hover:border-zinc-500 transition-colors"
                />
              </Link>
              <button
                onClick={() => signOut()}
                className="text-xs text-zinc-500 hover:text-zinc-400 transition-colors hover:cursor-pointer"
              >
                Sign out
              </button>
              </div>
            </>
          ) : (
            <button
              onClick={() =>
                signIn.social({ provider: "github", callbackURL: "/" })
              }
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-zinc-900 text-sm font-[inter-medium] px-4 py-2 rounded-xs transition-colors cursor-pointer"
            >
              <FaGithub size={15} />
              Sign in
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
