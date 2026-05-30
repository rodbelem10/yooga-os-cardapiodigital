"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import {
  Check,
  ChefHat,
  Bike,
  Store,
  PartyPopper,
  ClipboardCheck,
  MapPin,
  User,
  Wallet,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { restaurant } from "@/data/restaurant";
import { brl } from "@/lib/format";
import { selectionSummary } from "@/lib/cart";
import { loadPlacedOrder, type PlacedOrder } from "@/lib/order";
import { useMounted } from "@/hooks/useMounted";
import { buttonClasses } from "@/components/ui/Button";

type StepDef = { label: string; icon: React.ElementType };

const STEPS_DELIVERY: StepDef[] = [
  { label: "Pedido confirmado", icon: ClipboardCheck },
  { label: "Em preparo", icon: ChefHat },
  { label: "Saiu para entrega", icon: Bike },
  { label: "Pedido entregue", icon: PartyPopper },
];
const STEPS_PICKUP: StepDef[] = [
  { label: "Pedido confirmado", icon: ClipboardCheck },
  { label: "Em preparo", icon: ChefHat },
  { label: "Pronto para retirada", icon: Store },
  { label: "Pedido retirado", icon: PartyPopper },
];

export function TrackingView() {
  const mounted = useMounted();
  const clearCart = useStore((s) => s.clearCart);
  const [order, setOrder] = useState<PlacedOrder | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [tab, setTab] = useState<"status" | "detalhes">("status");

  useEffect(() => {
    const o = loadPlacedOrder();
    setOrder(o);
    clearCart();
    if (o) setSeconds((o.mode === "delivery" ? o.etaMax : 20) * 60);
  }, [clearCart]);

  // countdown
  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  const steps = order?.mode === "pickup" ? STEPS_PICKUP : STEPS_DELIVERY;

  // avanço automático do status (demo viva)
  useEffect(() => {
    if (currentStep >= steps.length - 1) return;
    const t = setTimeout(() => setCurrentStep((s) => Math.min(steps.length - 1, s + 1)), 9000);
    return () => clearTimeout(t);
  }, [currentStep, steps.length]);

  if (!mounted) return null;
  if (!order) {
    return (
      <div className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center px-8 text-center">
        <h1 className="font-display text-xl font-extrabold text-ink">Nenhum pedido em andamento</h1>
        <Link href="/" className={buttonClasses("primary", "md", "mt-5")}>
          Ver cardápio
        </Link>
      </div>
    );
  }

  const isDelivery = order.mode === "delivery";
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  const progress = steps.length > 1 ? currentStep / (steps.length - 1) : 1;

  const R = 26;
  const C = 2 * Math.PI * R;

  return (
    <div className="min-h-dvh bg-cream-2 pb-12">
      {/* Marca */}
      <div className="flex items-center justify-center gap-2 bg-cream py-2.5">
        <div className="relative h-5 w-5 overflow-hidden rounded-full">
          <Image src={restaurant.logo} alt={restaurant.name} fill sizes="20px" className="object-cover" />
        </div>
        <span className="text-xs font-bold text-ink-2">
          Pedido na <span className="text-ink">{restaurant.name}</span>
        </span>
      </div>

      {/* Header countdown */}
      <div
        className="px-4 pb-7 pt-6 text-center text-white"
        style={{ background: "linear-gradient(180deg, #ff5230 0%, #b32c08 100%)" }}
      >
        <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-white/15 text-3xl backdrop-blur">
          ⏱️
        </div>
        <p className="text-sm font-semibold opacity-90">
          {isDelivery ? "Seu pedido chegará em até" : "Seu pedido fica pronto em até"}
        </p>
        <div className="mt-1 flex items-end justify-center gap-3">
          <div className="text-center">
            <span className="font-display text-6xl font-extrabold leading-none tabular-nums">{mm}</span>
            <span className="mt-1 block text-[11px] font-bold uppercase tracking-widest opacity-80">
              Minutos
            </span>
          </div>
          <span className="pb-6 font-display text-4xl font-extrabold opacity-80">:</span>
          <div className="text-center">
            <span className="font-display text-6xl font-extrabold leading-none tabular-nums">{ss}</span>
            <span className="mt-1 block text-[11px] font-bold uppercase tracking-widest opacity-80">
              Segundos
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-md px-4">
        {/* Tabs */}
        <div className="-mt-5 grid grid-cols-2 gap-1 rounded-full bg-surface p-1 shadow-pop">
          {(["status", "detalhes"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative rounded-full py-2.5 text-sm font-bold transition-colors ${
                tab === t ? "text-white" : "text-ink-2"
              }`}
            >
              {tab === t && (
                <motion.span
                  layoutId="track-tab"
                  className="absolute inset-0 rounded-full bg-gradient-brasa"
                  transition={{ type: "spring", damping: 30, stiffness: 380 }}
                />
              )}
              <span className="relative capitalize">{t}</span>
            </button>
          ))}
        </div>

        {tab === "status" ? (
          <div className="mt-4 rounded-3xl bg-cream p-4 shadow-card">
            {/* Resumo do status */}
            <div className="flex items-center justify-between gap-3 border-b border-line pb-4">
              <div>
                <p className="text-xs font-medium text-ink-2">Confirmado às {order.timeLabel}</p>
                <p className="font-display text-lg font-extrabold text-ink">Seu pedido está ativo</p>
                <p className="mt-0.5 text-xs font-semibold text-brasa-700">{steps[currentStep].label}</p>
              </div>
              <div className="relative h-16 w-16 shrink-0">
                <svg width="64" height="64" className="-rotate-90">
                  <circle cx="32" cy="32" r={R} fill="none" stroke="#ece4d9" strokeWidth="4" />
                  <circle
                    cx="32"
                    cy="32"
                    r={R}
                    fill="none"
                    stroke="#ff4d17"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={C}
                    strokeDashoffset={C * (1 - progress)}
                    className="transition-all duration-700"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-2xl">🍔</span>
              </div>
            </div>

            {/* Stepper */}
            <div className="pt-4">
              {steps.map((s, i) => {
                const done = i < currentStep;
                const active = i === currentStep;
                const Icon = s.icon;
                return (
                  <div key={s.label} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
                          done
                            ? "bg-success text-white"
                            : active
                              ? "animate-pulse-ring bg-brasa text-white"
                              : "bg-cream-2 text-muted"
                        }`}
                      >
                        {done ? <Check size={17} strokeWidth={3} /> : <Icon size={17} strokeWidth={active ? 2.6 : 2} />}
                      </div>
                      {i < steps.length - 1 && (
                        <div className={`my-1 w-0.5 flex-1 ${done ? "bg-success" : "bg-line"}`} style={{ minHeight: 20 }} />
                      )}
                    </div>
                    <div className={`pb-5 ${i === steps.length - 1 ? "pb-0" : ""}`}>
                      <p className={`font-bold ${active ? "text-ink" : done ? "text-ink-2" : "text-muted"}`}>
                        {s.label}
                      </p>
                      {active && (
                        <p className="text-xs font-semibold text-brasa-700">em andamento · {order.timeLabel}</p>
                      )}
                      {done && <p className="text-xs font-medium text-success">concluído</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {/* Resumo do pedido */}
            <div className="rounded-3xl bg-cream p-4 shadow-card">
              <h2 className="mb-2 font-display text-base font-extrabold text-ink">Resumo do pedido</h2>
              <div className="divide-y divide-line">
                {order.items.map((i) => {
                  const sum = selectionSummary(i.selected);
                  return (
                    <div key={i.uid} className="flex items-start gap-2 py-2.5 text-sm">
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
              <div className="mt-3 space-y-1.5 border-t border-line pt-3 text-sm">
                <Row label="Subtotal" value={brl(order.totals.subtotal)} />
                {order.totals.discount > 0 && (
                  <Row label="Desconto" value={`- ${brl(order.totals.discount)}`} accent />
                )}
                <Row
                  label={isDelivery ? "Taxa de entrega" : "Retirada"}
                  value={order.totals.deliveryFee === 0 ? "Grátis" : brl(order.totals.deliveryFee)}
                  accent={order.totals.deliveryFee === 0}
                />
                <div className="flex items-center justify-between border-t border-line pt-2.5">
                  <span className="font-display text-base font-extrabold text-ink">Total</span>
                  <span className="font-display text-xl font-extrabold tabular-nums text-ink">
                    {brl(order.totals.total)}
                  </span>
                </div>
              </div>
            </div>

            {/* Dados */}
            <div className="space-y-3 rounded-3xl bg-cream p-4 shadow-card">
              <Info
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
              <Info icon={<User size={17} />} title="Cliente" lines={[order.customer.name, order.customer.phone]} />
              <Info
                icon={<Wallet size={17} />}
                title="Pagamento"
                lines={[
                  order.paymentLabel +
                    (order.changeFor ? ` · troco para ${brl(order.changeFor)}` : "") +
                    (order.paymentKind === "pix" ? " · pago ✅" : ""),
                ]}
              />
            </div>
          </div>
        )}

        <Link href="/" className={buttonClasses("secondary", "lg", "mt-4 w-full")}>
          Voltar ao cardápio
        </Link>
        <p className="mt-3 text-center text-[11px] font-medium text-muted">
          Demonstração · status simulado para visualização.
        </p>
      </div>
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-medium text-ink-2">{label}</span>
      <span className={`font-bold tabular-nums ${accent ? "text-success" : "text-ink"}`}>{value}</span>
    </div>
  );
}

function Info({ icon, title, lines }: { icon: React.ReactNode; title: string; lines: string[] }) {
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
