"use client";

import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";
import { useMounted } from "@/hooks/useMounted";
import { useIsDesktop } from "@/hooks/useMediaQuery";

type DesktopPlacement = "right" | "center";

interface SheetProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  desktopPlacement?: DesktopPlacement;
  label?: string;
  panelClassName?: string;
  showClose?: boolean;
}

export function Sheet({
  open,
  onClose,
  children,
  desktopPlacement = "center",
  label,
  panelClassName,
  showClose = true,
}: SheetProps) {
  const mounted = useMounted();
  const isDesktop = useIsDesktop();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!mounted) return null;

  const placement: "bottom" | DesktopPlacement = isDesktop ? desktopPlacement : "bottom";

  const variants = {
    bottom: { initial: { y: "100%" }, animate: { y: 0 }, exit: { y: "100%" } },
    right: { initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "100%" } },
    center: {
      initial: { opacity: 0, scale: 0.96, y: 12 },
      animate: { opacity: 1, scale: 1, y: 0 },
      exit: { opacity: 0, scale: 0.97, y: 8 },
    },
  }[placement];

  const containerClass = {
    bottom: "items-end justify-center",
    right: "items-stretch justify-end",
    center: "items-center justify-center p-4",
  }[placement];

  const panelBase = {
    bottom: "w-full rounded-t-3xl max-h-[93vh]",
    right: "h-full w-full max-w-md",
    center: "w-full max-w-lg rounded-3xl max-h-[88vh] shadow-pop",
  }[placement];

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className={cn("fixed inset-0 z-50 flex", containerClass)}
          aria-modal="true"
          role="dialog"
          aria-label={label}
        >
          <motion.div
            className="absolute inset-0 bg-charcoal/55 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className={cn(
              "relative z-10 flex flex-col overflow-hidden bg-cream",
              panelBase,
              panelClassName,
            )}
            initial={variants.initial}
            animate={variants.animate}
            exit={variants.exit}
            transition={{ type: "spring", damping: 32, stiffness: 340 }}
          >
            {placement === "bottom" && (
              <div className="absolute left-1/2 top-2 z-20 h-1.5 w-10 -translate-x-1/2 rounded-full bg-ink/15" />
            )}
            {showClose && (
              <button
                onClick={onClose}
                aria-label="Fechar"
                className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-cream/80 text-ink-2 shadow-card backdrop-blur transition active:scale-90"
              >
                <X size={18} strokeWidth={2.5} />
              </button>
            )}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
