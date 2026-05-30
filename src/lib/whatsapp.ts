import { restaurant } from "@/data/restaurant";
import type { CartItem, CustomerInfo, OrderMode } from "./types";
import type { Totals } from "@/store/useStore";
import { brl } from "./format";
import { selectionSummary } from "./cart";

export interface OrderForMessage {
  orderId: string;
  cart: CartItem[];
  customer: CustomerInfo;
  mode: OrderMode;
  totals: Totals;
  paymentLabel: string;
  changeFor?: number | null;
  scheduledFor?: string | null;
}

export function buildWhatsappMessage(o: OrderForMessage): string {
  const L: string[] = [];
  L.push(`*NOVO PEDIDO • ${restaurant.name}* 🍔`);
  L.push(`Pedido #${o.orderId}`);
  L.push("");

  L.push("*🧾 Itens*");
  o.cart.forEach((item) => {
    L.push(`• ${item.quantity}x ${item.name} — ${brl(item.lineTotal)}`);
    const sum = selectionSummary(item.selected);
    if (sum) L.push(`   ↳ ${sum}`);
    if (item.notes) L.push(`   ↳ Obs: ${item.notes}`);
  });
  L.push("");

  L.push("*💰 Resumo*");
  L.push(`Subtotal: ${brl(o.totals.subtotal)}`);
  if (o.totals.discount > 0) {
    const code = o.totals.appliedCoupon?.code ? ` (${o.totals.appliedCoupon.code})` : "";
    L.push(`Desconto${code}: -${brl(o.totals.discount)}`);
  }
  if (o.mode === "delivery") {
    L.push(`Entrega: ${o.totals.deliveryFee === 0 ? "Grátis ✅" : brl(o.totals.deliveryFee)}`);
  }
  L.push(`*Total: ${brl(o.totals.total)}*`);
  L.push("");

  if (o.mode === "delivery") {
    L.push("*🛵 Entrega*");
    L.push(`Nome: ${o.customer.name}`);
    L.push(`WhatsApp: ${o.customer.phone}`);
    L.push(
      `Endereço: ${o.customer.street}, ${o.customer.number} — ${o.customer.neighborhood}, ${o.customer.city}`,
    );
    if (o.customer.complement) L.push(`Complemento: ${o.customer.complement}`);
    if (o.customer.reference) L.push(`Referência: ${o.customer.reference}`);
  } else {
    L.push("*🏃 Retirada no balcão*");
    L.push(`Nome: ${o.customer.name}`);
    L.push(`WhatsApp: ${o.customer.phone}`);
    L.push(`Local: ${restaurant.address} — ${restaurant.city}`);
  }
  L.push("");

  L.push("*💳 Pagamento*");
  let pay = o.paymentLabel;
  if (o.changeFor && o.changeFor > 0) pay += ` — troco para ${brl(o.changeFor)}`;
  L.push(pay);
  L.push("");

  L.push("*⏰ Quando*");
  if (o.scheduledFor) {
    L.push(`Agendado: ${o.scheduledFor}`);
  } else {
    L.push(
      o.mode === "delivery"
        ? `Agora — entrega em ~${restaurant.deliveryTimeMin}-${restaurant.deliveryTimeMax} min`
        : `Agora — pronto em ~${restaurant.deliveryTimeMin} min`,
    );
  }

  return L.join("\n");
}

export function whatsappLink(message: string): string {
  return `https://wa.me/${restaurant.whatsapp}?text=${encodeURIComponent(message)}`;
}

/** Gera um ID de pedido curto legível (ex.: BRS-7K2Q). */
export function makeOrderId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 4; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return `BRS-${s}`;
}
