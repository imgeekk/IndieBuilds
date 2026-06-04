"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "@/lib/auth-client";
import { FaGithub, FaSun, FaMoon } from "react-icons/fa";
import { IoMoonOutline } from "react-icons/io5";

import { MdOutlineWbSunny, MdOutlineWbIncandescent} from "react-icons/md";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const Navbar = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <nav className="border-b border-card-border sticky top-0 z-50 text-foreground bg-background">
      <div className="max-w-4xl mx-auto px-4 h-15 flex items-center justify-between">
        <Link
          href="/"
          className="text-3xl font-[base] text-foreground"
        >
          <span>IndieBuilds</span>
        </Link>

        <div className="flex items-center gap-3">
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-muted hover:text-foreground transition-colors cursor-pointer border border-card-border rounded-full p-2"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <MdOutlineWbSunny size={16} /> : <IoMoonOutline size={16} />}
            </button>
          )}

          {user ? (
            <>
              <Link
                href="/submit"
                className="bg-purple-500 hover:bg-purple-400 text-white text-sm font-[inter-medium] px-4 py-2 rounded-sm transition-colors"
              >
                + Submit
              </Link>
            <div className="flex items-center gap-2 bg-card border border-card-border px-2 py-1 rounded-sm">
              <Link href={`/profile/${user.githubHandle ?? user.id}`}>
                <img
                  src={user.image ?? ""}
                  alt={user.name}
                  className="w-7 h-7 rounded-full border-2 border-card-border hover:border-purple-500 transition-colors"
                />
              </Link>
              <button
                onClick={() => signOut()}
                className="text-sm text-muted hover:text-red-500 transition-colors hover:cursor-pointer"
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
              className="flex items-center gap-2 bg-purple-500 hover:bg-purple-400 text-zinc-900 text-sm font-[inter-medium] px-4 py-2 rounded-sm transition-colors cursor-pointer"
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
