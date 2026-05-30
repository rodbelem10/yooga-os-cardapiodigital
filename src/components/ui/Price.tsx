import { cn } from "@/lib/cn";
import { brl } from "@/lib/format";

interface Props {
  price: number;
  original?: number;
  className?: string;
  size?: "sm" | "md" | "lg";
  prefix?: string; // ex.: "a partir de "
}

export function Price({ price, original, className, size = "md", prefix }: Props) {
  const sizeClass = { sm: "text-sm", md: "text-[15px]", lg: "text-xl" }[size];
  const hasPromo = original && original > price;
  return (
    <span className={cn("inline-flex items-baseline gap-1.5 font-bold", className)}>
      {prefix && <span className="text-xs font-medium text-muted">{prefix}</span>}
      {hasPromo && (
        <span className="text-xs font-semibold text-muted line-through">{brl(original)}</span>
      )}
      <span className={cn(sizeClass, hasPromo ? "text-brasa-700" : "text-ink")}>{brl(price)}</span>
    </span>
  );
}
