"use client";

import type { OrderMode } from "@/lib/types";
import type { Totals } from "@/store/useStore";
import { brl } from "@/lib/format";

export function OrderTotals({ totals, mode }: { totals: Totals; mode: OrderMode }) {
  return (
    <div className="space-y-1.5 rounded-2xl bg-surface p-3.5 shadow-card">
      <Row label="Subtotal" value={brl(totals.subtotal)} />
      {totals.discount > 0 && (
        <Row
          label={`Desconto${totals.appliedCoupon ? ` (${totals.appliedCoupon.code})` : ""}`}
          value={`- ${brl(totals.discount)}`}
          accent
        />
      )}
      {mode === "delivery" ? (
        <Row
          label="Taxa de entrega"
          value={totals.deliveryFee === 0 ? "Grátis" : brl(totals.deliveryFee)}
          free={totals.deliveryFee === 0}
        />
      ) : (
        <Row label="Retirada no balcão" value="Grátis" free />
      )}
      <div className="mt-1 flex items-center justify-between border-t border-line pt-2.5">
        <span className="font-display text-base font-extrabold text-ink">Total</span>
        <span className="font-display text-xl font-extrabold text-ink tabular-nums">
          {brl(totals.total)}
        </span>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  accent,
  free,
}: {
  label: string;
  value: string;
  accent?: boolean;
  free?: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="font-medium text-ink-2">{label}</span>
      <span
        className={`font-bold tabular-nums ${
          accent || free ? "text-success" : "text-ink"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
