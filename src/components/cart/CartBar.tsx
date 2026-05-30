"use client";

import { ShoppingBag, ChevronRight } from "lucide-react";
import { useStore, useTotals } from "@/store/useStore";
import { useMounted } from "@/hooks/useMounted";
import { brl } from "@/lib/format";
import { FreeDeliveryProgress } from "./FreeDeliveryProgress";

export function CartBar() {
  const mounted = useMounted();
  const openCart = useStore((s) => s.openCart);
  const flyKey = useStore((s) => s.flyKey);
  const mode = useStore((s) => s.mode);
  const totals = useTotals();

  if (!mounted || totals.count === 0) return null;

  const showNudge = mode === "delivery" && !totals.freeDelivery && totals.subtotal > 0;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(10px,env(safe-area-inset-bottom))] pt-2">
      <div className="pointer-events-auto mx-auto max-w-2xl space-y-2">
        {showNudge && (
          <div className="rounded-2xl border border-line bg-cream/95 px-3 py-2 shadow-pop backdrop-blur">
            <FreeDeliveryProgress
              amountToFree={totals.amountToFreeDelivery}
              progress={totals.freeDeliveryProgress}
              freeDelivery={totals.freeDelivery}
              compact
            />
          </div>
        )}
        <button
          onClick={openCart}
          className="flex h-15 w-full items-center justify-between rounded-2xl bg-gradient-brasa px-4 py-3.5 text-white shadow-brasa transition active:scale-[0.98]"
        >
          <span className="flex items-center gap-2.5">
            <span className="relative">
              <ShoppingBag size={22} />
              <span
                key={flyKey}
                className="animate-bump absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-charcoal px-1 text-[11px] font-extrabold text-white ring-2 ring-brasa"
              >
                {totals.count}
              </span>
            </span>
            <span className="font-bold">Ver sacola</span>
          </span>
          <span className="flex items-center gap-1 font-extrabold tabular-nums">
            {brl(totals.subtotal)}
            <ChevronRight size={18} />
          </span>
        </button>
      </div>
    </div>
  );
}
