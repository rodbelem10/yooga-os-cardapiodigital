import { cn } from "@/lib/cn";
import type { Badge as BadgeKind } from "@/lib/types";

const config: Record<BadgeKind, { label: string; className: string }> = {
  mais_pedido: { label: "🔥 Mais pedido", className: "bg-brasa-soft text-brasa-700" },
  novo: { label: "Novidade", className: "bg-success-soft text-success" },
  promo: { label: "Promo", className: "bg-warn-soft text-warn" },
  chef: { label: "⭐ Do chef", className: "bg-charcoal text-white" },
  vegetariano: { label: "🌱 Veggie", className: "bg-success-soft text-success" },
  picante: { label: "🌶️ Picante", className: "bg-[#fde7e7] text-danger" },
};

export function ProductBadge({ kind, className }: { kind: BadgeKind; className?: string }) {
  const c = config[kind];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold leading-none tracking-tight whitespace-nowrap",
        c.className,
        className,
      )}
    >
      {c.label}
    </span>
  );
}

export function Pill({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
        className,
      )}
    >
      {children}
    </span>
  );
}
