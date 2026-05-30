"use client";

import { useState } from "react";
import { Ticket, X } from "lucide-react";
import { toast } from "sonner";
import { coupons } from "@/data/restaurant";
import { useStore, useTotals } from "@/store/useStore";
import { brl } from "@/lib/format";

export function CouponField() {
  const couponCode = useStore((s) => s.couponCode);
  const applyCoupon = useStore((s) => s.applyCoupon);
  const totals = useTotals();
  const [code, setCode] = useState("");

  const applied = totals.appliedCoupon;
  const eligible = coupons.filter(
    (c) => totals.subtotal >= c.minOrder && c.code !== couponCode,
  );

  const apply = (raw: string) => {
    const c = coupons.find((x) => x.code === raw.trim().toUpperCase());
    if (!c) return toast.error("Cupom inválido");
    if (totals.subtotal < c.minOrder)
      return toast.error(`Válido em pedidos acima de ${brl(c.minOrder)}`);
    applyCoupon(c.code);
    setCode("");
    toast.success(`Cupom ${c.code} aplicado 🎉`);
  };

  if (applied) {
    const savings =
      applied.type === "free_delivery" ? "Frete grátis" : `- ${brl(totals.discount)}`;
    return (
      <div className="mx-4 flex items-center gap-3 rounded-2xl border border-success/30 bg-success-soft p-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-success text-white">
          <Ticket size={17} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-success">{applied.code} aplicado</p>
          <p className="truncate text-xs font-medium text-ink-2">
            {applied.label} · <span className="font-bold text-success">{savings}</span>
          </p>
        </div>
        <button
          onClick={() => applyCoupon(null)}
          aria-label="Remover cupom"
          className="flex h-7 w-7 items-center justify-center rounded-full bg-surface text-ink-2 active:scale-90"
        >
          <X size={15} />
        </button>
      </div>
    );
  }

  return (
    <div className="mx-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Ticket size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && apply(code)}
            placeholder="Tem um cupom?"
            className="h-11 w-full rounded-xl border border-line-2 bg-surface pl-9 pr-3 text-sm font-semibold uppercase text-ink outline-none placeholder:font-medium placeholder:normal-case placeholder:text-muted focus:border-brasa-ring focus:ring-4 focus:ring-brasa-soft"
          />
        </div>
        <button
          onClick={() => apply(code)}
          disabled={!code.trim()}
          className="h-11 shrink-0 rounded-xl bg-charcoal px-4 text-sm font-bold text-white transition active:scale-95 disabled:opacity-40"
        >
          Aplicar
        </button>
      </div>
      {eligible.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {eligible.map((c) => (
            <button
              key={c.code}
              onClick={() => apply(c.code)}
              className="inline-flex items-center gap-1 rounded-full border border-dashed border-brasa-ring bg-brasa-soft px-2.5 py-1 text-[11px] font-bold text-brasa-700 active:scale-95"
            >
              <Ticket size={12} /> {c.code} · {c.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
