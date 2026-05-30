import type { Category, OptionGroup, Product } from "@/lib/types";

// ============================================================
// Grupos de opções reutilizáveis
// ============================================================

const PONTO: OptionGroup = {
  id: "ponto",
  name: "Ponto da carne",
  type: "single",
  required: true,
  min: 1,
  max: 1,
  options: [
    { id: "mal", name: "Mal passado", price: 0 },
    { id: "ponto", name: "Ao ponto", price: 0, default: true, tag: "Mais pedido" },
    { id: "bem", name: "Bem passado", price: 0 },
  ],
};

const PAO: OptionGroup = {
  id: "pao",
  name: "Escolha o pão",
  type: "single",
  required: true,
  min: 1,
  max: 1,
  options: [
    { id: "brioche", name: "Brioche selado na manteiga", price: 0, default: true },
    { id: "australiano", name: "Australiano", price: 2.5 },
    { id: "semgluten", name: "Sem glúten", price: 4 },
  ],
};

const ADICIONAIS: OptionGroup = {
  id: "adicionais",
  name: "Bora caprichar?",
  description: "Adicione o que quiser",
  type: "multiple",
  required: false,
  min: 0,
  max: 6,
  options: [
    { id: "carne-extra", name: "Carne extra 200g", price: 9, tag: "Favorito" },
    { id: "bacon", name: "Bacon caramelizado", price: 5 },
    { id: "cheddar-extra", name: "Cheddar maturado extra", price: 4 },
    { id: "catupiry", name: "Catupiry original", price: 5 },
    { id: "ovo", name: "Ovo frito", price: 3 },
    { id: "cebola-car", name: "Cebola caramelizada", price: 4 },
    { id: "picles", name: "Picles artesanal", price: 2 },
  ],
};

const MOLHOS: OptionGroup = {
  id: "molhos",
  name: "Molhos da casa",
  description: "Grátis · até 3",
  type: "multiple",
  required: false,
  min: 0,
  max: 3,
  options: [
    { id: "maionese-verde", name: "Maionese verde da casa", price: 0, default: true },
    { id: "barbecue", name: "Barbecue defumado", price: 0 },
    { id: "cheddar-molho", name: "Cheddar cremoso", price: 0 },
    { id: "mostarda-mel", name: "Mostarda & mel", price: 0 },
    { id: "picante", name: "Pimenta da casa 🌶️", price: 0 },
  ],
};

const COMBO_ACOMP: OptionGroup = {
  id: "acomp",
  name: "Escolha o acompanhamento",
  type: "single",
  required: true,
  min: 1,
  max: 1,
  options: [
    { id: "fritas", name: "Batata frita crocante", price: 0, default: true },
    { id: "rustica", name: "Batata rústica", price: 0 },
    { id: "onion", name: "Onion rings", price: 3 },
  ],
};

const COMBO_BEBIDA: OptionGroup = {
  id: "bebida",
  name: "Escolha a bebida",
  type: "single",
  required: true,
  min: 1,
  max: 1,
  options: [
    { id: "coca", name: "Coca-Cola 350ml", price: 0, default: true },
    { id: "coca-zero", name: "Coca-Cola Zero 350ml", price: 0 },
    { id: "guarana", name: "Guaraná 350ml", price: 0 },
    { id: "suco", name: "Suco natural de laranja", price: 4 },
    { id: "agua", name: "Água sem gás", price: 0 },
  ],
};

const TAMANHO_PORCAO: OptionGroup = {
  id: "tamanho",
  name: "Tamanho",
  type: "single",
  required: true,
  min: 1,
  max: 1,
  options: [
    { id: "individual", name: "Individual", price: 0, default: true },
    { id: "dividir", name: "Para dividir", price: 12, tag: "Serve 2" },
  ],
};

const SHAKE_SABOR: OptionGroup = {
  id: "sabor",
  name: "Sabor do milkshake",
  type: "single",
  required: true,
  min: 1,
  max: 1,
  options: [
    { id: "ovomaltine", name: "Ovomaltine", price: 0, default: true, tag: "Top 1" },
    { id: "morango", name: "Morango", price: 0 },
    { id: "chocolate", name: "Chocolate belga", price: 2 },
    { id: "ninho", name: "Leite Ninho", price: 2 },
  ],
};

// ============================================================
// Categorias (ordem = ordem de exibição)
// ============================================================

export const categories: Category[] = [
  { id: "combos", name: "Combos", emoji: "🍔🍟", description: "Pediu, economizou. Lanche + acompanhamento + bebida." },
  { id: "smash", name: "Smash", emoji: "🔥", description: "Burgers na chapa, bordas crocantes." },
  { id: "artesanais", name: "Artesanais", emoji: "🍔", description: "Blend 200g grelhado na brasa." },
  { id: "frango", name: "Frango", emoji: "🐔", description: "Crocante por fora, suculento por dentro." },
  { id: "veggie", name: "Veggie", emoji: "🥬", description: "Saboroso de verdade, sem carne." },
  { id: "porcoes", name: "Porções", emoji: "🍟", description: "Pra dividir (ou não)." },
  { id: "bebidas", name: "Bebidas", emoji: "🥤" },
  { id: "sobremesas", name: "Sobremesas", emoji: "🍰", description: "O final feliz." },
];

// ============================================================
// Produtos
// ============================================================

export const products: Product[] = [
  // ---------- COMBOS ----------
  {
    id: "combo-smash",
    categoryId: "combos",
    name: "Combo Smash da Brasa",
    description: "Smash duplo com bacon e cheddar + batata crocante + bebida gelada. O queridinho da casa.",
    price: 42.9,
    originalPrice: 49.8,
    image: "/img/products/combo.jpg",
    badges: ["mais_pedido", "promo"],
    serves: "Serve 1 pessoa",
    prepHint: "Pronto em ~30 min",
    orderedCount: 530,
    optionGroups: [COMBO_ACOMP, COMBO_BEBIDA, ADICIONAIS, MOLHOS],
  },
  {
    id: "combo-duplo",
    categoryId: "combos",
    name: "Combo Brasa pra Dois",
    description: "2 burgers artesanais 200g + fritas cheddar & bacon (grande) + 2 bebidas. Perfeito pra dividir.",
    price: 89.9,
    image: "/img/products/burger-double.jpg",
    badges: ["chef"],
    serves: "Serve 2 pessoas",
    prepHint: "Pronto em ~35 min",
    orderedCount: 188,
    optionGroups: [COMBO_BEBIDA, ADICIONAIS, MOLHOS],
  },
  {
    id: "combo-kids",
    categoryId: "combos",
    name: "Combo Kids",
    description: "Mini burger de carne + 4 nuggets + suco natural + brinde surpresa.",
    price: 29.9,
    image: "/img/products/nuggets.jpg",
    serves: "Serve 1 criança",
    orderedCount: 96,
    optionGroups: [COMBO_BEBIDA],
  },

  // ---------- SMASH ----------
  {
    id: "smash-classico",
    categoryId: "smash",
    name: "Smash Clássico",
    description: "2 burgers smash 90g, cheddar duplo, cebola na chapa e molho da casa no pão brioche.",
    price: 28.9,
    image: "/img/products/burger-smash.jpg",
    badges: ["mais_pedido"],
    serves: "Serve 1 pessoa",
    orderedCount: 412,
    optionGroups: [PAO, ADICIONAIS, MOLHOS],
  },
  {
    id: "smash-bacon",
    categoryId: "smash",
    name: "Smash Bacon",
    description: "Duplo smash, muito bacon caramelizado, cheddar maturado e maionese verde.",
    price: 33.9,
    originalPrice: 37.9,
    image: "/img/products/burger-classic.jpg",
    badges: ["promo"],
    serves: "Serve 1 pessoa",
    orderedCount: 357,
    optionGroups: [PAO, ADICIONAIS, MOLHOS],
  },
  {
    id: "smash-salada",
    categoryId: "smash",
    name: "Smash Salada",
    description: "Smash 90g, cheddar, alface americana, tomate e picles. Leveza com sabor.",
    price: 29.9,
    image: "/img/products/burger-cheddar.jpg",
    serves: "Serve 1 pessoa",
    orderedCount: 142,
    optionGroups: [PAO, ADICIONAIS, MOLHOS],
  },

  // ---------- ARTESANAIS ----------
  {
    id: "brasa-signature",
    categoryId: "artesanais",
    name: "Brasa Signature",
    description: "Blend 200g grelhado na brasa, cheddar maturado, bacon, cebola caramelizada e molho secreto.",
    price: 38.9,
    image: "/img/products/burger-artesanal.jpg",
    badges: ["chef", "mais_pedido"],
    serves: "Serve 1 pessoa",
    prepHint: "Grelhado na hora",
    orderedCount: 320,
    optionGroups: [PONTO, PAO, ADICIONAIS, MOLHOS],
  },
  {
    id: "bacon-monster",
    categoryId: "artesanais",
    name: "Bacon Monster",
    description: "Duplo 200g, dobro de bacon, dobro de cheddar e onion rings. Pra quem tá com fome de verdade.",
    price: 46.9,
    image: "/img/products/burger-monster.jpg",
    badges: ["mais_pedido"],
    serves: "Serve 1 pessoa (faminta)",
    orderedCount: 264,
    optionGroups: [PONTO, PAO, ADICIONAIS, MOLHOS],
  },
  {
    id: "cheddar-melt",
    categoryId: "artesanais",
    name: "Cheddar Melt",
    description: "200g na brasa afogado no cheddar cremoso, onion rings e barbecue defumado.",
    price: 36.9,
    image: "/img/products/burger-double.jpg",
    serves: "Serve 1 pessoa",
    orderedCount: 201,
    optionGroups: [PONTO, PAO, ADICIONAIS, MOLHOS],
  },
  {
    id: "classic-burger",
    categoryId: "artesanais",
    name: "Classic Burger",
    description: "Burger 180g, queijo prato derretido, alface, tomate e picles. O básico bem feito.",
    price: 30.9,
    image: "/img/products/burger-bacon.jpg",
    serves: "Serve 1 pessoa",
    orderedCount: 173,
    optionGroups: [PONTO, PAO, ADICIONAIS, MOLHOS],
  },

  // ---------- FRANGO ----------
  {
    id: "crispy-chicken",
    categoryId: "frango",
    name: "Crispy Chicken",
    description: "Filé de frango empanado super crocante, cheddar, alface e maionese verde da casa.",
    price: 32.9,
    image: "/img/products/burger-chicken.jpg",
    badges: ["novo"],
    serves: "Serve 1 pessoa",
    orderedCount: 119,
    optionGroups: [PAO, ADICIONAIS, MOLHOS],
  },
  {
    id: "chicken-supreme",
    categoryId: "frango",
    name: "Chicken Supreme Picante",
    description: "Frango crocante, cheddar, cebola roxa e molho da casa apimentado. Pra quem curte fogo.",
    price: 34.9,
    image: "/img/products/burger-chicken.jpg",
    badges: ["picante"],
    spicy: true,
    serves: "Serve 1 pessoa",
    orderedCount: 87,
    optionGroups: [PAO, ADICIONAIS, MOLHOS],
  },

  // ---------- VEGGIE ----------
  {
    id: "veggie-burger",
    categoryId: "veggie",
    name: "Veggie da Casa",
    description: "Burger de grão-de-bico e beterraba, queijo coalho, rúcula e maionese verde. 100% vegetariano.",
    price: 31.9,
    image: "/img/products/burger-veggie.jpg",
    badges: ["vegetariano"],
    serves: "Serve 1 pessoa",
    orderedCount: 64,
    optionGroups: [PAO, MOLHOS],
  },

  // ---------- PORÇÕES ----------
  {
    id: "fritas",
    categoryId: "porcoes",
    name: "Batata Frita Crocante",
    description: "Batatas sequinhas e crocantes, com nosso sal de ervas da casa.",
    price: 18.9,
    image: "/img/products/fries.jpg",
    orderedCount: 298,
    optionGroups: [TAMANHO_PORCAO, MOLHOS],
  },
  {
    id: "fritas-cheddar",
    categoryId: "porcoes",
    name: "Fritas Cheddar & Bacon",
    description: "Batata crocante coberta com cheddar cremoso e bacon em cubos. Viciante.",
    price: 28.9,
    image: "/img/products/fries-cheddar.jpg",
    badges: ["mais_pedido"],
    orderedCount: 341,
    optionGroups: [TAMANHO_PORCAO, MOLHOS],
  },
  {
    id: "onion-rings",
    categoryId: "porcoes",
    name: "Onion Rings (8un)",
    description: "Anéis de cebola empanados na cervejinha, super crocantes, com molho barbecue.",
    price: 22.9,
    image: "/img/products/onion-rings.jpg",
    orderedCount: 156,
  },
  {
    id: "nuggets",
    categoryId: "porcoes",
    name: "Nuggets (10un)",
    description: "Nuggets de frango crocantes com molho da casa à parte.",
    price: 24.9,
    image: "/img/products/nuggets.jpg",
    orderedCount: 122,
  },
  {
    id: "coxinha",
    categoryId: "porcoes",
    name: "Coxinha de Costela (6un)",
    description: "Coxinhas cremosas recheadas com costela desfiada. Novidade que virou febre.",
    price: 26.9,
    image: "/img/products/coxinha.jpg",
    badges: ["novo"],
    orderedCount: 98,
  },
  {
    id: "iscas-frango",
    categoryId: "porcoes",
    name: "Iscas de Frango",
    description: "Iscas empanadas crocantes com limão e molho da casa.",
    price: 27.9,
    image: "/img/products/fried-snack.jpg",
    orderedCount: 71,
  },

  // ---------- BEBIDAS ----------
  {
    id: "coca",
    categoryId: "bebidas",
    name: "Coca-Cola Lata 350ml",
    description: "Gelada.",
    price: 7,
    image: "/img/products/soda-cola.jpg",
    orderedCount: 489,
  },
  {
    id: "guarana",
    categoryId: "bebidas",
    name: "Guaraná Antarctica Lata 350ml",
    description: "Gelado.",
    price: 6.5,
    image: "/img/products/soda-can.jpg",
    orderedCount: 277,
  },
  {
    id: "suco-laranja",
    categoryId: "bebidas",
    name: "Suco Natural de Laranja 500ml",
    description: "Espremido na hora, sem açúcar.",
    price: 12.9,
    image: "/img/products/juice-orange.jpg",
    orderedCount: 134,
  },
  {
    id: "cerveja",
    categoryId: "bebidas",
    name: "Heineken Long Neck 330ml",
    description: "Estupidamente gelada.",
    price: 11.9,
    image: "/img/products/beer.jpg",
    orderedCount: 203,
  },
  {
    id: "agua",
    categoryId: "bebidas",
    name: "Água Mineral 500ml",
    description: "Com ou sem gás.",
    price: 5,
    image: "/img/products/water.jpg",
    orderedCount: 98,
  },

  // ---------- SOBREMESAS ----------
  {
    id: "milkshake",
    categoryId: "sobremesas",
    name: "Milkshake 400ml",
    description: "Cremoso e generoso, do jeito que sobremesa tem que ser.",
    price: 19.9,
    image: "/img/products/milkshake.jpg",
    badges: ["mais_pedido"],
    orderedCount: 267,
    optionGroups: [SHAKE_SABOR],
  },
  {
    id: "brownie",
    categoryId: "sobremesas",
    name: "Brownie com Sorvete",
    description: "Brownie quentinho de chocolate meio amargo com bola de sorvete de creme e calda.",
    price: 18.9,
    image: "/img/products/brownie.jpg",
    badges: ["chef"],
    orderedCount: 159,
  },
  {
    id: "petit-gateau",
    categoryId: "sobremesas",
    name: "Petit Gâteau",
    description: "Bolinho de chocolate com recheio derretido e sorvete de creme.",
    price: 21.9,
    image: "/img/products/petit-gateau.jpg",
    orderedCount: 112,
  },
  {
    id: "pudim",
    categoryId: "sobremesas",
    name: "Pudim de Leite",
    description: "Clássico, cremoso, com calda de caramelo.",
    price: 12.9,
    image: "/img/products/pudim.jpg",
    orderedCount: 88,
  },
  {
    id: "casquinha",
    categoryId: "sobremesas",
    name: "Casquinha Dupla",
    description: "Duas bolas de sorvete (creme e chocolate) na casquinha crocante.",
    price: 14.9,
    image: "/img/products/icecream.jpg",
    orderedCount: 76,
  },
];

// ============================================================
// Helpers de consulta
// ============================================================

export function productsByCategory(categoryId: string): Product[] {
  return products.filter((p) => p.categoryId === categoryId);
}

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

/** Produtos "mais pedidos" para o trilho de destaque (prova social). */
export const popularProducts: Product[] = [...products]
  .filter((p) => p.badges?.includes("mais_pedido") || (p.orderedCount ?? 0) > 250)
  .sort((a, b) => (b.orderedCount ?? 0) - (a.orderedCount ?? 0))
  .slice(0, 8);

/** Itens baratos e rápidos pra upsell no carrinho. */
export const upsellProducts: Product[] = products
  .filter((p) => ["bebidas", "sobremesas", "porcoes"].includes(p.categoryId))
  .sort((a, b) => a.price - b.price);
