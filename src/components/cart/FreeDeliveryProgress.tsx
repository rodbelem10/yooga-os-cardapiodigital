"use client";

import { Bike, PartyPopper } from "lucide-react";
import { brl } from "@/lib/format";
import { cn } from "@/lib/cn";

interface Props {
  amountToFree: number;
  progress: number;
  freeDelivery: boolean;
  compact?: boolean;
}

export function FreeDeliveryProgress({ amountToFree, progress, freeDelivery, compact }: Props) {
  const reached = freeDelivery || amountToFree <= 0;
  return (
    <div className={cn(!compact && "rounded-2xl border border-line bg-surface p-3 shadow-card")}>
      <p className={cn("flex items-center gap-1.5 font-bold", compact ? "text-xs" : "text-[13px]")}>
        {reached ? (
          <>
            <PartyPopper size={15} className="text-success" />
            <span className="text-success">Você ganhou frete grátis! 🎉</span>
          </>
        ) : (
          <>
            <Bike size={15} className="text-brasa" />
            <span className="text-ink">
              Faltam <span className="text-brasa-700">{brl(amountToFree)}</span> pro frete grátis
            </span>
          </>
        )}
      </p>
      <div className={cn("mt-1.5 w-full overflow-hidden rounded-full bg-cream-2", compact ? "h-1.5" : "h-2")}>
        <div
          className={cn("h-full rounded-full transition-all duration-500", reached ? "bg-success" : "bg-gradient-brasa")}
          style={{ width: `${Math.max(6, progress)}%` }}
        />
      </div>
    </div>
  );
}
