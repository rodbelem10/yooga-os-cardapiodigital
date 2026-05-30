"use client";

import { useEffect, useState } from "react";

/** Retorna false no 1º render (SSR + hidratação) e true após montar — evita mismatch com estado persistido. */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
