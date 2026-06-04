"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { FaXRay } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { TECH_SUGGESTIONS } from "@/lib/tech-suggestions";

interface TagInputProps {
  stack: string[];
  onChange: (tags: string[]) => void;
  max?: number;
  placeholder?: string;
}

export default function TagInput({
  stack,
  onChange,
  max = 8,
  placeholder = "Type to search...",
}: TagInputProps) {
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stackLower = new Set(stack.map((s) => s.toLowerCase()));

  const filtered = !input.trim()
    ? []
    : TECH_SUGGESTIONS.filter(
        (s) =>
          s.toLowerCase().startsWith(input.trim().toLowerCase()) &&
          !stackLower.has(s.toLowerCase())
      );

  const resetHighlight = useCallback(() => setHighlightedIndex(-1), []);

  function addTag(val: string) {
    const trimmed = val.trim();
    if (!trimmed) return;
    if (stackLower.has(trimmed.toLowerCase())) return;
    if (stack.length >= max) return;
    onChange([...stack, trimmed]);
  }

  function removeTag(tag: string) {
    onChange(stack.filter((s) => s !== tag));
  }

  function selectHighlighted() {
    if (highlightedIndex >= 0 && highlightedIndex < filtered.length) {
      addTag(filtered[highlightedIndex]);
    } else if (input.trim()) {
      addTag(input.trim());
    }
    setInput("");
    setIsOpen(false);
    resetHighlight();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      selectHighlighted();
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!isOpen) setIsOpen(true);
      setHighlightedIndex((prev) =>
        prev < filtered.length - 1 ? prev + 1 : 0
      );
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : filtered.length - 1
      );
      return;
    }

    if (e.key === "Escape") {
      setIsOpen(false);
      resetHighlight();
      inputRef.current?.blur();
      return;
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setInput(val);
    setIsOpen(true);
    setHighlightedIndex(0);
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const pasted = e.clipboardData.getData("text");
    if (!pasted.includes(",")) return;
    e.preventDefault();
    const parts = pasted.split(",").map((s) => s.trim()).filter(Boolean);
    const newTags = [...stack];
    for (const part of parts) {
      if (!part) continue;
      if (newTags.length >= max) break;
      if (newTags.some((t) => t.toLowerCase() === part.toLowerCase())) continue;
      newTags.push(part);
    }
    if (newTags.length !== stack.length) {
      onChange(newTags);
    }
    setInput("");
  }

  function handleBlur() {
    blurTimeoutRef.current = setTimeout(() => {
      if (input.trim()) {
        addTag(input.trim());
      }
      setInput("");
      setIsOpen(false);
      resetHighlight();
    }, 150);
  }

  function handleFocus() {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
    }
    if (input.trim()) {
      setIsOpen(true);
    }
  }

  useEffect(() => {
    return () => {
      if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
    };
  }, []);

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-2 mb-2">
        {stack.map((t) => (
          <span
            key={t}
            className="flex items-center gap-1 text-xs bg-card border border-card-border text-muted px-2 py-1 rounded-md"
          >
            {t}
            <button
              type="button"
              onClick={() => removeTag(t)}
              className="hover:text-foreground transition-colors"
            >
              <RxCross2 size={11} />
            </button>
          </span>
        ))}
      </div>
      <input
        ref={inputRef}
        value={input}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onBlur={handleBlur}
        onFocus={handleFocus}
        placeholder={stack.length >= max ? "Max tags reached" : placeholder}
        disabled={stack.length >= max}
        className="w-full p-1 outline-offset-1 focus:outline-1 outline-purple-500 disabled:opacity-40"
      />
      {isOpen && filtered.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-card-border rounded-md shadow-md z-50 max-h-48 overflow-y-auto [scrollbar-gutter:stable]">
          {filtered.map((s, i) => (
            <button
              type="button"
              key={s}
              onMouseDown={(e) => {
                e.preventDefault();
                addTag(s);
                setInput("");
                setIsOpen(false);
                resetHighlight();
                inputRef.current?.focus();
              }}
              onMouseEnter={() => setHighlightedIndex(i)}
              className={`w-full text-left px-3 py-1.5 text-sm transition-colors ${
                i === highlightedIndex
                  ? "bg-purple-500/10 text-purple-400"
                  : "text-secondary hover:bg-purple-500/10 hover:text-purple-400"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      )}
      {isOpen && input.trim() && filtered.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-card-border rounded-md shadow-md z-50 px-3 py-1.5 text-xs text-muted italic">
          Press Enter to add &ldquo;{input.trim()}&rdquo;
        </div>
      )}
    </div>
  );
}
