"use client";

import { useMemo, useState } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { brl } from "@/lib/format";

/** PRNG determinístico para gerar um QR fake visualmente convincente. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function FakeQR({ value }: { value: string }) {
  const N = 25;
  const modules = useMemo(() => {
    let h = 2166136261;
    for (let i = 0; i < value.length; i++) h = (Math.imul(h ^ value.charCodeAt(i), 16777619)) >>> 0;
    const rnd = mulberry32(h);
    const grid: boolean[][] = Array.from({ length: N }, () =>
      Array.from({ length: N }, () => rnd() > 0.52),
    );
    // limpa áreas dos finder patterns
    const clear = (r0: number, c0: number) => {
      for (let r = 0; r < 7; r++) for (let c = 0; c < 7; c++) grid[r0 + r][c0 + c] = false;
    };
    clear(0, 0);
    clear(0, N - 7);
    clear(N - 7, 0);
    return grid;
  }, [value]);

  const finder = (x: number, y: number) => (
    <g transform={`translate(${x} ${y})`}>
      <rect width={7} height={7} fill="#1b1512" rx={1.5} />
      <rect x={1} y={1} width={5} height={5} fill="#fff" />
      <rect x={2} y={2} width={3} height={3} fill="#1b1512" rx={0.5} />
    </g>
  );

  return (
    <svg viewBox={`-1 -1 ${N + 2} ${N + 2}`} className="h-44 w-44" shapeRendering="crispEdges">
      <rect x={-1} y={-1} width={N + 2} height={N + 2} fill="#fff" />
      {modules.map((row, r) =>
        row.map((on, c) => (on ? <rect key={`${r}-${c}`} x={c} y={r} width={1} height={1} fill="#1b1512" /> : null)),
      )}
      {finder(0, 0)}
      {finder(N - 7, 0)}
      {finder(0, N - 7)}
    </svg>
  );
}

export function PixPanel({ amount, orderId }: { amount: number; orderId: string }) {
  const [copied, setCopied] = useState(false);
  const code = useMemo(
    () =>
      `00020126580014BR.GOV.BCB.PIX0136brasa-${orderId.toLowerCase()}-pix5204000053039865802BR5911BRASA BURGER6009VILA VELHA62070503***6304A1B2`,
    [orderId],
  );

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
    <div className="rounded-3xl border border-success/30 bg-success-soft p-4 text-center">
      <p className="font-display text-base font-extrabold text-ink">Pague com Pix e agilize 🚀</p>
      <p className="text-sm font-medium text-ink-2">
        Escaneie o QR ou use o copia e cola · <span className="font-bold text-success">{brl(amount)}</span>
      </p>
      <div className="mx-auto mt-3 w-fit rounded-2xl bg-surface p-3 shadow-card">
        <FakeQR value={code} />
      </div>
      <button
        onClick={copy}
        className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-success py-3 text-sm font-bold text-white shadow-[0_6px_16px_-4px_rgba(12,166,120,0.5)] transition active:scale-[0.98]"
      >
        {copied ? <Check size={17} /> : <Copy size={17} />}
        {copied ? "Código copiado!" : "Copiar código Pix"}
      </button>
      <p className="mt-2 text-[11px] font-medium text-ink-2">
        Demonstração · em produção o Pix é gerado pelo gateway e aprovado na hora.
      </p>
    </div>
  );
}
