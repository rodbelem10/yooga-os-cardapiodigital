"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  MapPin,
  LocateFixed,
  Loader2,
  Pencil,
  QrCode,
  ShieldCheck,
  Plus,
  ChevronDown,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { useStore, useTotals } from "@/store/useStore";
import { restaurant } from "@/data/restaurant";
import type { PaymentKind } from "@/lib/types";
import { brl, isValidCep, isValidPhone, maskCep, onlyDigits } from "@/lib/format";
import { lookupCep } from "@/lib/cep";
import { selectionSummary } from "@/lib/cart";
import { buildWhatsappMessage, makeOrderId } from "@/lib/whatsapp";
import { savePlacedOrder, type PlacedOrder } from "@/lib/order";
import { Sheet } from "@/components/ui/Sheet";
import { buttonClasses } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { OrderTotals } from "@/components/cart/OrderTotals";
import { PaymentMethods } from "./PaymentMethods";
import { CustomerForm } from "./CustomerForm";
import { ModeToggle } from "@/components/menu/ModeToggle";
import { SchedulePicker } from "./SchedulePicker";

type Step = "endereco" | "revisao";
const PICKUP_ETA = 15;

export function CheckoutSheet() {
  const router = useRouter();
  const open = useStore((s) => s.checkoutOpen);
  const closeCheckout = useStore((s) => s.closeCheckout);
  const openCart = useStore((s) => s.openCart);
  const cart = useStore((s) => s.cart);
  const mode = useStore((s) => s.mode);
  const customer = useStore((s) => s.customer);
  const setCustomer = useStore((s) => s.setCustomer);
  const scheduledFor = useStore((s) => s.scheduledFor);
  const totals = useTotals();

  const [step, setStep] = useState<Step>("revisao");
  const [enteredViaAddress, setEnteredViaAddress] = useState(false);
  const [openedReturning, setOpenedReturning] = useState(false);
  const [payment, setPayment] = useState<PaymentKind>("pix");
  const [changeFor, setChangeFor] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [placing, setPlacing] = useState(false);
  const [expandedChip, setExpandedChip] = useState<"mode" | "when" | null>(null);
  const [showItems, setShowItems] = useState(false);
  const [editingAddress, setEditingAddress] = useState(false);
  const [showRef, setShowRef] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);
  const [locating, setLocating] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const hasContact = customer.name.trim().length >= 2 && isValidPhone(customer.phone);
  const hasAddress =
    isValidCep(customer.cep) &&
    !!customer.street.trim() &&
    !!customer.number.trim() &&
    !!customer.neighborhood.trim();

  // Roteamento na abertura do sheet
  useEffect(() => {
    if (!open) return;
    const needAddress = mode === "delivery" && !hasAddress;
    const returning = hasContact && (mode === "pickup" || hasAddress);
    setStep(needAddress ? "endereco" : "revisao");
    setOpenedReturning(!needAddress && returning);
    setEnteredViaAddress(false);
    setErrors({});
    setExpandedChip(null);
    setPlacing(false);
    setShowItems(false);
    setEditingAddress(!customer.street.trim());
    setShowRef(!!customer.reference.trim());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Ajuste dinâmico ao trocar de modo pelo chip
  useEffect(() => {
    if (!open) return;
    if (mode === "pickup" && step === "endereco") setStep("revisao");
    if (mode === "delivery" && step === "revisao" && !hasAddress) {
      setStep("endereco");
      setOpenedReturning(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const firstName = customer.name.trim().split(" ")[0] || "";

  const scrollTop = () => contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  const focusFirst = (e: Record<string, string>) => {
    const el = document.getElementById(Object.keys(e)[0]);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => (el as HTMLElement | null)?.focus(), 300);
  };

  const validateContact = (e: Record<string, string>) => {
    if (customer.name.trim().length < 2) e.name = "Como podemos te chamar?";
    if (!isValidPhone(customer.phone)) e.phone = "WhatsApp inválido";
  };
  const validateAddress = (e: Record<string, string>) => {
    if (!isValidCep(customer.cep)) e.cep = "CEP inválido";
    if (!customer.street.trim()) e.street = "Informe a rua";
    if (!customer.number.trim()) e.number = "Nº";
    if (!customer.neighborhood.trim()) e.neighborhood = "Informe o bairro";
  };

  const goBack = () => {
    setExpandedChip(null);
    if (step === "revisao" && enteredViaAddress) {
      setStep("endereco");
      setEnteredViaAddress(false);
      return;
    }
    closeCheckout();
    openCart();
  };

  const goToRevisao = () => {
    const e: Record<string, string> = {};
    validateAddress(e);
    validateContact(e);
    setErrors(e);
    if (Object.keys(e).length) {
      toast.error("Confira os campos destacados");
      focusFirst(e);
      return;
    }
    setEnteredViaAddress(true);
    setStep("revisao");
    scrollTop();
  };

  const placeOrder = () => {
    const e: Record<string, string> = {};
    validateContact(e);
    if (mode === "delivery") validateAddress(e);
    setErrors(e);
    if (Object.keys(e).length) {
      if (mode === "delivery" && step !== "endereco") {
        setStep("endereco");
        setEnteredViaAddress(true);
      }
      toast.error("Confira os campos destacados");
      setTimeout(() => focusFirst(e), 80);
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
    setTimeout(() => {
      closeCheckout();
      router.push("/pedido");
    }, 450);
  };

  // ---- Handlers do endereço ----
  const handleCep = async (raw: string) => {
    const masked = maskCep(raw);
    setCustomer({ cep: masked });
    if (onlyDigits(masked).length === 8) {
      setLoadingCep(true);
      const res = await lookupCep(masked);
      setLoadingCep(false);
      if (res) {
        setCustomer({ street: res.street, neighborhood: res.neighborhood, city: res.city });
        setEditingAddress(false);
        toast.success("Endereço preenchido ✨ confere só o número");
        setTimeout(() => document.getElementById("number")?.focus(), 150);
      } else {
        setEditingAddress(true);
        toast.error("CEP não encontrado — preencha manualmente");
      }
    }
  };

  const useLocation = () => {
    setLocating(true);
    setTimeout(() => {
      setLocating(false);
      setCustomer({
        cep: "29101-000",
        street: "Av. Hugo Musso",
        neighborhood: "Praia da Costa",
        city: "Vila Velha, ES",
      });
      setEditingAddress(false);
      toast.success("Localização aplicada 📍 confere só o número");
      setTimeout(() => document.getElementById("number")?.focus(), 150);
    }, 800);
  };

  // ---- Textos dinâmicos ----
  const feeText = totals.freeDelivery ? "grátis" : brl(restaurant.deliveryFee);
  const chipModeText =
    mode === "delivery"
      ? `🛵 Entrega · ${restaurant.deliveryTimeMin}–${restaurant.deliveryTimeMax} min · ${feeText}`
      : `🏪 Retirada · pronto em ~${PICKUP_ETA} min`;
  const chipWhenText = scheduledFor ? `📅 ${scheduledFor}` : "⚡ Agora";

  const title =
    step === "endereco"
      ? "Onde a gente entrega? 🛵"
      : openedReturning
        ? `Bom te ver de novo, ${firstName} 👋`
        : "Tudo certo? 🤝";
  const subtitle =
    step === "endereco"
      ? "Começa pelo CEP que a gente preenche o resto."
      : openedReturning
        ? "Tá tudo como da última vez — é só conferir e pagar."
        : "Confere e paga no Pix — cai na hora ⚡";

  const isPix = payment === "pix";
  const ctaLabel =
    step === "endereco"
      ? "Ir pro pagamento"
      : isPix
        ? "Confirmar e pagar no Pix"
        : "Fazer pedido";

  // ---- Render dos passos ----
  const renderAddress = () => (
    <div className="space-y-3">
      <button
        onClick={useLocation}
        disabled={locating}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-brasa-ring bg-brasa-soft py-3 text-sm font-bold text-brasa-700 transition active:scale-[0.99] disabled:opacity-60"
      >
        {locating ? <Loader2 size={16} className="animate-spin" /> : <LocateFixed size={16} />}
        Usar minha localização
      </button>

      <TextField
        name="cep"
        label="CEP"
        inputMode="numeric"
        autoComplete="postal-code"
        placeholder="29100-000"
        value={customer.cep}
        onChange={(e) => handleCep(e.target.value)}
        error={errors.cep}
        rightSlot={
          loadingCep ? (
            <Loader2 size={18} className="animate-spin text-brasa" />
          ) : (
            <MapPin size={18} className="text-muted" />
          )
        }
      />

      {!editingAddress && customer.street ? (
        <div className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-3 shadow-card">
          <MapPin size={18} className="shrink-0 text-success" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-ink">{customer.street}</p>
            <p className="truncate text-xs font-medium text-ink-2">
              {customer.neighborhood} · {customer.city}
            </p>
          </div>
          <button
            onClick={() => setEditingAddress(true)}
            className="flex items-center gap-1 text-xs font-bold text-brasa-700"
          >
            <Pencil size={12} /> editar
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <TextField
            name="street"
            label="Rua / Avenida"
            placeholder="Nome da rua"
            value={customer.street}
            onChange={(e) => setCustomer({ street: e.target.value })}
            error={errors.street}
          />
          <TextField
            name="neighborhood"
            label="Bairro"
            placeholder="Bairro"
            value={customer.neighborhood}
            onChange={(e) => setCustomer({ neighborhood: e.target.value })}
            error={errors.neighborhood}
          />
        </div>
      )}

      <div className="grid grid-cols-[1fr_1.6fr] gap-3">
        <TextField
          name="number"
          label="Número"
          inputMode="numeric"
          placeholder="123"
          value={customer.number}
          onChange={(e) => setCustomer({ number: e.target.value })}
          error={errors.number}
        />
        <TextField
          name="complement"
          label="Complemento"
          optional
          placeholder="Apto, bloco…"
          value={customer.complement}
          onChange={(e) => setCustomer({ complement: e.target.value })}
        />
      </div>

      {showRef ? (
        <TextField
          name="reference"
          label="Ponto de referência"
          optional
          placeholder="Ex.: portão azul, ao lado da farmácia"
          value={customer.reference}
          onChange={(e) => setCustomer({ reference: e.target.value })}
        />
      ) : (
        <button
          onClick={() => setShowRef(true)}
          className="flex items-center gap-1 text-sm font-bold text-brasa-700"
        >
          <Plus size={15} /> Ponto de referência
        </button>
      )}

      <div className="flex items-center gap-3 pt-2">
        <div className="h-px flex-1 bg-line" />
        <span className="text-xs font-bold uppercase tracking-wide text-muted">
          Pra confirmar no Zap 💬
        </span>
        <div className="h-px flex-1 bg-line" />
      </div>
      <CustomerForm errors={errors} />
    </div>
  );

  const renderRevisao = () => (
    <div className="space-y-4">
      {mode === "pickup" && (
        <>
          <div className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-3 shadow-card">
            <span className="text-xl">🏪</span>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wide text-muted">Você retira em</p>
              <p className="text-sm font-bold text-ink">{restaurant.address}</p>
              <p className="text-xs font-medium text-ink-2">{restaurant.city}</p>
            </div>
          </div>
          <CustomerForm errors={errors} />
        </>
      )}

      {mode === "delivery" && (
        <div className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-3 shadow-card">
          <span className="text-lg">💬</span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-ink">{customer.name}</p>
            <p className="truncate text-xs font-medium text-ink-2">
              {customer.phone} · {customer.street}, {customer.number}
            </p>
          </div>
          <button
            onClick={() => {
              setStep("endereco");
              setEnteredViaAddress(true);
            }}
            className="flex items-center gap-1 text-xs font-bold text-brasa-700"
          >
            <Pencil size={12} /> editar
          </button>
        </div>
      )}

      {/* Itens recolhidos */}
      <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
        <button
          onClick={() => setShowItems((v) => !v)}
          className="flex w-full items-center justify-between px-3.5 py-3 text-left"
        >
          <span className="text-sm font-bold text-ink">
            {totals.count} {totals.count === 1 ? "item" : "itens"} ·{" "}
            <span className="text-ink-2">{brl(totals.subtotal)}</span>
          </span>
          <span className="flex items-center gap-1 text-xs font-bold text-brasa-700">
            {showItems ? "ocultar" : "ver"}
            <ChevronDown size={15} className={showItems ? "rotate-180 transition" : "transition"} />
          </span>
        </button>
        {showItems && (
          <div className="divide-y divide-line border-t border-line px-3.5">
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
        )}
      </div>
      <button
        onClick={() => closeCheckout()}
        className="-mt-1 flex items-center gap-1 text-sm font-bold text-brasa-700"
      >
        <Plus size={15} /> Adicionar mais itens
      </button>

      {/* Pagamento */}
      <div>
        <h3 className="mb-2 font-display text-base font-extrabold text-ink">Como prefere pagar?</h3>
        <PaymentMethods
          value={payment}
          onChange={setPayment}
          onChangeFor={setChangeFor}
          collapseSecondary
        />
      </div>

      <OrderTotals totals={totals} mode={mode} />
    </div>
  );

  return (
    <Sheet
      open={open}
      onClose={closeCheckout}
      desktopPlacement="center"
      label="Finalizar pedido"
      panelClassName="bg-cream sm:max-w-md"
    >
      {/* Header fixo */}
      <div className="shrink-0 border-b border-line px-4 pb-3 pt-5">
        <div className="flex items-center gap-2 pr-10">
          <button
            onClick={goBack}
            aria-label="Voltar"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface text-ink shadow-card active:scale-90"
          >
            <ArrowLeft size={19} />
          </button>
          <h2 className="min-w-0 flex-1 truncate font-display text-lg font-extrabold leading-tight text-ink">
            {title}
          </h2>
          {mode === "delivery" && (
            <div className="flex shrink-0 items-center gap-1">
              <span className={`h-1.5 w-5 rounded-full ${step === "endereco" ? "bg-brasa" : "bg-success"}`} />
              <span className={`h-1.5 w-5 rounded-full ${step === "revisao" ? "bg-brasa" : "bg-line-2"}`} />
            </div>
          )}
        </div>
        <p className="ml-11 mt-0.5 text-xs font-medium text-ink-2">{subtitle}</p>

        {/* Context bar: modo + quando */}
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => setExpandedChip((c) => (c === "mode" ? null : "mode"))}
            className={`flex min-w-0 flex-1 items-center justify-between gap-1 rounded-full border bg-surface px-3 py-2 text-xs font-bold transition ${
              expandedChip === "mode" ? "border-brasa text-ink" : "border-line-2 text-ink-2"
            }`}
          >
            <span className="truncate">{chipModeText}</span>
            <ChevronDown size={14} className={`shrink-0 ${expandedChip === "mode" ? "rotate-180" : ""}`} />
          </button>
          <button
            onClick={() => setExpandedChip((c) => (c === "when" ? null : "when"))}
            className={`flex shrink-0 items-center gap-1 rounded-full border bg-surface px-3 py-2 text-xs font-bold transition ${
              expandedChip === "when" ? "border-brasa text-ink" : "border-line-2 text-ink-2"
            }`}
          >
            <span>{chipWhenText}</span>
            <ChevronDown size={14} className={expandedChip === "when" ? "rotate-180" : ""} />
          </button>
        </div>

        <AnimatePresence initial={false}>
          {expandedChip && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="overflow-hidden"
            >
              <div className="pt-3">{expandedChip === "mode" ? <ModeToggle /> : <SchedulePicker />}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Conteúdo deslizante */}
      <div ref={contentRef} className="no-scrollbar flex-1 overflow-y-auto px-4 py-4">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -18 }}
            transition={{ duration: 0.22 }}
          >
            {step === "endereco" ? renderAddress() : renderRevisao()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer fixo */}
      <div className="shrink-0 border-t border-line bg-cream px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))]">
        {step === "revisao" && (
          <p className="mb-2 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-muted">
            <Lock size={12} /> Loja oficial · +2,3 mil pedidos · sem cadastro
          </p>
        )}
        <button
          onClick={step === "endereco" ? goToRevisao : placeOrder}
          disabled={placing}
          className={buttonClasses(
            step === "revisao" && isPix ? "success" : "primary",
            "lg",
            "w-full justify-between",
          )}
        >
          <span className="flex items-center gap-2">
            {step === "revisao" && (isPix ? <QrCode size={18} /> : <ShieldCheck size={18} />)}
            {placing ? "Enviando…" : ctaLabel}
          </span>
          <span className="tabular-nums">{brl(totals.total)}</span>
        </button>
      </div>
    </Sheet>
  );
}
