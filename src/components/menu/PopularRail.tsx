"use client";

import Image from "next/image";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { popularProducts } from "@/data/menu";
import { Price } from "@/components/ui/Price";
import { useStore } from "@/store/useStore";
import { buildCartItem, defaultSelections } from "@/lib/cart";

export function PopularRail() {
  const openProduct = useStore((s) => s.openProduct);
  const addItem = useStore((s) => s.addItem);
  const triggerFly = useStore((s) => s.triggerFly);

  return (
    <section id="mais-pedidos" className="scroll-mt-[124px] pt-4">
      <div className="mb-2 flex items-center gap-2 px-4">
        <h2 className="font-display text-xl font-extrabold text-ink">🔥 Mais pedidos</h2>
        <span className="rounded-full bg-brasa-soft px-2 py-0.5 text-[11px] font-bold text-brasa-700">
          os favoritos da galera
        </span>
      </div>
      <div className="no-scrollbar snap-x-mandatory flex gap-3 overflow-x-auto px-4 pb-1 scroll-px-4">
        {popularProducts.map((product) => (
          <div
            key={product.id}
            role="button"
            tabIndex={0}
            onClick={() => openProduct(product.id)}
            onKeyDown={(e) => e.key === "Enter" && openProduct(product.id)}
            className="snap-start flex w-40 shrink-0 cursor-pointer flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-card transition active:scale-[0.98]"
          >
            <div className="relative h-28 w-full">
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="160px"
                className="object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col p-2.5">
              <h3 className="line-clamp-2 text-[13px] font-bold leading-tight text-ink">
                {product.name}
              </h3>
              <div className="mt-auto flex items-center justify-between pt-2">
                <Price price={product.price} original={product.originalPrice} size="sm" />
                <button
                  aria-label={`Adicionar ${product.name}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    addItem(buildCartItem(product, defaultSelections(product), 1));
                    triggerFly();
                    toast.success(`${product.name} na sacola`, { duration: 1600 });
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-brasa text-white shadow-brasa transition active:scale-90"
                >
                  <Plus size={18} strokeWidth={2.75} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
