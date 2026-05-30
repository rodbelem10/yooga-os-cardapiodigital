// Formatação BR

export function brl(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
}

/** "12,90" sem o R$ (para preço grande com símbolo separado) */
export function brlParts(value: number): { symbol: string; amount: string } {
  return { symbol: "R$", amount: value.toFixed(2).replace(".", ",") };
}

/** Máscara de telefone celular BR: (27) 99999-0000 */
export function maskPhone(raw: string): string {
  const d = raw.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

/** Máscara de CEP: 29100-000 */
export function maskCep(raw: string): string {
  const d = raw.replace(/\D/g, "").slice(0, 8);
  if (d.length <= 5) return d;
  return `${d.slice(0, 5)}-${d.slice(5)}`;
}

export function onlyDigits(raw: string): string {
  return raw.replace(/\D/g, "");
}

export function isValidPhone(raw: string): boolean {
  return onlyDigits(raw).length >= 10;
}

export function isValidCep(raw: string): boolean {
  return onlyDigits(raw).length === 8;
}
