"use client";

import Image from "next/image";
import { Pencil } from "lucide-react";
import type { CartItem } from "@/lib/types";
import { useStore } from "@/store/useStore";
import { brl } from "@/lib/format";
import { selectionSummary } from "@/lib/cart";
import { QuantityStepper } from "@/components/ui/QuantityStepper";

export function CartLine({ item }: { item: CartItem }) {
  const setQty = useStore((s) => s.setQty);
  const openProduct = useStore((s) => s.openProduct);
  const summary = selectionSummary(item.selected);

  const edit = () => openProduct(item.productId, item.uid);

  return (
    <div className="flex gap-3 py-3">
      <button onClick={edit} className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
        <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
      </button>
      <div className="min-w-0 flex-1">
        <button onClick={edit} className="block w-full text-left">
          <div className="flex items-start gap-1">
            <h4 className="flex-1 font-bold leading-snug text-ink">{item.name}</h4>
            <Pencil size={13} className="mt-1 shrink-0 text-muted" />
          </div>
          {summary && <p className="mt-0.5 line-clamp-2 text-xs font-medium text-ink-2">{summary}</p>}
          {item.notes && (
            <p className="mt-0.5 line-clamp-1 text-xs italic text-muted">“{item.notes}”</p>
          )}
        </button>
        <div className="mt-2 flex items-center justify-between">
          <QuantityStepper
            value={item.quantity}
            onChange={(n) => setQty(item.uid, n)}
            size="sm"
            removableAt={1}
          />
          <span className="font-bold tabular-nums text-ink">{brl(item.lineTotal)}</span>
        </div>
      </div>
    </div>
  );
}
