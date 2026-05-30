"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/cn";

interface Props {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  /** mostra lixeira no lugar do "−" quando value === min e min === 1 */
  removableAt?: number;
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  size = "md",
  removableAt,
}: Props) {
  const dims = {
    sm: { btn: "h-8 w-8", text: "w-7 text-sm", icon: 15 },
    md: { btn: "h-10 w-10", text: "w-9 text-[15px]", icon: 17 },
    lg: { btn: "h-12 w-12", text: "w-11 text-lg", icon: 19 },
  }[size];

  const showTrash = removableAt !== undefined && value <= removableAt;

  return (
    <div className="inline-flex items-center rounded-full border border-line-2 bg-surface shadow-card">
      <button
        type="button"
        aria-label={showTrash ? "Remover" : "Diminuir"}
        onClick={() => onChange(value - 1)}
        disabled={!showTrash && value <= min}
        className={cn(
          "flex items-center justify-center rounded-full text-ink-2 transition active:scale-90 disabled:opacity-30",
          dims.btn,
          showTrash && "text-danger",
        )}
      >
        {showTrash ? <Trash2 size={dims.icon} /> : <Minus size={dims.icon} strokeWidth={2.5} />}
      </button>
      <span className={cn("text-center font-bold tabular-nums text-ink", dims.text)}>{value}</span>
      <button
        type="button"
        aria-label="Aumentar"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        className={cn(
          "flex items-center justify-center rounded-full text-brasa transition active:scale-90 disabled:opacity-30",
          dims.btn,
        )}
      >
        <Plus size={dims.icon} strokeWidth={2.5} />
      </button>
    </div>
  );
}
