"use client";

import { Gift } from "lucide-react";

/** Faixa de fidelidade estática (Clube Brasa) — ancora recompra visualmente. */
export function LoyaltyBar() {
  const current = 3;
  const goal = 5;
  const pct = (current / goal) * 100;

  return (
    <div className="mx-4 flex items-center gap-3 rounded-2xl border border-line bg-surface p-3 shadow-card">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brasa-soft text-brasa">
        <Gift size={20} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <p className="text-[13px] font-bold text-ink">Clube Brasa · 5% de cashback</p>
          <span className="text-xs font-bold text-brasa-700">
            {current}/{goal}
          </span>
        </div>
        <p className="mb-1.5 truncate text-xs font-medium text-ink-2">
          Faltam {goal - current} pedidos pro seu lanche grátis 🍔
        </p>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-cream-2">
          <div className="h-full rounded-full bg-gradient-brasa" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
}
