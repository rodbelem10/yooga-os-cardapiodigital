"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Bike,
  Clock,
  User,
  MapPin,
  Wallet,
  Receipt,
  ShieldCheck,
  ShoppingBag,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { useStore, useTotals } from "@/store/useStore";
import { restaurant } from "@/data/restaurant";
import type { PaymentKind } from "@/lib/types";
import { brl, isValidCep, isValidPhone } from "@/lib/format";
import { selectionSummary } from "@/lib/cart";
import { buildWhatsappMessage, makeOrderId } from "@/lib/whatsapp";
import { savePlacedOrder, type PlacedOrder } from "@/lib/order";
import { useMounted } from "@/hooks/useMounted";
import { buttonClasses } from "@/components/ui/Button";
import { OrderTotals } from "@/components/cart/OrderTotals";
import { ModeToggle } from "@/components/menu/ModeToggle";
import { CustomerForm } from "./CustomerForm";
import { AddressForm } from "./AddressForm";
import { PaymentMethods } from "./PaymentMethods";
import { SchedulePicker } from "./SchedulePicker";

function Section({
  icon,
  title,
  children,
  step,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  step: number;
}) {
  return (
    <section className="rounded-3xl bg-cream p-4 shadow-card sm:p-5">
      <div className="mb-3 flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-charcoal text-sm font-extrabold text-white">
          {step}
        </div>
        <h2 className="flex items-center gap-1.5 font-display text-lg font-extrabold text-ink">
          <span className="text-brasa">{icon}</span>
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

export function CheckoutView() {
  const router = useRouter();
  const mounted = useMounted();
  const cart = useStore((s) => s.cart);
  const mode = useStore((s) => s.mode);
  const customer = useStore((s) => s.customer);
  const scheduledFor = useStore((s) => s.scheduledFor);
  const totals = useTotals();

  const [payment, setPayment] = useState<PaymentKind>("pix");
  const [changeFor, setChangeFor] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [placing, setPlacing] = useState(false);

  if (mounted && cart.length === 0) {
    return (
      <div className="mx-auto flex min-h-dvh max-w-2xl flex-col items-center justify-center px-8 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-cream-2 text-ink-2">
          <ShoppingBag size={34} />
        </div>
        <h1 className="mt-4 font-display text-xl font-extrabold text-ink">Sua sacola está vazia</h1>
        <p className="mt-1 text-sm font-medium text-ink-2">Volte ao cardápio e escolha seus itens.</p>
        <Link href="/" className={buttonClasses("primary", "md", "mt-5")}>
          Ver cardápio
        </Link>
      </div>
    );
  }

  const validate = () => {
    const e: Record<string, string> = {};
    if (customer.name.trim().length < 2) e.name = "Informe seu nome";
    if (!isValidPhone(customer.phone)) e.phone = "WhatsApp inválido";
    if (mode === "delivery") {
      if (!isValidCep(customer.cep)) e.cep = "CEP inválido";
      if (!customer.street.trim()) e.street = "Informe a rua";
      if (!customer.number.trim()) e.number = "Nº";
      if (!customer.neighborhood.trim()) e.neighborhood = "Informe o bairro";
    }
    return e;
  };

  const placeOrder = () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) {
      toast.error("Confira os campos destacados");
      const first = document.getElementById(Object.keys(e)[0]);
      first?.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => first?.focus(), 350);
      return;
    }

    setPlacing(true);
    const orderId = makeOrderId();
    const paymentLabel = restaurant.paymentMethods.find((p) => p.id === payment)?.label ?? "Pix";

    const order: PlacedOrder = {
      id: orderId,
      createdAtLabel: "agora",
      mode,
      customer,
      items: cart,
      totals,
      paymentKind: payment,
      paymentLabel,
      changeFor: payment === "cash" ? changeFor : null,
      scheduledFor,
      etaMin: restaurant.deliveryTimeMin,
      etaMax: restaurant.deliveryTimeMax,
      whatsappMessage: "",
    };
    order.whatsappMessage = buildWhatsappMessage({
      orderId,
      cart,
      customer,
      mode,
      totals,
      paymentLabel,
      changeFor: order.changeFor,
      scheduledFor,
    });

    savePlacedOrder(order);
    setTimeout(() => router.push("/pedido"), 500);
  };

  return (
    <div className="min-h-dvh bg-cream-2 pb-40">
      {/* App bar */}
      <header className="sticky top-0 z-30 border-b border-line bg-cream/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3">
          <Link
            href="/"
            aria-label="Voltar ao cardápio"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-ink shadow-card active:scale-90"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="font-display text-lg font-extrabold text-ink">Finalizar pedido</h1>
        </div>
      </header>

      <div className="mx-auto max-w-2xl space-y-4 px-3 pt-4 sm:px-4">
        <Section step={1} icon={<Bike size={18} />} title="Como você quer receber?">
          <ModeToggle />
        </Section>

        <Section step={2} icon={<Clock size={18} />} title="Quando?">
          <SchedulePicker />
        </Section>

        <Section step={3} icon={<User size={18} />} title="Seus dados">
          <CustomerForm errors={errors} />
        </Section>

        {mode === "delivery" && (
          <Section step={4} icon={<MapPin size={18} />} title="Endereço de entrega">
            <AddressForm errors={errors} />
          </Section>
        )}

        <Section
          step={mode === "delivery" ? 5 : 4}
          icon={<Wallet size={18} />}
          title="Pagamento"
        >
          <PaymentMethods value={payment} onChange={setPayment} onChangeFor={setChangeFor} />
        </Section>

        <Section
          step={mode === "delivery" ? 6 : 5}
          icon={<Receipt size={18} />}
          title="Resumo do pedido"
        >
          <div className="mb-3 divide-y divide-line rounded-2xl bg-surface px-3 shadow-card">
            {cart.map((i) => {
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
          <Link
            href="/"
            className="mb-3 flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-line-2 py-2.5 text-sm font-bold text-brasa-700 active:scale-[0.99]"
          >
            <Plus size={16} /> Adicionar mais itens
          </Link>
          <OrderTotals totals={totals} mode={mode} />
        </Section>
      </div>

      {/* CTA fixo */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-cream px-3 pt-3 pb-[max(12px,env(safe-area-inset-bottom))]">
        <div className="mx-auto max-w-2xl">
          <button
            onClick={placeOrder}
            disabled={placing}
            className={buttonClasses("primary", "lg", "w-full justify-between")}
          >
            <span className="flex items-center gap-2">
              <ShieldCheck size={18} />
              {placing ? "Enviando…" : "Fazer pedido"}
            </span>
            <span className="tabular-nums">{brl(totals.total)}</span>
          </button>
          <p className="mt-1.5 text-center text-[11px] font-medium text-muted">
            Confirmação na hora pelo WhatsApp · sem cadastro
          </p>
        </div>
      </div>
    </div>
  );
}
