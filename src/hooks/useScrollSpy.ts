"use client";

import { useEffect, useState } from "react";

/** Retorna o id da seção atualmente em foco com base no scroll. */
export function useScrollSpy(ids: string[], offset = 132): string {
  const [active, setActive] = useState(ids[0] ?? "");

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY + offset + 4;
        let current = ids[0] ?? "";
        for (const id of ids) {
          const el = document.getElementById(id);
          if (el && el.offsetTop <= y) current = id;
        }
        // chegou ao fim → última seção
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
          current = ids[ids.length - 1] ?? current;
        }
        setActive(current);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ids, offset]);

  return active;
}
