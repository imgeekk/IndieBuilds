"use client";

import { useState } from "react";
import { FaCopy, FaCheck } from "react-icons/fa";

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={copy}
      className="flex items-center gap-1.5 text-xs bg-purple-500 hover:bg-purple-600 border border-purple-500 text-white px-3 py-1.5 rounded-md transition-colors"
    >
      {copied ? <FaCheck size={12} className="text-green-400" /> : <FaCopy size={12} />}
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}