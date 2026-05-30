"use client";

import Image from "next/image";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { upsellProducts } from "@/data/menu";
import { useStore } from "@/store/useStore";
import { buildCartItem, defaultSelections } from "@/lib/cart";
import { brl } from "@/lib/format";

export function UpsellRail() {
  const cart = useStore((s) => s.cart);
  const addItem = useStore((s) => s.addItem);
  const openProduct = useStore((s) => s.openProduct);

  const inCart = new Set(cart.map((i) => i.productId));
  const suggestions = upsellProducts.filter((p) => !inCart.has(p.id)).slice(0, 6);
  if (suggestions.length === 0) return null;

  return (
    <div className="pt-1">
      <h3 className="px-4 font-display text-base font-extrabold text-ink">
        😋 Peça também
      </h3>
      <p className="px-4 text-xs font-medium text-ink-2">Combina com o seu pedido</p>
      <div className="no-scrollbar mt-2 flex gap-2.5 overflow-x-auto px-4 pb-1">
        {suggestions.map((p) => {
          const hasOptions = (p.optionGroups?.length ?? 0) > 0;
          return (
            <div
              key={p.id}
              className="flex w-32 shrink-0 flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-card"
            >
              <button
                onClick={() => openProduct(p.id)}
                className="relative h-20 w-full"
                aria-label={p.name}
              >
                <Image src={p.image} alt={p.name} fill sizes="128px" className="object-cover" />
              </button>
              <div className="flex flex-1 flex-col p-2">
                <p className="line-clamp-2 text-xs font-bold leading-tight text-ink">{p.name}</p>
                <div className="mt-auto flex items-center justify-between pt-1.5">
                  <span className="text-xs font-bold text-ink">{brl(p.price)}</span>
                  <button
                    aria-label={`Adicionar ${p.name}`}
                    onClick={() => {
                      if (hasOptions) {
                        openProduct(p.id);
                        return;
                      }
                      addItem(buildCartItem(p, defaultSelections(p), 1));
                      toast.success(`${p.name} na sacola`, { duration: 1400 });
                    }}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-brasa text-white shadow-brasa transition active:scale-90"
                  >
                    <Plus size={16} strokeWidth={2.75} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
