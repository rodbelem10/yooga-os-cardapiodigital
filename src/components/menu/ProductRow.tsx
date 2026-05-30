"use client";

import Image from "next/image";
import { Plus, Flame } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/lib/types";
import { ProductBadge } from "@/components/ui/Badge";
import { Price } from "@/components/ui/Price";
import { useStore } from "@/store/useStore";
import { buildCartItem, defaultSelections } from "@/lib/cart";

export function ProductRow({ product }: { product: Product }) {
  const openProduct = useStore((s) => s.openProduct);
  const addItem = useStore((s) => s.addItem);
  const triggerFly = useStore((s) => s.triggerFly);

  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round((1 - product.price / product.originalPrice) * 100)
      : 0;

  const quickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(buildCartItem(product, defaultSelections(product), 1));
    triggerFly();
    toast.success(`${product.name} na sacola`, { duration: 1600 });
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => openProduct(product.id)}
      onKeyDown={(e) => e.key === "Enter" && openProduct(product.id)}
      className="group flex cursor-pointer gap-3 py-4 transition active:opacity-70"
    >
      <div className="min-w-0 flex-1">
        {product.badges && product.badges.length > 0 && (
          <div className="mb-1 flex flex-wrap gap-1">
            {product.badges.slice(0, 2).map((b) => (
              <ProductBadge key={b} kind={b} />
            ))}
          </div>
        )}
        <h3 className="font-bold leading-snug text-ink">{product.name}</h3>
        <p className="mt-0.5 line-clamp-2 text-[13px] leading-snug text-ink-2">
          {product.description}
        </p>
        <div className="mt-2 flex items-center gap-2">
          <Price price={product.price} original={product.originalPrice} />
          {product.serves && (
            <span className="rounded-full bg-cream-2 px-2 py-0.5 text-[11px] font-semibold text-ink-2">
              {product.serves}
            </span>
          )}
        </div>
        {(product.orderedCount ?? 0) > 250 && (
          <p className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-bold text-brasa-700">
            <Flame size={12} className="fill-brasa-soft" /> Pedido {product.orderedCount}x esta semana
          </p>
        )}
      </div>

      <div className="relative h-24 w-24 shrink-0">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="96px"
          className="rounded-2xl object-cover shadow-card"
        />
        {discount > 0 && (
          <span className="absolute left-1.5 top-1.5 rounded-full bg-brasa px-1.5 py-0.5 text-[10px] font-extrabold text-white shadow">
            -{discount}%
          </span>
        )}
        <button
          aria-label={`Adicionar ${product.name}`}
          onClick={quickAdd}
          className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-brasa text-white shadow-brasa transition active:scale-90"
        >
          <Plus size={20} strokeWidth={2.75} />
        </button>
      </div>
    </div>
  );
}
