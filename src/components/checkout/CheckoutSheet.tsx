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
import { makeOrderId, savePlacedOrder, type PlacedOrder } from "@/lib/order";
import { Sheet } from "@/components/ui/Sheet";
import { buttonClasses } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { OrderTotals } from "@/components/cart/OrderTotals";
import { PaymentMethods } from "./PaymentMethods";
import { CustomerForm } from "./CustomerForm";
import { ModeToggle } from "@/components/menu/ModeToggle";
import { SchedulePicker } from "./SchedulePicker";

type Step = "endereco" | "contato" | "revisao";
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

  const [stack, setStack] = useState<Step[]>(["revisao"]);
  const [editingReturn, setEditingReturn] = useState(false);
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

  const step = stack[stack.length - 1] ?? "revisao";
  const stepsForMode: Step[] =
    mode === "delivery" ? ["endereco", "contato", "revisao"] : ["contato", "revisao"];

  const hasContact = customer.name.trim().length >= 2 && isValidPhone(customer.phone);
  const hasAddress =
    isValidCep(customer.cep) &&
    !!customer.street.trim() &&
    !!customer.number.trim() &&
    !!customer.neighborhood.trim();

  // Roteamento: abre no primeiro passo incompleto (recorrente cai direto na revisão)
  useEffect(() => {
    if (!open) return;
    let start: Step = "revisao";
    for (const s of stepsForMode) {
      if (s === "endereco" && !hasAddress) { start = s; break; }
      if (s === "contato" && !hasContact) { start = s; break; }
      if (s === "revisao") { start = s; break; }
    }
    setStack([start]);
    setOpenedReturning(start === "revisao");
    setEditingReturn(false);
    setErrors({});
    setExpandedChip(null);
    setPlacing(false);
    setShowItems(false);
    setEditingAddress(!customer.street.trim());
    setShowRef(!!customer.reference.trim());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, mode]);

  const firstName = customer.name.trim().split(" ")[0] || "";

  const scrollTop = () => contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  const focusFirst = (e: Record<string, string>) => {
    const el = document.getElementById(Object.keys(e)[0]);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => (el as HTMLElement | null)?.focus(), 300);
  };

  const validateContact = () => {
    const e: Record<string, string> = {};
    if (customer.name.trim().length < 2) e.name = "Como podemos te chamar?";
    if (!isValidPhone(customer.phone)) e.phone = "WhatsApp inválido";
    return e;
  };
  const validateAddress = () => {
    const e: Record<string, string> = {};
    if (!isValidCep(customer.cep)) e.cep = "CEP inválido";
    if (!customer.street.trim()) e.street = "Informe a rua";
    if (!customer.number.trim()) e.number = "Nº";
    if (!customer.neighborhood.trim()) e.neighborhood = "Informe o bairro";
    return e;
  };

  const goBack = () => {
    setExpandedChip(null);
    if (editingReturn) {
      setEditingReturn(false);
      setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
      return;
    }
    if (stack.length <= 1) {
      closeCheckout();
      openCart();
      return;
    }
    setStack((s) => s.slice(0, -1));
  };

  const goNext = (target: Step) => {
    setStack((s) => [...s, target]);
    scrollTop();
  };

  const finishEdit = () => {
    setEditingReturn(false);
    setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
    scrollTop();
  };

  const editField = (target: Step) => {
    setEditingReturn(true);
    setStack((s) => [...s, target]);
    scrollTop();
  };

  const onPrimary = () => {
    if (step === "endereco") {
      const e = validateAddress();
      setErrors(e);
      if (Object.keys(e).length) { toast.error("Confira os campos destacados"); focusFirst(e); return; }
      editingReturn ? finishEdit() : goNext("contato");
      return;
    }
    if (step === "contato") {
      const e = validateContact();
      setErrors(e);
      if (Object.keys(e).length) { toast.error("Confira os campos destacados"); focusFirst(e); return; }
      editingReturn ? finishEdit() : goNext("revisao");
      return;
    }
    placeOrder();
  };

  const placeOrder = () => {
    const e = { ...validateContact(), ...(mode === "delivery" ? validateAddress() : {}) };
    setErrors(e);
    if (Object.keys(e).length) {
      const firstStep: Step =
        mode === "delivery" && (e.cep || e.street || e.number || e.neighborhood)
          ? "endereco"
          : "contato";
      setStack([...stepsForMode.slice(0, stepsForMode.indexOf(firstStep) + 1)]);
      toast.error("Confira os campos destacados");
      setTimeout(() => focusFirst(e), 120);
      return;
    }

    setPlacing(true);
    const orderId = makeOrderId();
    const paymentLabel = restaurant.paymentMethods.find((p) => p.id === payment)?.label ?? "Pix";
    const now = new Date();
    const order: PlacedOrder = {
      id: orderId,
      dateLabel: now
        .toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })
        .replace(/\./g, ""),
      timeLabel: now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
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
    };
    savePlacedOrder(order);
    setTimeout(() => {
      closeCheckout();
      router.push(payment === "pix" ? "/pagamento" : "/pedido");
    }, 450);
  };

  // ---- Endereço ----
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

  // ---- Textos ----
  const feeText = totals.freeDelivery ? "grátis" : brl(restaurant.deliveryFee);
  const chipModeText =
    mode === "delivery"
      ? `🛵 Entrega · ${restaurant.deliveryTimeMin}–${restaurant.deliveryTimeMax} min · ${feeText}`
      : `🏪 Retirada · pronto em ~${PICKUP_ETA} min`;
  const chipWhenText = scheduledFor ? `📅 ${scheduledFor}` : "⚡ Agora";

  const heads: Record<Step, { title: string; subtitle: string }> = {
    endereco: {
      title: "Onde a gente entrega? 🛵",
      subtitle: "Começa pelo CEP que a gente preenche o resto.",
    },
    contato: {
      title: "Quase lá! 🤝",
      subtitle: "Só pra confirmar e te avisar pelo WhatsApp.",
    },
    revisao: {
      title: openedReturning ? `Bom te ver de novo, ${firstName} 👋` : "Tudo certo? 🤝",
      subtitle: openedReturning
        ? "Tá tudo como da última vez — é só conferir e pagar."
        : "Confere e paga no Pix — cai na hora ⚡",
    },
  };

  const isPix = payment === "pix";
  const ctaLabel = editingReturn
    ? "Salvar"
    : step === "endereco"
      ? "Continuar"
      : step === "contato"
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
    </div>
  );

  const renderContato = () => (
    <div className="space-y-3">
      <CustomerForm errors={errors} />
      <p className="flex items-center gap-1.5 px-1 text-xs font-medium text-muted">
        <Lock size={13} className="shrink-0" /> Sem cadastro e sem senha — é só pra confirmar e te avisar
        quando o pedido sair.
      </p>
    </div>
  );

  const renderRevisao = () => (
    <div className="space-y-4">
      {mode === "pickup" ? (
        <>
          <div className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-3 shadow-card">
            <span className="text-xl">🏪</span>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wide text-muted">Você retira em</p>
              <p className="text-sm font-bold text-ink">{restaurant.address}</p>
              <p className="text-xs font-medium text-ink-2">{restaurant.city}</p>
            </div>
          </div>
          <SummaryCard
            icon="💬"
            line1={customer.name}
            line2={customer.phone}
            onEdit={() => editField("contato")}
          />
        </>
      ) : (
        <div className="divide-y divide-line rounded-2xl border border-line bg-surface shadow-card">
          <SummaryRow
            icon="💬"
            line1={customer.name}
            line2={customer.phone}
            onEdit={() => editField("contato")}
          />
          <SummaryRow
            icon="📍"
            line1={`${customer.street}, ${customer.number}`}
            line2={`${customer.neighborhood} — ${customer.city}`}
            onEdit={() => editField("endereco")}
          />
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
            <ChevronDown size={15} className={showItems ? "rotate-180" : ""} />
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

      <div>
        <h3 className="mb-2 font-display text-base font-extrabold text-ink">Como prefere pagar?</h3>
        <PaymentMethods value={payment} onChange={setPayment} onChangeFor={setChangeFor} collapseSecondary />
      </div>

      <OrderTotals totals={totals} mode={mode} />
    </div>
  );

  const renderStep = () =>
    step === "endereco" ? renderAddress() : step === "contato" ? renderContato() : renderRevisao();

  const currentIndex = stepsForMode.indexOf(step);

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
            {heads[step].title}
          </h2>
          <div className="flex shrink-0 items-center gap-1">
            {stepsForMode.map((s, i) => (
              <span
                key={s}
                className={`h-1.5 rounded-full transition-all ${
                  i === currentIndex ? "w-5 bg-brasa" : i < currentIndex ? "w-2.5 bg-success" : "w-2.5 bg-line-2"
                }`}
              />
            ))}
          </div>
        </div>
        <p className="ml-11 mt-0.5 text-xs font-medium text-ink-2">{heads[step].subtitle}</p>

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
            key={step + (editingReturn ? "-edit" : "")}
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -18 }}
            transition={{ duration: 0.22 }}
          >
            {renderStep()}
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
          onClick={onPrimary}
          disabled={placing}
          className={buttonClasses(
            step === "revisao" && isPix && !editingReturn ? "success" : "primary",
            "lg",
            "w-full justify-between",
          )}
        >
          <span className="flex items-center gap-2">
            {step === "revisao" && !editingReturn && (isPix ? <QrCode size={18} /> : <ShieldCheck size={18} />)}
            {placing ? "Enviando…" : ctaLabel}
          </span>
          <span className="tabular-nums">{brl(totals.total)}</span>
        </button>
      </div>
    </Sheet>
  );
}

function SummaryRow({
  icon,
  line1,
  line2,
  onEdit,
}: {
  icon: string;
  line1: string;
  line2: string;
  onEdit: () => void;
}) {
  return (
    <div className="flex items-center gap-3 p-3">
      <span className="text-lg">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-ink">{line1}</p>
        <p className="truncate text-xs font-medium text-ink-2">{line2}</p>
      </div>
      <button onClick={onEdit} className="flex items-center gap-1 text-xs font-bold text-brasa-700">
        <Pencil size={12} /> editar
      </button>
    </div>
  );
}

function SummaryCard(props: { icon: string; line1: string; line2: string; onEdit: () => void }) {
  return (
    <div className="rounded-2xl border border-line bg-surface shadow-card">
      <SummaryRow {...props} />
    </div>
  );
}
