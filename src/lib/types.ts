// ============================================================
// Tipos do domínio — Cardápio Digital
// ============================================================

export type Badge = "mais_pedido" | "novo" | "promo" | "chef" | "vegetariano" | "picante";

export interface OptionItem {
  id: string;
  name: string;
  description?: string;
  price: number; // adicional em R$ (0 = grátis)
  default?: boolean; // já vem selecionado
  tag?: string; // ex.: "Mais escolhido"
}

export interface OptionGroup {
  id: string;
  name: string;
  description?: string;
  type: "single" | "multiple";
  required: boolean;
  min: number;
  max: number;
  options: OptionItem[];
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number; // preço base
  originalPrice?: number; // se em promoção (riscado)
  image: string;
  badges?: Badge[];
  serves?: string; // ex.: "Serve 1 pessoa"
  prepHint?: string; // ex.: "Sai em ~25 min"
  rating?: number; // 0-100 (% de aprovação) ou nota
  orderedCount?: number; // prova social: "pedido 320x essa semana"
  optionGroups?: OptionGroup[];
  spicy?: boolean;
}

export interface Category {
  id: string;
  name: string;
  emoji: string;
  description?: string;
}

export type PaymentKind = "pix" | "credit" | "debit" | "cash" | "vr";

export interface PaymentMethod {
  id: PaymentKind;
  label: string;
  hint?: string;
  onDelivery: boolean; // pago na entrega
}

export interface Restaurant {
  name: string;
  tagline: string;
  logo: string;
  cover: string;
  cuisine: string;
  rating: number; // 0-5
  reviewCount: number;
  isOpen: boolean;
  hoursLabel: string;
  closesAt: string;
  deliveryTimeMin: number;
  deliveryTimeMax: number;
  deliveryFee: number; // 0 = grátis
  freeDeliveryThreshold: number; // pedido mínimo p/ frete grátis
  minOrder: number;
  distanceKm: number;
  address: string;
  city: string;
  phone: string;
  whatsapp: string; // só dígitos com DDI
  paymentMethods: PaymentMethod[];
  highlights: string[]; // selos de confiança
}

// ---- Carrinho ----

export interface SelectedOption {
  groupId: string;
  groupName: string;
  optionId: string;
  optionName: string;
  price: number;
}

export interface CartItem {
  uid: string; // identificador único da linha
  productId: string;
  name: string;
  image: string;
  basePrice: number;
  quantity: number;
  selected: SelectedOption[];
  notes?: string;
  unitPrice: number; // base + adicionais
  lineTotal: number; // unitPrice * quantity
}

export type OrderMode = "delivery" | "pickup";

export interface CustomerInfo {
  name: string;
  phone: string;
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  reference: string;
}

export interface Coupon {
  code: string;
  label: string;
  type: "percent" | "fixed" | "free_delivery";
  value: number;
  minOrder: number;
}
