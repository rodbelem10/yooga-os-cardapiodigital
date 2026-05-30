"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

interface NavItem {
  id: string;
  name: string;
  emoji: string;
}

interface Props {
  items: NavItem[];
  activeId: string;
  onSelect: (id: string) => void;
}

export function CategoryNav({ items, activeId, onSelect }: Props) {
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Mantém o chip ativo visível no scroll horizontal
  useEffect(() => {
    const el = refs.current[activeId];
    el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [activeId]);

  return (
    <nav className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-2.5">
      {items.map((item) => {
        const isActive = item.id === activeId;
        return (
          <button
            key={item.id}
            ref={(el) => {
              refs.current[item.id] = el;
            }}
            onClick={() => onSelect(item.id)}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-bold transition-all",
              isActive
                ? "bg-charcoal text-white shadow-card"
                : "bg-surface text-ink-2 hover:text-ink",
            )}
          >
            <span className="text-[15px]">{item.emoji}</span>
            {item.name}
          </button>
        );
      })}
    </nav>
  );
}
