"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Copy, Check, Clock, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { restaurant } from "@/data/restaurant";
import { brl } from "@/lib/format";
import { loadPlacedOrder, type PlacedOrder } from "@/lib/order";
import { useMounted } from "@/hooks/useMounted";
import { buttonClasses } from "@/components/ui/Button";
import { FakeQR } from "./FakeQR";

const TOTAL_SECONDS = 600; // 10 min

export function PixPaymentView() {
  const router = useRouter();
  const mounted = useMounted();
  const [order, setOrder] = useState<PlacedOrder | null>(null);
  const [seconds, setSeconds] = useState(TOTAL_SECONDS);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setOrder(loadPlacedOrder());
  }, []);

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  const code = useMemo(
    () =>
      order
        ? `00020126580014BR.GOV.BCB.PIX0136brasa-${order.id.toLowerCase()}-pix5204000053039865802BR5911BRASA BURGER6009VILA VELHA62070503***6304A1B2`
        : "",
    [order],
  );

  if (!mounted) return null;
  if (!order) {
    return (
      <div className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center px-8 text-center">
        <h1 className="font-display text-xl font-extrabold text-ink">Pagamento não encontrado</h1>
        <Link href="/" className={buttonClasses("primary", "md", "mt-5")}>
          Ver cardápio
        </Link>
      </div>
    );
  }

  const expired = seconds <= 0;
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  const progress = (seconds / TOTAL_SECONDS) * 100;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      /* noop */
    }
    setCopied(true);
    toast.success("Código Pix copiado 📋");
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="min-h-dvh bg-cream-2">
      <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-line bg-cream/95 px-4 py-3 backdrop-blur-md">
        <Link
          href="/"
          aria-label="Voltar ao cardápio"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-ink shadow-card active:scale-90"
        >
          <ArrowLeft size={20} />
        </Link>
        <div className="min-w-0">
          <h1 className="font-display text-base font-extrabold leading-tight text-ink">
            Pagamento via Pix
          </h1>
          <p className="text-xs font-medium text-ink-2">{restaurant.name}</p>
        </div>
      </header>

      <div className="mx-auto max-w-md space-y-4 px-4 py-5">
        {/* Ticket do pedido */}
        <div className="rounded-3xl bg-cream p-5 text-center shadow-card">
          <p className="inline-flex items-center gap-1.5 text-sm font-bold text-ink-2">
            🧾 Pedido #{order.id}
          </p>
          <p className="mt-1 font-display text-4xl font-extrabold tabular-nums text-ink">
            {brl(order.totals.total)}
          </p>
          <p className="mt-1 text-xs font-medium text-muted">
            {order.dateLabel} · {order.timeLabel}
          </p>
        </div>

        {/* QR + copia e cola */}
        <div className="rounded-3xl border border-success/30 bg-success-soft p-5 text-center">
          <p className="font-display text-base font-extrabold text-ink">Escaneie pra pagar 🚀</p>
          <p className="text-xs font-medium text-ink-2">Abra o app do banco e aponte a câmera no QR</p>
          <div className="mx-auto mt-3 w-fit rounded-2xl bg-surface p-3 shadow-card">
            <FakeQR value={code} />
          </div>
          <div className="mt-4 flex items-center gap-2">
            <div className="h-px flex-1 bg-success/20" />
            <span className="text-[11px] font-bold uppercase tracking-wide text-ink-2">
              ou Pix copia e cola
            </span>
            <div className="h-px flex-1 bg-success/20" />
          </div>
          <div className="mt-2 truncate rounded-xl border border-line-2 bg-surface px-3 py-2.5 text-left font-mono text-[11px] text-ink-2">
            {code}
          </div>
          <button
            onClick={copy}
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-success py-3 text-sm font-bold text-white shadow-[0_6px_16px_-4px_rgba(12,166,120,0.5)] transition active:scale-[0.98]"
          >
            {copied ? <Check size={17} /> : <Copy size={17} />}
            {copied ? "Código copiado!" : "Copiar código Pix"}
          </button>
        </div>

        {/* Timer */}
        <div className="rounded-2xl border border-line bg-cream p-4 shadow-card">
          {expired ? (
            <div className="text-center">
              <p className="font-bold text-danger">Código Pix expirado</p>
              <p className="mb-3 text-xs font-medium text-ink-2">Gere um novo pra concluir o pagamento.</p>
              <button
                onClick={() => {
                  setSeconds(TOTAL_SECONDS);
                  toast.success("Novo código Pix gerado");
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-charcoal px-4 py-2.5 text-sm font-bold text-white active:scale-95"
              >
                <RefreshCw size={15} /> Gerar novo código
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-sm font-bold text-ink">
                  <Clock size={15} className="text-brasa" /> Este código expira em
                </span>
                <span className="font-display text-lg font-extrabold tabular-nums text-ink">
                  {mm}:{ss}
                </span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-cream-2">
                <div
                  className="h-full rounded-full bg-gradient-brasa transition-all duration-1000 ease-linear"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </>
          )}
        </div>

        {/* Já paguei */}
        <button
          onClick={() => router.push("/pedido")}
          className={buttonClasses("primary", "lg", "w-full")}
        >
          Já paguei · acompanhar pedido
        </button>
        <p className="text-center text-[11px] font-medium text-muted">
          Assim que identificarmos o pagamento, você é redirecionado automaticamente.
          <br />
          Demonstração · Pix fictício, sem cobrança real.
        </p>
      </div>
    </div>
  );
}
