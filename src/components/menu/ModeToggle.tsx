"use client";

import { Bike, Store } from "lucide-react";
import { motion } from "motion/react";
import { useStore } from "@/store/useStore";
import { restaurant } from "@/data/restaurant";
import { brl } from "@/lib/format";
import { cn } from "@/lib/cn";
import { useMounted } from "@/hooks/useMounted";

const tabs = [
  { id: "delivery" as const, label: "Entrega", icon: Bike },
  { id: "pickup" as const, label: "Retirada", icon: Store },
];

export function ModeToggle() {
  const mode = useStore((s) => s.mode);
  const setMode = useStore((s) => s.setMode);
  const mounted = useMounted();
  const active = mounted ? mode : "delivery";

  return (
    <div>
      <div className="grid grid-cols-2 gap-1 rounded-2xl bg-cream-2 p-1">
        {tabs.map((t) => {
          const isActive = active === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setMode(t.id)}
              className={cn(
                "relative flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition-colors",
                isActive ? "text-ink" : "text-muted",
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="mode-pill"
                  className="absolute inset-0 rounded-xl bg-surface shadow-card"
                  transition={{ type: "spring", damping: 30, stiffness: 380 }}
                />
              )}
              <span className="relative flex items-center gap-2">
                <t.icon size={16} />
                {t.label}
              </span>
            </button>
          );
        })}
      </div>
      <p className="mt-2 px-1 text-xs font-medium text-ink-2">
        {active === "delivery" ? (
          <>
            Entrega em <strong className="text-ink">{restaurant.deliveryTimeMin}–{restaurant.deliveryTimeMax} min</strong> ·
            grátis acima de <strong className="text-success">{brl(restaurant.freeDeliveryThreshold)}</strong>
          </>
        ) : (
          <>
            Pronto em ~<strong className="text-ink">{restaurant.deliveryTimeMin} min</strong> · retire em {restaurant.address}
          </>
        )}
      </p>
    </div>
  );
}
