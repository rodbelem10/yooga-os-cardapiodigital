"use client";

import type { Category, Product } from "@/lib/types";
import { ProductRow } from "./ProductRow";

export function CategorySection({
  category,
  products,
}: {
  category: Category;
  products: Product[];
}) {
  if (products.length === 0) return null;
  return (
    <section id={category.id} className="scroll-mt-[120px] px-4 pt-6">
      <div className="mb-1">
        <h2 className="font-display text-xl font-extrabold text-ink">
          {category.emoji} {category.name}
        </h2>
        {category.description && (
          <p className="text-sm font-medium text-ink-2">{category.description}</p>
        )}
      </div>
      <div className="divide-y divide-line">
        {products.map((p) => (
          <ProductRow key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
