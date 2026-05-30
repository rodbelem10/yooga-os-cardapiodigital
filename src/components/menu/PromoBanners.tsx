"use client";

import { Ticket, Bike, Percent } from "lucide-react";

const banners = [
  {
    id: "combo",
    title: "Combo Smash da Brasa",
    subtitle: "Lanche + fritas + bebida",
    tag: "-14%",
    icon: Percent,
    className: "bg-gradient-brasa text-white",
    target: "combos",
  },
  {
    id: "frete",
    title: "Frete grátis",
    subtitle: "Em pedidos acima de R$ 60",
    tag: "🛵",
    icon: Bike,
    className: "bg-gradient-charcoal text-white",
    target: "smash",
  },
  {
    id: "cupom",
    title: "10% no 1º pedido",
    subtitle: "Use o cupom BEMVINDO10",
    tag: "Cupom",
    icon: Ticket,
    className: "bg-success text-white",
    target: "artesanais",
  },
];

export function PromoBanners() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="no-scrollbar snap-x-mandatory flex gap-3 overflow-x-auto px-4 pb-1">
      {banners.map((b) => (
        <button
          key={b.id}
          onClick={() => scrollTo(b.target)}
          className={`snap-start relative flex h-24 w-[78%] shrink-0 flex-col justify-center overflow-hidden rounded-2xl px-4 text-left shadow-card sm:w-64 ${b.className}`}
        >
          <span className="absolute right-3 top-3 rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-bold backdrop-blur">
            {b.tag}
          </span>
          <b.icon size={20} className="mb-1 opacity-90" />
          <span className="font-display text-lg font-extrabold leading-tight">{b.title}</span>
          <span className="text-xs font-medium opacity-90">{b.subtitle}</span>
        </button>
      ))}
    </div>
  );
}
