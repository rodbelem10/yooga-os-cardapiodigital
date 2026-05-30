"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, CustomerInfo, OrderMode } from "@/lib/types";
import { coupons, restaurant } from "@/data/restaurant";

const emptyCustomer: CustomerInfo = {
  name: "",
  phone: "",
  cep: "",
  street: "",
  number: "",
  complement: "",
  neighborhood: "",
  city: "",
  reference: "",
};

interface StoreState {
  // ---- persistido ----
  cart: CartItem[];
  mode: OrderMode;
  customer: CustomerInfo;
  couponCode: string | null;
  scheduledFor: string | null; // null = "agora"
  // ---- UI (efêmero) ----
  productModalId: string | null;
  editingUid: string | null;
  cartOpen: boolean;
  flyKey: number; // dispara animação de "voar pra sacola"

  // ---- ações ----
  addItem: (item: CartItem, replaceUid?: string) => void;
  setQty: (uid: string, quantity: number) => void;
  removeItem: (uid: string) => void;
  clearCart: () => void;
  setMode: (mode: OrderMode) => void;
  setCustomer: (patch: Partial<CustomerInfo>) => void;
  applyCoupon: (code: string | null) => void;
  setSchedule: (when: string | null) => void;
  openProduct: (id: string, editUid?: string) => void;
  closeProduct: () => void;
  openCart: () => void;
  closeCart: () => void;
  triggerFly: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      cart: [],
      mode: "delivery",
      customer: emptyCustomer,
      couponCode: null,
      scheduledFor: null,
      productModalId: null,
      editingUid: null,
      cartOpen: false,
      flyKey: 0,

      addItem: (item, replaceUid) =>
        set((state) => {
          let cart = state.cart;
          if (replaceUid) cart = cart.filter((i) => i.uid !== replaceUid);
          const idx = cart.findIndex((i) => i.uid === item.uid);
          if (idx >= 0) {
            cart = cart.map((i, k) =>
              k === idx
                ? {
                    ...i,
                    quantity: i.quantity + item.quantity,
                    lineTotal: i.unitPrice * (i.quantity + item.quantity),
                  }
                : i,
            );
          } else {
            cart = [...cart, item];
          }
          return { cart };
        }),

      setQty: (uid, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return { cart: state.cart.filter((i) => i.uid !== uid) };
          }
          return {
            cart: state.cart.map((i) =>
              i.uid === uid ? { ...i, quantity, lineTotal: i.unitPrice * quantity } : i,
            ),
          };
        }),

      removeItem: (uid) => set((state) => ({ cart: state.cart.filter((i) => i.uid !== uid) })),

      clearCart: () => set({ cart: [], couponCode: null }),

      setMode: (mode) => set({ mode }),

      setCustomer: (patch) => set((state) => ({ customer: { ...state.customer, ...patch } })),

      applyCoupon: (code) => set({ couponCode: code }),

      setSchedule: (when) => set({ scheduledFor: when }),

      openProduct: (id, editUid) => set({ productModalId: id, editingUid: editUid ?? null }),
      closeProduct: () => set({ productModalId: null, editingUid: null }),
      openCart: () => set({ cartOpen: true }),
      closeCart: () => set({ cartOpen: false }),
      triggerFly: () => set((s) => ({ flyKey: s.flyKey + 1 })),
    }),
    {
      name: "brasa-burger:v1",
      partialize: (s) => ({
        cart: s.cart,
        mode: s.mode,
        customer: s.customer,
        couponCode: s.couponCode,
        scheduledFor: s.scheduledFor,
      }),
    },
  ),
);

// ============================================================
// Seletores derivados
// ============================================================

export interface Totals {
  count: number;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  freeDelivery: boolean;
  amountToFreeDelivery: number;
  freeDeliveryProgress: number; // 0-100
  meetsMin: boolean;
  amountToMin: number;
  appliedCoupon: (typeof coupons)[number] | null;
}

export function computeTotals(
  cart: CartItem[],
  mode: OrderMode,
  couponCode: string | null,
): Totals {
  const count = cart.reduce((n, i) => n + i.quantity, 0);
  const subtotal = cart.reduce((s, i) => s + i.lineTotal, 0);

  const coupon =
    coupons.find((c) => c.code === couponCode && subtotal >= c.minOrder) ?? null;

  let discount = 0;
  let couponFreeDelivery = false;
  if (coupon) {
    if (coupon.type === "percent") discount = (subtotal * coupon.value) / 100;
    else if (coupon.type === "fixed") discount = coupon.value;
    else if (coupon.type === "free_delivery") couponFreeDelivery = true;
  }

  const isDelivery = mode === "delivery";
  const freeByThreshold = isDelivery && subtotal >= restaurant.freeDeliveryThreshold;
  const freeDelivery = !isDelivery || couponFreeDelivery || freeByThreshold;
  const deliveryFee = freeDelivery ? 0 : restaurant.deliveryFee;

  const amountToFreeDelivery = isDelivery
    ? Math.max(0, restaurant.freeDeliveryThreshold - subtotal)
    : 0;
  const freeDeliveryProgress = isDelivery
    ? Math.min(100, (subtotal / restaurant.freeDeliveryThreshold) * 100)
    : 100;

  const meetsMin = subtotal >= restaurant.minOrder;
  const amountToMin = Math.max(0, restaurant.minOrder - subtotal);

  const total = Math.max(0, subtotal - discount) + deliveryFee;

  return {
    count,
    subtotal,
    discount,
    deliveryFee,
    total,
    freeDelivery,
    amountToFreeDelivery,
    freeDeliveryProgress,
    meetsMin,
    amountToMin,
    appliedCoupon: coupon,
  };
}

/** Hook reativo de totais. */
export function useTotals(): Totals {
  const cart = useStore((s) => s.cart);
  const mode = useStore((s) => s.mode);
  const couponCode = useStore((s) => s.couponCode);
  return computeTotals(cart, mode, couponCode);
}
