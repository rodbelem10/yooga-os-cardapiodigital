import { Star } from "lucide-react";
import { cn } from "@/lib/cn";

export function Stars({
  rating,
  count,
  className,
}: {
  rating: number;
  count?: number;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      <Star size={14} className="fill-gold text-gold" />
      <span className="font-bold text-ink">{rating.toFixed(1)}</span>
      {count !== undefined && (
        <span className="text-xs font-medium text-muted">
          ({count.toLocaleString("pt-BR")})
        </span>
      )}
    </span>
  );
}
