"use client";

import { Zap, CalendarClock } from "lucide-react";
import { useStore } from "@/store/useStore";
import { restaurant } from "@/data/restaurant";
import { cn } from "@/lib/cn";

const SLOTS = [
  "Hoje, 20:00 – 20:30",
  "Hoje, 20:30 – 21:00",
  "Hoje, 21:00 – 21:30",
  "Amanhã, 19:00 – 19:30",
];

export function SchedulePicker() {
  const scheduledFor = useStore((s) => s.scheduledFor);
  const setSchedule = useStore((s) => s.setSchedule);
  const mode = useStore((s) => s.mode);
  const isScheduled = !!scheduledFor;

  return (
    <div>
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setSchedule(null)}
          className={cn(
            "flex items-center justify-center gap-1.5 rounded-xl border py-3 text-sm font-bold transition",
            !isScheduled
              ? "border-brasa bg-brasa-soft text-brasa-700 ring-2 ring-brasa-soft"
              : "border-line-2 bg-surface text-ink-2",
          )}
        >
          <Zap size={16} /> Agora (~{mode === "delivery" ? restaurant.deliveryTimeMin : 15} min)
        </button>
        <button
          onClick={() => setSchedule(SLOTS[0])}
          className={cn(
            "flex items-center justify-center gap-1.5 rounded-xl border py-3 text-sm font-bold transition",
            isScheduled
              ? "border-brasa bg-brasa-soft text-brasa-700 ring-2 ring-brasa-soft"
              : "border-line-2 bg-surface text-ink-2",
          )}
        >
          <CalendarClock size={16} /> Agendar
        </button>
      </div>
      {isScheduled && (
        <div className="mt-2 grid grid-cols-2 gap-2">
          {SLOTS.map((s) => (
            <button
              key={s}
              onClick={() => setSchedule(s)}
              className={cn(
                "rounded-xl border px-2 py-2.5 text-xs font-bold transition",
                scheduledFor === s
                  ? "border-charcoal bg-charcoal text-white"
                  : "border-line-2 bg-surface text-ink-2",
              )}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
