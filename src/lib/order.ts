import type { CartItem, CustomerInfo, OrderMode, PaymentKind } from "./types";
import type { Totals } from "@/store/useStore";

export interface PlacedOrder {
  id: string;
  dateLabel: string; // "30 mai 2026"
  timeLabel: string; // "11:43"
  mode: OrderMode;
  customer: CustomerInfo;
  items: CartItem[];
  totals: Totals;
  paymentKind: PaymentKind;
  paymentLabel: string;
  changeFor?: number | null;
  scheduledFor?: string | null;
  etaMin: number;
  etaMax: number;
}

const KEY = "brasa:lastOrder";

export function savePlacedOrder(order: PlacedOrder) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(order));
  } catch {
    /* noop */
  }
}

export function loadPlacedOrder(): PlacedOrder | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as PlacedOrder) : null;
  } catch {
    return null;
  }
}

/** Gera um ID de pedido curto legível (ex.: BRS-7K2Q). */
export function makeOrderId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 4; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return `BRS-${s}`;
}
