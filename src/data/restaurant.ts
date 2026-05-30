import type { Restaurant, Coupon } from "@/lib/types";

export const restaurant: Restaurant = {
  name: "Brasa Burger",
  tagline: "Hambúrguer artesanal na brasa • smash & autorais",
  logo: "/img/brand/logo-burger.jpg",
  cover: "/img/brand/hero-cover.jpg",
  cuisine: "Hambúrguer · Artesanal",
  rating: 4.8,
  reviewCount: 2347,
  isOpen: true,
  hoursLabel: "Aberto agora · 18h às 23h30",
  closesAt: "23h30",
  deliveryTimeMin: 30,
  deliveryTimeMax: 45,
  deliveryFee: 6.99,
  freeDeliveryThreshold: 60,
  minOrder: 25,
  distanceKm: 2.4,
  address: "Av. Hugo Musso, 1024 — Praia da Costa",
  city: "Vila Velha, ES",
  phone: "(27) 99999-0000",
  whatsapp: "5527999990000",
  paymentMethods: [
    { id: "pix", label: "Pix", hint: "Aprovação na hora", onDelivery: false },
    { id: "credit", label: "Crédito na entrega", hint: "Visa, Master, Elo", onDelivery: true },
    { id: "debit", label: "Débito na entrega", onDelivery: true },
    { id: "cash", label: "Dinheiro", hint: "Informe a troco", onDelivery: true },
    { id: "vr", label: "Vale-refeição", hint: "Alelo, Sodexo, VR", onDelivery: true },
  ],
  highlights: [
    "Entrega em ~35 min",
    "+2,3 mil avaliações",
    "Pix aprovado na hora",
    "Loja oficial",
  ],
};

export const coupons: Coupon[] = [
  { code: "BEMVINDO10", label: "10% de desconto no 1º pedido", type: "percent", value: 10, minOrder: 30 },
  { code: "FRETEGRATIS", label: "Frete grátis", type: "free_delivery", value: 0, minOrder: 45 },
  { code: "BRASA15", label: "R$ 15 OFF", type: "fixed", value: 15, minOrder: 80 },
];
