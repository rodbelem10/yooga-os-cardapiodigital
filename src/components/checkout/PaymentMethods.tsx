"use client";

import { useState } from "react";
import { Check, CreditCard, Banknote, QrCode, Ticket } from "lucide-react";
import { restaurant } from "@/data/restaurant";
import type { PaymentKind } from "@/lib/types";
import { cn } from "@/lib/cn";

const ICONS: Record<PaymentKind, React.ElementType> = {
  pix: QrCode,
  credit: CreditCard,
  debit: CreditCard,
  cash: Banknote,
  vr: Ticket,
};

interface Props {
  value: PaymentKind;
  onChange: (kind: PaymentKind) => void;
  onChangeFor: (amount: number | null) => void;
}

export function PaymentMethods({ value, onChange, onChangeFor }: Props) {
  const [trocoStr, setTrocoStr] = useState("");

  const handleTroco = (raw: string) => {
    const clean = raw.replace(/[^\d,]/g, "");
    setTrocoStr(clean);
    const num = parseFloat(clean.replace(",", "."));
    onChangeFor(Number.isFinite(num) && num > 0 ? num : null);
  };

  return (
    <div className="space-y-2">
      {restaurant.paymentMethods.map((m) => {
        const Icon = ICONS[m.id];
        const selected = value === m.id;
        const isPix = m.id === "pix";
        return (
          <div key={m.id}>
            <button
              onClick={() => onChange(m.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-2xl border bg-surface p-3.5 text-left transition",
                selected
                  ? "border-brasa ring-2 ring-brasa-soft"
                  : isPix
                    ? "border-success/40"
                    : "border-line-2",
              )}
            >
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                  isPix ? "bg-success-soft text-success" : "bg-cream-2 text-ink-2",
                )}
              >
                <Icon size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-ink">{m.label}</span>
                  {isPix && (
                    <span className="rounded-full bg-success px-2 py-0.5 text-[10px] font-extrabold text-white">
                      Recomendado
                    </span>
                  )}
                </div>
                {m.hint && <p className="text-xs font-medium text-ink-2">{m.hint}</p>}
              </div>
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition",
                  selected ? "border-brasa bg-brasa text-white" : "border-line-2",
                )}
              >
                {selected && <Check size={15} strokeWidth={3} />}
              </span>
            </button>

            {selected && isPix && (
              <p className="mt-1.5 px-1 text-xs font-medium text-ink-2">
                💸 Você recebe o <strong>QR Code</strong> e o <strong>copia e cola</strong> na próxima tela —
                aprovação na hora.
              </p>
            )}

            {selected && m.id === "cash" && (
              <div className="mt-2 rounded-2xl border border-line bg-surface p-3">
                <label className="mb-1.5 block text-sm font-bold text-ink">Precisa de troco?</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-ink-2">
                    R$
                  </span>
                  <input
                    inputMode="numeric"
                    value={trocoStr}
                    onChange={(e) => handleTroco(e.target.value)}
                    placeholder="Troco para quanto?"
                    className="h-11 w-full rounded-xl border border-line-2 bg-cream pl-9 pr-3 text-[15px] font-semibold text-ink outline-none focus:border-brasa-ring focus:ring-4 focus:ring-brasa-soft"
                  />
                </div>
                <p className="mt-1 text-xs font-medium text-muted">Deixe vazio se não precisar de troco.</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
