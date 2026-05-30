"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  Check,
  MessageCircle,
  MapPin,
  Store,
  User,
  Wallet,
  Clock,
  ChefHat,
  Bike,
  PartyPopper,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { restaurant } from "@/data/restaurant";
import { brl } from "@/lib/format";
import { selectionSummary } from "@/lib/cart";
import { whatsappLink } from "@/lib/whatsapp";
import { loadPlacedOrder, type PlacedOrder } from "@/lib/order";
import { useMounted } from "@/hooks/useMounted";
import { buttonClasses } from "@/components/ui/Button";
import { OrderTotals } from "@/components/cart/OrderTotals";
import { PixPanel } from "./PixPanel";

export function OrderConfirmedView() {
  const mounted = useMounted();
  const clearCart = useStore((s) => s.clearCart);
  const [order, setOrder] = useState<PlacedOrder | null>(null);

  useEffect(() => {
    setOrder(loadPlacedOrder());
    clearCart();
  }, [clearCart]);

  if (!mounted) return null;

  if (!order) {
    return (
      <div className="mx-auto flex min-h-dvh max-w-2xl flex-col items-center justify-center px-8 text-center">
        <h1 className="font-display text-xl font-extrabold text-ink">Nenhum pedido encontrado</h1>
        <p className="mt-1 text-sm font-medium text-ink-2">Que tal montar um agora?</p>
        <Link href="/" className={buttonClasses("primary", "md", "mt-5")}>
          Ver cardápio
        </Link>
      </div>
    );
  }

  const isDelivery = order.mode === "delivery";
  const waLink = whatsappLink(order.whatsappMessage);

  const steps = isDelivery
    ? [
        { label: "Pedido recebido", icon: Check },
        { label: "Em preparo", icon: ChefHat },
        { label: "Saiu para entrega", icon: Bike },
        { label: "Entregue", icon: PartyPopper },
      ]
    : [
        { label: "Pedido recebido", icon: Check },
        { label: "Em preparo", icon: ChefHat },
        { label: "Pronto para retirada", icon: Store },
        { label: "Retirado", icon: PartyPopper },
      ];

  const eta = order.scheduledFor
    ? `Agendado · ${order.scheduledFor}`
    : isDelivery
      ? `Chega em ~${order.etaMin}–${order.etaMax} min`
      : `Pronto em ~${order.etaMin} min`;

  return (
    <div className="min-h-dvh bg-cream-2 pb-16">
      {/* Hero */}
      <div className="bg-gradient-charcoal px-4 pb-20 pt-12 text-center text-white">
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", damping: 12, stiffness: 200 }}
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success shadow-[0_8px_28px_-6px_rgba(12,166,120,0.7)]"
        >
          <Check size={42} strokeWidth={3} />
        </motion.div>
        <h1 className="mt-4 font-display text-2xl font-extrabold">Pedido recebido! 🎉</h1>
        <p className="mt-1 text-sm font-medium text-white/70">
          Pedido <strong className="text-white">#{order.id}</strong>
        </p>
        <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-sm font-bold backdrop-blur">
          <Clock size={15} /> {eta}
        </p>
      </div>

      <div className="mx-auto -mt-14 max-w-2xl space-y-4 px-3 sm:px-4">
        {/* Handoff WhatsApp (ação principal) */}
        <div className="rounded-3xl bg-cream p-4 text-center shadow-pop">
          <p className="font-display text-lg font-extrabold text-ink">Falta 1 passo 👇</p>
          <p className="mt-0.5 text-sm font-medium text-ink-2">
            Confirme seu pedido no WhatsApp do restaurante — o resumo já vai prontinho.
          </p>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClasses("success", "lg", "mt-3 w-full")}
          >
            <MessageCircle size={20} /> Confirmar no WhatsApp
          </a>
        </div>

        {order.paymentKind === "pix" && <PixPanel amount={order.totals.total} orderId={order.id} />}

        {/* Status */}
        <div className="rounded-3xl bg-cream p-4 shadow-card">
          <h2 className="mb-3 font-display text-base font-extrabold text-ink">Acompanhe seu pedido</h2>
          <div className="space-y-0">
            {steps.map((s, i) => {
              const active = i === 0;
              const done = false;
              return (
                <div key={s.label} className="flex items-center gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full ${
                        active
                          ? "animate-pulse-ring bg-success text-white"
                          : "bg-cream-2 text-muted"
                      }`}
                    >
                      <s.icon size={17} strokeWidth={active ? 3 : 2} />
                    </div>
                    {i < steps.length - 1 && <div className="h-6 w-0.5 bg-line" />}
                  </div>
                  <span
                    className={`pb-6 text-sm font-bold ${active ? "text-ink" : "text-muted"} ${
                      i === steps.length - 1 ? "pb-0" : ""
                    }`}
                  >
                    {s.label}
                    {active && <span className="ml-2 text-xs font-semibold text-success">agora</span>}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Entrega / Retirada + pagamento */}
        <div className="space-y-3 rounded-3xl bg-cream p-4 shadow-card">
          <InfoRow
            icon={isDelivery ? <MapPin size={17} /> : <Store size={17} />}
            title={isDelivery ? "Entregar em" : "Retirar em"}
            lines={
              isDelivery
                ? [
                    `${order.customer.street}, ${order.customer.number}`,
                    `${order.customer.neighborhood} — ${order.customer.city}`,
                    order.customer.complement,
                    order.customer.reference && `Ref.: ${order.customer.reference}`,
                  ].filter(Boolean) as string[]
                : [restaurant.address, restaurant.city]
            }
          />
          <InfoRow
            icon={<User size={17} />}
            title="Cliente"
            lines={[order.customer.name, order.customer.phone]}
          />
          <InfoRow
            icon={<Wallet size={17} />}
            title="Pagamento"
            lines={[
              order.paymentLabel +
                (order.changeFor ? ` · troco para ${brl(order.changeFor)}` : ""),
            ]}
          />
        </div>

        {/* Itens + totais */}
        <div className="rounded-3xl bg-cream p-4 shadow-card">
          <h2 className="mb-2 font-display text-base font-extrabold text-ink">Seu pedido</h2>
          <div className="mb-3 divide-y divide-line">
            {order.items.map((i) => {
              const sum = selectionSummary(i.selected);
              return (
                <div key={i.uid} className="flex items-start gap-2 py-2 text-sm">
                  <span className="font-bold text-brasa-700">{i.quantity}×</span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-ink">{i.name}</p>
                    {sum && <p className="truncate text-xs text-ink-2">{sum}</p>}
                  </div>
                  <span className="font-bold tabular-nums text-ink">{brl(i.lineTotal)}</span>
                </div>
              );
            })}
          </div>
          <OrderTotals totals={order.totals} mode={order.mode} />
        </div>

        <Link href="/" className={buttonClasses("secondary", "lg", "w-full")}>
          Voltar ao cardápio
        </Link>
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  title,
  lines,
}: {
  icon: React.ReactNode;
  title: string;
  lines: string[];
}) {
  return (
    <div className="flex gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brasa-soft text-brasa">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-wide text-muted">{title}</p>
        {lines.map((l, i) => (
          <p key={i} className="text-sm font-semibold text-ink">
            {l}
          </p>
        ))}
      </div>
    </div>
  );
}
