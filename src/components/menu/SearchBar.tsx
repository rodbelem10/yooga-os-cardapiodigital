"use client";

import { Search, X } from "lucide-react";
import { cn } from "@/lib/cn";

interface Props {
  value: string;
  onChange: (v: string) => void;
  className?: string;
}

export function SearchBar({ value, onChange, className }: Props) {
  return (
    <div className={cn("relative px-4", className)}>
      <Search
        size={18}
        className="pointer-events-none absolute left-7 top-1/2 -translate-y-1/2 text-muted"
      />
      <input
        type="text"
        inputMode="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar no cardápio…"
        className="h-11 w-full rounded-full border border-line-2 bg-surface pl-11 pr-10 text-[15px] font-medium text-ink shadow-card outline-none transition placeholder:text-muted focus:border-brasa-ring focus:ring-4 focus:ring-brasa-soft"
      />
      {value && (
        <button
          aria-label="Limpar busca"
          onClick={() => onChange("")}
          className="absolute right-7 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-cream-2 text-ink-2 active:scale-90"
        >
          <X size={14} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
}
