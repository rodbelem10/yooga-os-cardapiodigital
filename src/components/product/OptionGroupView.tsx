"use client";

import { Check } from "lucide-react";
import type { OptionGroup, OptionItem } from "@/lib/types";
import { cn } from "@/lib/cn";
import { brl } from "@/lib/format";

interface Props {
  group: OptionGroup;
  selectedIds: string[];
  onSelect: (option: OptionItem) => void;
  errored?: boolean;
}

export function OptionGroupView({ group, selectedIds, onSelect, errored }: Props) {
  const count = selectedIds.length;
  const atMax = group.type === "multiple" && count >= group.max;

  const ruleText =
    group.type === "single"
      ? "Escolha 1"
      : group.max > 1
        ? `Escolha até ${group.max}`
        : "Escolha 1";

  return (
    <div id={`group-${group.id}`} className="scroll-mt-24">
      <div className="flex items-center justify-between gap-2 px-4 py-2.5">
        <div className="min-w-0">
          <h3 className="font-bold text-ink">{group.name}</h3>
          {group.description && (
            <p className="text-xs font-medium text-ink-2">{group.description}</p>
          )}
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold",
            group.required
              ? errored
                ? "bg-[#fde7e7] text-danger"
                : "bg-charcoal text-white"
              : "bg-cream-2 text-ink-2",
          )}
        >
          {group.required ? `Obrigatório · ${ruleText}` : ruleText}
        </span>
      </div>

      <div className="bg-surface">
        {group.options.map((opt, i) => {
          const selected = selectedIds.includes(opt.id);
          const disabled = !selected && atMax;
          return (
            <button
              key={opt.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(opt)}
              className={cn(
                "flex w-full items-center gap-3 px-4 py-3 text-left transition",
                i > 0 && "border-t border-line",
                disabled ? "opacity-40" : "active:bg-cream-2",
              )}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-ink">{opt.name}</span>
                  {opt.tag && (
                    <span className="rounded-full bg-brasa-soft px-1.5 py-0.5 text-[10px] font-bold text-brasa-700">
                      {opt.tag}
                    </span>
                  )}
                </div>
                {opt.description && (
                  <p className="text-xs font-medium text-ink-2">{opt.description}</p>
                )}
              </div>
              {opt.price > 0 && (
                <span className="shrink-0 text-sm font-bold text-success">+ {brl(opt.price)}</span>
              )}
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center border-2 transition",
                  group.type === "single" ? "rounded-full" : "rounded-md",
                  selected ? "border-brasa bg-brasa text-white" : "border-line-2 bg-surface",
                )}
              >
                {selected && <Check size={15} strokeWidth={3} />}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
