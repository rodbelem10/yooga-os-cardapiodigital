import type { CartItem, CustomerInfo, OrderMode, PaymentKind } from "./types";
import type { Totals } from "@/store/useStore";

export interface PlacedOrder {
  id: string;
  createdAtLabel: string;
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
  whatsappMessage: string;
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
