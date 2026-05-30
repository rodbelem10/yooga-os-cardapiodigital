"use client";

import { useMemo } from "react";

/** PRNG determinístico para um QR fake visualmente convincente. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function FakeQR({ value, className = "h-44 w-44" }: { value: string; className?: string }) {
  const N = 25;
  const modules = useMemo(() => {
    let h = 2166136261;
    for (let i = 0; i < value.length; i++) h = Math.imul(h ^ value.charCodeAt(i), 16777619) >>> 0;
    const rnd = mulberry32(h);
    const grid: boolean[][] = Array.from({ length: N }, () =>
      Array.from({ length: N }, () => rnd() > 0.52),
    );
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
    <svg viewBox={`-1 -1 ${N + 2} ${N + 2}`} className={className} shapeRendering="crispEdges">
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
