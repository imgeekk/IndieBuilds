"use client";

import { motion } from "framer-motion";
import Link from "next/link";
const NotFound = () => {
  return (
    <div className="h-screen max-lg:flex-col flex max-md:justify-start justify-center items-center md:gap-30 p-5">
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-[220px] text-center text-purple-600 font-[base]"
      >
        404
      </motion.h1>
      <div className="lg:w-[50%] w-full flex flex-col items-center justify-center">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-sm md:text-2xl font-[inter-regular] text-center"
        >
          POV: The{" "}
          <Link
            href="https://x.com/imgeekkk"
            target="_blank"
            className="text-purple-500 hover:underline"
          >
            dev
          </Link>{" "}
          trying to find the page you requested
        </motion.h1>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="relative md:h-180 h-110 w-full rounded-sm overflow-hidden border border-zinc-700"
        >
          <video
            src="/videos/vid.mp4"
            autoPlay
            muted
            loop
            className="absolute inset-0 w-full h-full object-cover hue-rotate-280"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
