"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/cn";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  rightSlot?: React.ReactNode;
}

export const TextField = forwardRef<HTMLInputElement, Props>(function TextField(
  { label, error, hint, optional, rightSlot, className, id, ...props },
  ref,
) {
  const inputId = id ?? props.name;
  return (
    <label htmlFor={inputId} className="block">
      <span className="mb-1.5 flex items-center gap-1.5 text-sm font-bold text-ink">
        {label}
        {optional && <span className="text-xs font-medium text-muted">(opcional)</span>}
      </span>
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "h-12 w-full rounded-xl border bg-surface px-3.5 text-[15px] font-medium text-ink outline-none transition placeholder:font-normal placeholder:text-muted",
            error
              ? "border-danger ring-4 ring-danger/10"
              : "border-line-2 focus:border-brasa-ring focus:ring-4 focus:ring-brasa-soft",
            rightSlot && "pr-11",
            className,
          )}
          {...props}
        />
        {rightSlot && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightSlot}</div>
        )}
      </div>
      {error ? (
        <span className="mt-1 block text-xs font-semibold text-danger">{error}</span>
      ) : hint ? (
        <span className="mt-1 block text-xs font-medium text-muted">{hint}</span>
      ) : null}
    </label>
  );
});
