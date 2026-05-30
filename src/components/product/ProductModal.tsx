"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Clock, Users } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/store/useStore";
import { getProduct } from "@/data/menu";
import type { OptionGroup, OptionItem, SelectedOption } from "@/lib/types";
import { buildCartItem, defaultSelections, unitPrice, validateSelections } from "@/lib/cart";
import { brl } from "@/lib/format";
import { Sheet } from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { ProductBadge } from "@/components/ui/Badge";
import { OptionGroupView } from "./OptionGroupView";

export function ProductModal() {
  const productModalId = useStore((s) => s.productModalId);
  const editingUid = useStore((s) => s.editingUid);
  const closeProduct = useStore((s) => s.closeProduct);
  const addItem = useStore((s) => s.addItem);
  const openCart = useStore((s) => s.openCart);
  const triggerFly = useStore((s) => s.triggerFly);

  const product = useMemo(
    () => (productModalId ? getProduct(productModalId) : undefined),
    [productModalId],
  );
  // mantém o conteúdo durante a animação de saída
  const lastRef = useRef(product);
  if (product) lastRef.current = product;
  const view = product ?? lastRef.current;

  const [selected, setSelected] = useState<SelectedOption[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [tried, setTried] = useState(false);

  useEffect(() => {
    if (!product) return;
    const editItem = editingUid
      ? useStore.getState().cart.find((i) => i.uid === editingUid)
      : undefined;
    if (editItem) {
      setSelected(editItem.selected);
      setQuantity(editItem.quantity);
      setNotes(editItem.notes ?? "");
    } else {
      setSelected(defaultSelections(product));
      setQuantity(1);
      setNotes("");
    }
    setTried(false);
  }, [productModalId, editingUid, product]);

  const selectedIdsOf = (gid: string) =>
    selected.filter((s) => s.groupId === gid).map((s) => s.optionId);

  const handleSelect = (group: OptionGroup, opt: OptionItem) => {
    const inGroup = selected.filter((s) => s.groupId === group.id);
    const exists = inGroup.some((s) => s.optionId === opt.id);
    if (group.type === "multiple" && !exists && inGroup.length >= group.max) {
      toast(`Máximo de ${group.max} em "${group.name}"`);
      return;
    }
    const entry: SelectedOption = {
      groupId: group.id,
      groupName: group.name,
      optionId: opt.id,
      optionName: opt.name,
      price: opt.price,
    };
    setSelected((prev) => {
      const others = prev.filter((s) => s.groupId !== group.id);
      const groupSel = prev.filter((s) => s.groupId === group.id);
      if (group.type === "single") return [...others, entry];
      if (exists) return [...others, ...groupSel.filter((s) => s.optionId !== opt.id)];
      return [...others, ...groupSel, entry];
    });
  };

  const total = view ? unitPrice(view.price, selected) * quantity : 0;
  const validation = view
    ? validateSelections(view, selected)
    : { ok: true, firstMissingGroupId: undefined as string | undefined };

  const handleSubmit = () => {
    if (!view) return;
    if (!validation.ok) {
      setTried(true);
      document
        .getElementById(`group-${validation.firstMissingGroupId}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      toast.error("Escolha as opções obrigatórias");
      return;
    }
    addItem(buildCartItem(view, selected, quantity, notes), editingUid ?? undefined);
    closeProduct();
    if (editingUid) {
      toast.success("Item atualizado");
      openCart();
    } else {
      triggerFly();
      toast.success(`${view.name} adicionado 🍔`);
    }
  };

  const discount =
    view?.originalPrice && view.originalPrice > view.price
      ? Math.round((1 - view.price / view.originalPrice) * 100)
      : 0;

  return (
    <Sheet
      open={!!product}
      onClose={closeProduct}
      desktopPlacement="center"
      label={view?.name}
      panelClassName="sm:max-w-lg"
    >
      {view && (
        <>
          <div className="no-scrollbar flex-1 overflow-y-auto">
            {/* Foto */}
            <div className="relative h-52 w-full sm:h-60">
              <Image src={view.image} alt={view.name} fill sizes="(min-width:640px) 512px, 100vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 to-transparent" />
              {(view.badges?.length || discount > 0) && (
                <div className="absolute bottom-3 left-4 flex flex-wrap gap-1.5">
                  {discount > 0 && (
                    <span className="rounded-full bg-brasa px-2 py-1 text-[11px] font-extrabold text-white shadow">
                      -{discount}% OFF
                    </span>
                  )}
                  {view.badges?.map((b) => (
                    <ProductBadge key={b} kind={b} className="shadow" />
                  ))}
                </div>
              )}
            </div>

            {/* Cabeçalho */}
            <div className="px-4 pt-4">
              <h2 className="font-display text-2xl font-extrabold leading-tight text-ink">
                {view.name}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-ink-2">{view.description}</p>
              <div className="mt-2.5 flex flex-wrap items-center gap-2">
                {view.serves && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-cream-2 px-2.5 py-1 text-xs font-semibold text-ink-2">
                    <Users size={13} /> {view.serves}
                  </span>
                )}
                {view.prepHint && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-cream-2 px-2.5 py-1 text-xs font-semibold text-ink-2">
                    <Clock size={13} /> {view.prepHint}
                  </span>
                )}
                {(view.orderedCount ?? 0) > 200 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-brasa-soft px-2.5 py-1 text-xs font-bold text-brasa-700">
                    🔥 {view.orderedCount} pedidos
                  </span>
                )}
              </div>
            </div>

            {/* Grupos de opções */}
            <div className="mt-4 space-y-2">
              {view.optionGroups?.map((group) => (
                <OptionGroupView
                  key={group.id}
                  group={group}
                  selectedIds={selectedIdsOf(group.id)}
                  onSelect={(opt) => handleSelect(group, opt)}
                  errored={tried && group.required && selectedIdsOf(group.id).length < group.min}
                />
              ))}
            </div>

            {/* Observações */}
            <div className="px-4 py-4">
              <label htmlFor="obs" className="font-bold text-ink">
                Alguma observação?
              </label>
              <textarea
                id="obs"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                maxLength={140}
                rows={2}
                placeholder="Ex.: tirar a cebola, caprichar no molho, ponto da carne…"
                className="mt-2 w-full resize-none rounded-2xl border border-line-2 bg-surface p-3 text-sm font-medium text-ink outline-none transition placeholder:text-muted focus:border-brasa-ring focus:ring-4 focus:ring-brasa-soft"
              />
              <p className="mt-1 text-right text-[11px] font-medium text-muted">{notes.length}/140</p>
            </div>
          </div>

          {/* CTA fixo */}
          <div className="border-t border-line bg-cream px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))]">
            <div className="flex items-center gap-3">
              <QuantityStepper value={quantity} onChange={(n) => setQuantity(Math.max(1, n))} size="lg" />
              <Button size="lg" onClick={handleSubmit} className="flex-1 justify-between">
                <span>{editingUid ? "Atualizar" : "Adicionar"}</span>
                <span className="tabular-nums">{brl(total)}</span>
              </Button>
            </div>
          </div>
        </>
      )}
    </Sheet>
  );
}
