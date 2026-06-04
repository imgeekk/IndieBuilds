"use client";

import { signIn } from "@/lib/auth-client";
import Image from "next/image";
import { FaGithub } from "react-icons/fa";

export default function LoginPage() {
  return (
    <div className="font-[inter-regular] h-screen flex items-center justify-center bg-background p-10">
      <div className="w-full grid grid-cols-2 h-180 bg-black rounded-xl">

        <div className="rounded-lg  p-8 mx-15 my-30 flex flex-col items-start justify-center gap-6">
          <div className="">
            <h1 className="text-7xl text-foreground font-[base]">IndieBuilds</h1>
            <p className="text-2xl text-muted mt-1">
              Ship it. Track it. Get roasted.
            </p>
          </div>

          <button
            onClick={() =>
              signIn.social({ provider: "github", callbackURL: "/" })
            }
            className="w-full flex items-center justify-center gap-3 text-lg bg-purple-500 hover:bg-purple-400 disabled:opacity-50 text-white cursor-pointer font-[inter-medium] py-2.5 rounded-md transition-colors"
          >
          <FaGithub size={18} />
            Continue with GitHub
          </button>

          <p className="text-lg text-muted ">
            Only solo or 2-person teams. <br /> One launch per week. No waitlists.
          </p>
        </div>

        <div className="rounded-lg bg-black overflow-hidden relative">
          <Image src="/images/login-bg.png" alt="Login background" layout="fill" objectFit="cover" />
        </div>

      </div>
    </div>
  );
}