"use client";

import Link from "next/link";
import { ShoppingBag, Plus, ArrowRight, Trash2 } from "lucide-react";
import { useStore, useTotals } from "@/store/useStore";
import { restaurant } from "@/data/restaurant";
import { brl } from "@/lib/format";
import { useMounted } from "@/hooks/useMounted";
import { Sheet } from "@/components/ui/Sheet";
import { buttonClasses } from "@/components/ui/Button";
import { CartLine } from "./CartLine";
import { UpsellRail } from "./UpsellRail";
import { CouponField } from "./CouponField";
import { FreeDeliveryProgress } from "./FreeDeliveryProgress";
import { OrderTotals } from "./OrderTotals";

export function CartDrawer() {
  const cartOpen = useStore((s) => s.cartOpen);
  const closeCart = useStore((s) => s.closeCart);
  const clearCart = useStore((s) => s.clearCart);
  const cart = useStore((s) => s.cart);
  const mode = useStore((s) => s.mode);
  const totals = useTotals();
  const mounted = useMounted();
  const isEmpty = mounted && cart.length === 0;

  return (
    <Sheet open={cartOpen} onClose={closeCart} desktopPlacement="right" label="Sacola" panelClassName="bg-cream">
      <div className="flex items-center justify-between border-b border-line px-4 py-3.5 pr-14">
        <div>
          <h2 className="font-display text-lg font-extrabold text-ink">Sua sacola</h2>
          <p className="text-xs font-medium text-ink-2">{restaurant.name}</p>
        </div>
        {!isEmpty && cart.length > 0 && (
          <button
            onClick={clearCart}
            className="flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold text-danger active:scale-95"
          >
            <Trash2 size={13} /> Limpar
          </button>
        )}
      </div>

      {isEmpty ? (
        <div className="flex flex-1 flex-col items-center justify-center px-8 py-16 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-cream-2 text-ink-2">
            <ShoppingBag size={34} />
          </div>
          <h3 className="mt-4 font-display text-xl font-extrabold text-ink">Sua sacola está vazia</h3>
          <p className="mt-1 text-sm font-medium text-ink-2">
            Adicione itens deliciosos do cardápio e eles aparecem aqui.
          </p>
          <button onClick={closeCart} className={buttonClasses("primary", "md", "mt-5")}>
            Ver cardápio
          </button>
        </div>
      ) : (
        <>
          <div className="no-scrollbar flex-1 overflow-y-auto pb-4">
            <div className="px-4 py-3">
              <div className="flex items-center justify-between rounded-2xl bg-surface px-3.5 py-2.5 text-sm shadow-card">
                <span className="font-bold text-ink">
                  {mode === "delivery" ? "🛵 Entrega" : "🏪 Retirada no balcão"}
                </span>
                <span className="font-semibold text-ink-2">
                  {mode === "delivery"
                    ? `~${restaurant.deliveryTimeMin}–${restaurant.deliveryTimeMax} min`
                    : `~${restaurant.deliveryTimeMin} min`}
                </span>
              </div>
            </div>

            {mode === "delivery" && (
              <div className="px-4 pb-2">
                <FreeDeliveryProgress
                  amountToFree={totals.amountToFreeDelivery}
                  progress={totals.freeDeliveryProgress}
                  freeDelivery={totals.freeDelivery}
                />
              </div>
            )}

            <div className="divide-y divide-line px-4">
              {cart.map((i) => (
                <CartLine key={i.uid} item={i} />
              ))}
            </div>

            <button
              onClick={closeCart}
              className="mx-4 mt-2 flex w-[calc(100%-2rem)] items-center justify-center gap-1.5 rounded-xl border border-dashed border-line-2 py-2.5 text-sm font-bold text-brasa-700 transition active:scale-[0.99]"
            >
              <Plus size={16} /> Adicionar mais itens
            </button>

            <div className="mt-5">
              <UpsellRail />
            </div>
            <div className="mt-5">
              <CouponField />
            </div>
            <div className="mt-5 px-4">
              <OrderTotals totals={totals} mode={mode} />
            </div>
          </div>

          <div className="border-t border-line bg-cream px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))]">
            {!totals.meetsMin ? (
              <>
                <p className="mb-2 text-center text-xs font-bold text-warn">
                  Faltam {brl(totals.amountToMin)} para o pedido mínimo de {brl(restaurant.minOrder)}
                </p>
                <button disabled className={buttonClasses("primary", "lg", "w-full justify-between opacity-50")}>
                  <span>Continuar</span>
                  <span className="tabular-nums">{brl(totals.total)}</span>
                </button>
              </>
            ) : (
              <Link
                href="/checkout"
                onClick={closeCart}
                className={buttonClasses("primary", "lg", "w-full justify-between")}
              >
                <span>Ir para o pagamento</span>
                <span className="flex items-center gap-1 tabular-nums">
                  {brl(totals.total)} <ArrowRight size={18} />
                </span>
              </Link>
            )}
          </div>
        </>
      )}
    </Sheet>
  );
}
