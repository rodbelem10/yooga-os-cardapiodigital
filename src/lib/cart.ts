import type { CartItem, Product, SelectedOption } from "./types";

/** Seleções iniciais de um produto (opções marcadas como default + obrigatórias). */
export function defaultSelections(product: Product): SelectedOption[] {
  const selected: SelectedOption[] = [];
  for (const group of product.optionGroups ?? []) {
    const defaults = group.options.filter((o) => o.default);
    // singles obrigatórios sem default → pega o primeiro
    const toAdd =
      defaults.length > 0
        ? defaults
        : group.type === "single" && group.required
          ? [group.options[0]]
          : [];
    for (const opt of toAdd) {
      selected.push({
        groupId: group.id,
        groupName: group.name,
        optionId: opt.id,
        optionName: opt.name,
        price: opt.price,
      });
    }
  }
  return selected;
}

export function unitPrice(basePrice: number, selected: SelectedOption[]): number {
  return basePrice + selected.reduce((sum, s) => sum + s.price, 0);
}

/** Assinatura para mesclar linhas idênticas (mesmo produto + mesmas opções + obs). */
export function lineSignature(productId: string, selected: SelectedOption[], notes?: string): string {
  const opts = [...selected]
    .map((s) => `${s.groupId}:${s.optionId}`)
    .sort()
    .join("|");
  return `${productId}__${opts}__${(notes ?? "").trim().toLowerCase()}`;
}

export function buildCartItem(
  product: Product,
  selected: SelectedOption[],
  quantity: number,
  notes?: string,
): CartItem {
  const u = unitPrice(product.price, selected);
  return {
    uid: lineSignature(product.id, selected, notes),
    productId: product.id,
    name: product.name,
    image: product.image,
    basePrice: product.price,
    quantity,
    selected,
    notes: notes?.trim() || undefined,
    unitPrice: u,
    lineTotal: u * quantity,
  };
}

/** Valida se todas as obrigatoriedades de um produto estão satisfeitas. */
export function validateSelections(
  product: Product,
  selected: SelectedOption[],
): { ok: boolean; firstMissingGroupId?: string } {
  for (const group of product.optionGroups ?? []) {
    const count = selected.filter((s) => s.groupId === group.id).length;
    if (group.required && count < group.min) {
      return { ok: false, firstMissingGroupId: group.id };
    }
  }
  return { ok: true };
}

/** Texto curto das opções escolhidas (para exibir na linha do carrinho). */
export function selectionSummary(selected: SelectedOption[]): string {
  const paid = selected.filter((s) => s.price > 0).map((s) => s.optionName);
  const free = selected
    .filter((s) => s.price === 0)
    .map((s) => s.optionName)
    .filter((n) => n.toLowerCase() !== "ao ponto");
  return [...free, ...paid].join(" · ");
}
