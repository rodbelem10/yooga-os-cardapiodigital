"use client";

import { useMemo, useState } from "react";
import { SearchX, RotateCcw } from "lucide-react";
import { categories, products, productsByCategory } from "@/data/menu";
import { restaurant } from "@/data/restaurant";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { RestaurantHeader } from "./RestaurantHeader";
import { LoyaltyBar } from "./LoyaltyBar";
import { PromoBanners } from "./PromoBanners";
import { SearchBar } from "./SearchBar";
import { CategoryNav } from "./CategoryNav";
import { PopularRail } from "./PopularRail";
import { CategorySection } from "./CategorySection";
import { ProductRow } from "./ProductRow";
import { ProductModal } from "@/components/product/ProductModal";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CartBar } from "@/components/cart/CartBar";
import { CheckoutSheet } from "@/components/checkout/CheckoutSheet";

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");

const navItems = [{ id: "mais-pedidos", name: "Mais pedidos", emoji: "🔥" }, ...categories];

export function MenuView() {
  const [query, setQuery] = useState("");
  const ids = useMemo(() => navItems.map((n) => n.id), []);
  const active = useScrollSpy(ids);

  const results = useMemo(() => {
    const q = norm(query.trim());
    if (!q) return [];
    return products.filter(
      (p) => norm(p.name).includes(q) || norm(p.description).includes(q),
    );
  }, [query]);

  const handleSelect = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const searching = query.trim().length > 0;

  return (
    <div className="mx-auto min-h-dvh max-w-2xl overflow-x-hidden bg-cream pb-36">
      <RestaurantHeader />

      <div className="mt-3">
        <LoyaltyBar />
      </div>
      <div className="mt-4">
        <PromoBanners />
      </div>

      {/* Barra sticky: busca + categorias */}
      <div className="sticky top-0 z-30 mt-3 border-b border-line bg-cream/92 pb-0.5 backdrop-blur-md">
        <div className="pt-2">
          <SearchBar value={query} onChange={setQuery} />
        </div>
        {!searching && <CategoryNav items={navItems} activeId={active} onSelect={handleSelect} />}
      </div>

      {searching ? (
        <div className="px-4 pt-4">
          <h2 className="font-display text-lg font-extrabold text-ink">
            {results.length > 0
              ? `${results.length} ${results.length === 1 ? "resultado" : "resultados"}`
              : "Nada encontrado"}
          </h2>
          {results.length > 0 ? (
            <div className="divide-y divide-line">
              {results.map((p) => (
                <ProductRow key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center py-16 text-center text-ink-2">
              <SearchX size={36} className="text-muted" />
              <p className="mt-3 font-semibold">
                Não achamos “{query}”.
              </p>
              <p className="text-sm">Tenta buscar por “smash”, “fritas” ou “milkshake”.</p>
            </div>
          )}
        </div>
      ) : (
        <>
          <PopularRail />
          {categories.map((cat) => (
            <CategorySection key={cat.id} category={cat} products={productsByCategory(cat.id)} />
          ))}
        </>
      )}

      {/* Rodapé */}
      <footer className="mt-10 border-t border-line px-4 py-8 text-sm text-ink-2">
        <p className="font-display text-lg font-extrabold text-ink">{restaurant.name}</p>
        <p className="mt-1 font-medium">{restaurant.address} — {restaurant.city}</p>
        <p className="font-medium">{restaurant.hoursLabel}</p>
        <p className="mt-4 text-xs text-muted">
          Cardápio digital por <span className="font-bold text-brasa-700">Yooga OS</span> · demonstração
        </p>
        <button
          onClick={() => {
            try {
              localStorage.removeItem("brasa-burger:v1");
              sessionStorage.removeItem("brasa:lastOrder");
            } catch {}
            window.location.href = "/";
          }}
          className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-line-2 px-3 py-1.5 text-xs font-bold text-ink-2 transition active:scale-95"
        >
          <RotateCcw size={13} /> Reiniciar demonstração
        </button>
      </footer>

      <ProductModal />
      <CartDrawer />
      <CheckoutSheet />
      <CartBar />
    </div>
  );
}
