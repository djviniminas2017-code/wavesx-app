export type FoodCategory = 'proteina' | 'carboidrato' | 'fruta' | 'vegetal' | 'laticinios' | 'gordura' | 'suplemento' | 'outros'

export interface FoodDef {
  id: string
  name: string
  category: FoodCategory
  per100: { cal: number; protein: number; carb: number; fat: number }
  defaultUnit: 'g' | 'ml' | 'un'
  gramPerUnit?: number
  defaultQty: number
  emoji: string
  premium: boolean
}

export function calcFoodMacros(food: FoodDef, qty: number) {
  const grams = food.defaultUnit === 'un' ? qty * (food.gramPerUnit ?? 100) : qty
  const f = grams / 100
  return {
    calories: Math.round(food.per100.cal * f),
    protein: Math.round(food.per100.protein * f * 10) / 10,
    carb: Math.round(food.per100.carb * f * 10) / 10,
    fat: Math.round(food.per100.fat * f * 10) / 10,
  }
}

export const FOODS: FoodDef[] = [
  // ── FREE (10) ─────────────────────────────────────────────────────────────
  { id: 'ovo', name: 'Ovo inteiro', category: 'proteina', per100: { cal: 155, protein: 13, carb: 1.1, fat: 11 }, defaultUnit: 'un', gramPerUnit: 50, defaultQty: 2, emoji: '🥚', premium: false },
  { id: 'frango', name: 'Frango grelhado (peito)', category: 'proteina', per100: { cal: 165, protein: 31, carb: 0, fat: 4 }, defaultUnit: 'g', defaultQty: 150, emoji: '🍗', premium: false },
  { id: 'arroz', name: 'Arroz branco cozido', category: 'carboidrato', per100: { cal: 130, protein: 2.7, carb: 28, fat: 0.3 }, defaultUnit: 'g', defaultQty: 150, emoji: '🍚', premium: false },
  { id: 'feijao', name: 'Feijão preto cozido', category: 'carboidrato', per100: { cal: 132, protein: 8.7, carb: 24, fat: 0.5 }, defaultUnit: 'g', defaultQty: 100, emoji: '🫘', premium: false },
  { id: 'banana', name: 'Banana', category: 'fruta', per100: { cal: 89, protein: 1.1, carb: 23, fat: 0.3 }, defaultUnit: 'un', gramPerUnit: 120, defaultQty: 1, emoji: '🍌', premium: false },
  { id: 'aveia', name: 'Aveia em flocos', category: 'carboidrato', per100: { cal: 366, protein: 14, carb: 66, fat: 7 }, defaultUnit: 'g', defaultQty: 60, emoji: '🌾', premium: false },
  { id: 'batata-doce', name: 'Batata-doce cozida', category: 'carboidrato', per100: { cal: 86, protein: 1.6, carb: 20, fat: 0.1 }, defaultUnit: 'g', defaultQty: 150, emoji: '🍠', premium: false },
  { id: 'whey', name: 'Whey Protein', category: 'suplemento', per100: { cal: 400, protein: 80, carb: 10, fat: 7 }, defaultUnit: 'g', defaultQty: 30, emoji: '🥛', premium: false },
  { id: 'azeite', name: 'Azeite de oliva', category: 'gordura', per100: { cal: 884, protein: 0, carb: 0, fat: 100 }, defaultUnit: 'ml', defaultQty: 10, emoji: '🫒', premium: false },
  { id: 'brocolis', name: 'Brócolis cozido', category: 'vegetal', per100: { cal: 35, protein: 2.8, carb: 7, fat: 0.4 }, defaultUnit: 'g', defaultQty: 100, emoji: '🥦', premium: false },

  // ── PREMIUM — Proteínas ────────────────────────────────────────────────────
  { id: 'salmon', name: 'Salmão grelhado', category: 'proteina', per100: { cal: 208, protein: 20, carb: 0, fat: 13 }, defaultUnit: 'g', defaultQty: 150, emoji: '🐟', premium: true },
  { id: 'atum', name: 'Atum em lata (água)', category: 'proteina', per100: { cal: 116, protein: 26, carb: 0, fat: 1 }, defaultUnit: 'g', defaultQty: 120, emoji: '🐡', premium: true },
  { id: 'tilapia', name: 'Tilápia grelhada', category: 'proteina', per100: { cal: 128, protein: 26, carb: 0, fat: 3 }, defaultUnit: 'g', defaultQty: 150, emoji: '🐠', premium: true },
  { id: 'carne-bovina', name: 'Carne bovina (patinho)', category: 'proteina', per100: { cal: 163, protein: 28, carb: 0, fat: 5 }, defaultUnit: 'g', defaultQty: 150, emoji: '🥩', premium: true },
  { id: 'carne-moida', name: 'Carne moída (90% magra)', category: 'proteina', per100: { cal: 175, protein: 26, carb: 0, fat: 8 }, defaultUnit: 'g', defaultQty: 150, emoji: '🍖', premium: true },
  { id: 'clara-ovo', name: 'Clara de ovo', category: 'proteina', per100: { cal: 52, protein: 11, carb: 0.7, fat: 0.2 }, defaultUnit: 'un', gramPerUnit: 35, defaultQty: 4, emoji: '🥚', premium: true },
  { id: 'cottage', name: 'Queijo cottage', category: 'laticinios', per100: { cal: 98, protein: 11, carb: 3.4, fat: 4.3 }, defaultUnit: 'g', defaultQty: 100, emoji: '🧀', premium: true },
  { id: 'iogurte-grego', name: 'Iogurte grego natural', category: 'laticinios', per100: { cal: 97, protein: 9, carb: 5, fat: 5 }, defaultUnit: 'g', defaultQty: 170, emoji: '🥛', premium: true },
  { id: 'sardinha', name: 'Sardinha em lata (azeite)', category: 'proteina', per100: { cal: 208, protein: 24, carb: 0, fat: 12 }, defaultUnit: 'g', defaultQty: 100, emoji: '🐟', premium: true },
  { id: 'camarao', name: 'Camarão grelhado', category: 'proteina', per100: { cal: 99, protein: 21, carb: 0, fat: 1.1 }, defaultUnit: 'g', defaultQty: 120, emoji: '🦐', premium: true },
  { id: 'albumina', name: 'Albumina (pó)', category: 'suplemento', per100: { cal: 352, protein: 80, carb: 4, fat: 0 }, defaultUnit: 'g', defaultQty: 30, emoji: '🥚', premium: true },
  { id: 'linguica', name: 'Linguiça de frango', category: 'proteina', per100: { cal: 185, protein: 15, carb: 3, fat: 13 }, defaultUnit: 'g', defaultQty: 100, emoji: '🌭', premium: true },

  // ── PREMIUM — Carboidratos ─────────────────────────────────────────────────
  { id: 'arroz-int', name: 'Arroz integral cozido', category: 'carboidrato', per100: { cal: 111, protein: 2.6, carb: 23, fat: 0.9 }, defaultUnit: 'g', defaultQty: 150, emoji: '🍚', premium: true },
  { id: 'macarrao', name: 'Macarrão cozido', category: 'carboidrato', per100: { cal: 158, protein: 5.5, carb: 31, fat: 0.9 }, defaultUnit: 'g', defaultQty: 150, emoji: '🍝', premium: true },
  { id: 'pao-integral', name: 'Pão integral', category: 'carboidrato', per100: { cal: 247, protein: 9, carb: 41, fat: 4 }, defaultUnit: 'un', gramPerUnit: 25, defaultQty: 2, emoji: '🍞', premium: true },
  { id: 'tapioca', name: 'Tapioca', category: 'carboidrato', per100: { cal: 360, protein: 0.2, carb: 89, fat: 0.1 }, defaultUnit: 'g', defaultQty: 50, emoji: '🥞', premium: true },
  { id: 'mandioca', name: 'Mandioca cozida', category: 'carboidrato', per100: { cal: 125, protein: 1, carb: 30, fat: 0.3 }, defaultUnit: 'g', defaultQty: 150, emoji: '🥔', premium: true },
  { id: 'batata', name: 'Batata inglesa cozida', category: 'carboidrato', per100: { cal: 77, protein: 2, carb: 17, fat: 0.1 }, defaultUnit: 'g', defaultQty: 150, emoji: '🥔', premium: true },
  { id: 'inhame', name: 'Inhame cozido', category: 'carboidrato', per100: { cal: 118, protein: 1.5, carb: 28, fat: 0.2 }, defaultUnit: 'g', defaultQty: 150, emoji: '🥔', premium: true },
  { id: 'cuscuz', name: 'Cuscuz de milho', category: 'carboidrato', per100: { cal: 332, protein: 7, carb: 70, fat: 2 }, defaultUnit: 'g', defaultQty: 80, emoji: '🌽', premium: true },
  { id: 'lentilha', name: 'Lentilha cozida', category: 'carboidrato', per100: { cal: 116, protein: 9, carb: 20, fat: 0.4 }, defaultUnit: 'g', defaultQty: 100, emoji: '🫘', premium: true },
  { id: 'grao-bico', name: 'Grão-de-bico cozido', category: 'carboidrato', per100: { cal: 164, protein: 9, carb: 27, fat: 2.6 }, defaultUnit: 'g', defaultQty: 100, emoji: '🫘', premium: true },
  { id: 'granola', name: 'Granola', category: 'carboidrato', per100: { cal: 471, protein: 10, carb: 64, fat: 20 }, defaultUnit: 'g', defaultQty: 40, emoji: '🌾', premium: true },
  { id: 'paes-frances', name: 'Pão francês', category: 'carboidrato', per100: { cal: 300, protein: 8, carb: 58, fat: 3 }, defaultUnit: 'un', gramPerUnit: 50, defaultQty: 1, emoji: '🥖', premium: true },

  // ── PREMIUM — Frutas ──────────────────────────────────────────────────────
  { id: 'maca', name: 'Maçã', category: 'fruta', per100: { cal: 52, protein: 0.3, carb: 14, fat: 0.2 }, defaultUnit: 'un', gramPerUnit: 150, defaultQty: 1, emoji: '🍎', premium: true },
  { id: 'laranja', name: 'Laranja', category: 'fruta', per100: { cal: 47, protein: 0.9, carb: 12, fat: 0.1 }, defaultUnit: 'un', gramPerUnit: 150, defaultQty: 1, emoji: '🍊', premium: true },
  { id: 'mamao', name: 'Mamão', category: 'fruta', per100: { cal: 43, protein: 0.5, carb: 11, fat: 0.1 }, defaultUnit: 'g', defaultQty: 200, emoji: '🍈', premium: true },
  { id: 'abacate', name: 'Abacate', category: 'fruta', per100: { cal: 160, protein: 2, carb: 9, fat: 15 }, defaultUnit: 'g', defaultQty: 100, emoji: '🥑', premium: true },
  { id: 'manga', name: 'Manga', category: 'fruta', per100: { cal: 60, protein: 0.8, carb: 15, fat: 0.4 }, defaultUnit: 'g', defaultQty: 150, emoji: '🥭', premium: true },
  { id: 'morango', name: 'Morango', category: 'fruta', per100: { cal: 32, protein: 0.7, carb: 7.7, fat: 0.3 }, defaultUnit: 'g', defaultQty: 100, emoji: '🍓', premium: true },
  { id: 'uva', name: 'Uva', category: 'fruta', per100: { cal: 69, protein: 0.7, carb: 18, fat: 0.2 }, defaultUnit: 'g', defaultQty: 100, emoji: '🍇', premium: true },
  { id: 'melancia', name: 'Melancia', category: 'fruta', per100: { cal: 30, protein: 0.6, carb: 7.6, fat: 0.2 }, defaultUnit: 'g', defaultQty: 200, emoji: '🍉', premium: true },
  { id: 'coco-carne', name: 'Coco (carne)', category: 'fruta', per100: { cal: 354, protein: 3.3, carb: 15, fat: 33 }, defaultUnit: 'g', defaultQty: 50, emoji: '🥥', premium: true },
  { id: 'kiwi', name: 'Kiwi', category: 'fruta', per100: { cal: 61, protein: 1.1, carb: 15, fat: 0.5 }, defaultUnit: 'un', gramPerUnit: 80, defaultQty: 1, emoji: '🥝', premium: true },

  // ── PREMIUM — Vegetais ─────────────────────────────────────────────────────
  { id: 'cenoura', name: 'Cenoura', category: 'vegetal', per100: { cal: 41, protein: 0.9, carb: 10, fat: 0.2 }, defaultUnit: 'g', defaultQty: 100, emoji: '🥕', premium: true },
  { id: 'espinafre', name: 'Espinafre', category: 'vegetal', per100: { cal: 23, protein: 2.9, carb: 3.6, fat: 0.4 }, defaultUnit: 'g', defaultQty: 100, emoji: '🥬', premium: true },
  { id: 'tomate', name: 'Tomate', category: 'vegetal', per100: { cal: 18, protein: 0.9, carb: 3.9, fat: 0.2 }, defaultUnit: 'un', gramPerUnit: 100, defaultQty: 1, emoji: '🍅', premium: true },
  { id: 'alface', name: 'Alface', category: 'vegetal', per100: { cal: 15, protein: 1.4, carb: 2.9, fat: 0.2 }, defaultUnit: 'g', defaultQty: 60, emoji: '🥗', premium: true },
  { id: 'pepino', name: 'Pepino', category: 'vegetal', per100: { cal: 15, protein: 0.6, carb: 3.6, fat: 0.1 }, defaultUnit: 'g', defaultQty: 100, emoji: '🥒', premium: true },
  { id: 'abobrinha', name: 'Abobrinha cozida', category: 'vegetal', per100: { cal: 17, protein: 1.2, carb: 3.5, fat: 0.3 }, defaultUnit: 'g', defaultQty: 150, emoji: '🥒', premium: true },
  { id: 'couve', name: 'Couve refogada', category: 'vegetal', per100: { cal: 28, protein: 3.3, carb: 4.5, fat: 0.7 }, defaultUnit: 'g', defaultQty: 80, emoji: '🥬', premium: true },
  { id: 'beterraba', name: 'Beterraba cozida', category: 'vegetal', per100: { cal: 44, protein: 1.7, carb: 10, fat: 0.2 }, defaultUnit: 'g', defaultQty: 100, emoji: '🟣', premium: true },
  { id: 'pimentao', name: 'Pimentão vermelho', category: 'vegetal', per100: { cal: 31, protein: 1, carb: 7.1, fat: 0.3 }, defaultUnit: 'un', gramPerUnit: 120, defaultQty: 1, emoji: '🫑', premium: true },
  { id: 'chuchu', name: 'Chuchu cozido', category: 'vegetal', per100: { cal: 19, protein: 0.8, carb: 4.5, fat: 0.2 }, defaultUnit: 'g', defaultQty: 150, emoji: '🥦', premium: true },
  { id: 'couve-flor', name: 'Couve-flor', category: 'vegetal', per100: { cal: 25, protein: 1.9, carb: 5, fat: 0.3 }, defaultUnit: 'g', defaultQty: 150, emoji: '🥦', premium: true },

  // ── PREMIUM — Laticínios ───────────────────────────────────────────────────
  { id: 'leite-int', name: 'Leite integral', category: 'laticinios', per100: { cal: 61, protein: 3.2, carb: 4.8, fat: 3.3 }, defaultUnit: 'ml', defaultQty: 250, emoji: '🥛', premium: true },
  { id: 'iogurte-nat', name: 'Iogurte natural', category: 'laticinios', per100: { cal: 61, protein: 3.5, carb: 4.7, fat: 3.3 }, defaultUnit: 'g', defaultQty: 170, emoji: '🥛', premium: true },
  { id: 'mussarela', name: 'Queijo mussarela', category: 'laticinios', per100: { cal: 280, protein: 22, carb: 2.2, fat: 20 }, defaultUnit: 'g', defaultQty: 30, emoji: '🧀', premium: true },
  { id: 'requeijao', name: 'Requeijão cremoso', category: 'laticinios', per100: { cal: 256, protein: 8, carb: 3, fat: 23 }, defaultUnit: 'g', defaultQty: 30, emoji: '🧀', premium: true },

  // ── PREMIUM — Gorduras ─────────────────────────────────────────────────────
  { id: 'amendoim', name: 'Amendoim torrado', category: 'gordura', per100: { cal: 567, protein: 26, carb: 16, fat: 49 }, defaultUnit: 'g', defaultQty: 30, emoji: '🥜', premium: true },
  { id: 'pasta-amendoim', name: 'Pasta de amendoim integral', category: 'gordura', per100: { cal: 588, protein: 24, carb: 22, fat: 50 }, defaultUnit: 'g', defaultQty: 30, emoji: '🥜', premium: true },
  { id: 'castanha-para', name: 'Castanha do Pará', category: 'gordura', per100: { cal: 656, protein: 14, carb: 12, fat: 66 }, defaultUnit: 'un', gramPerUnit: 5, defaultQty: 3, emoji: '🌰', premium: true },
  { id: 'amendoa', name: 'Amêndoa', category: 'gordura', per100: { cal: 579, protein: 21, carb: 22, fat: 50 }, defaultUnit: 'g', defaultQty: 30, emoji: '🌰', premium: true },
  { id: 'chia', name: 'Semente de chia', category: 'gordura', per100: { cal: 486, protein: 17, carb: 42, fat: 31 }, defaultUnit: 'g', defaultQty: 15, emoji: '🌱', premium: true },
  { id: 'linhaca', name: 'Semente de linhaça', category: 'gordura', per100: { cal: 534, protein: 18, carb: 29, fat: 42 }, defaultUnit: 'g', defaultQty: 15, emoji: '🌱', premium: true },
  { id: 'coco-oleo', name: 'Óleo de coco', category: 'gordura', per100: { cal: 892, protein: 0, carb: 0, fat: 99 }, defaultUnit: 'ml', defaultQty: 10, emoji: '🥥', premium: true },

  // ── PREMIUM — Suplementos ─────────────────────────────────────────────────
  { id: 'caseina', name: 'Caseína (pó)', category: 'suplemento', per100: { cal: 360, protein: 75, carb: 8, fat: 3 }, defaultUnit: 'g', defaultQty: 35, emoji: '🥛', premium: true },
  { id: 'dextrose', name: 'Dextrose', category: 'suplemento', per100: { cal: 392, protein: 0, carb: 98, fat: 0 }, defaultUnit: 'g', defaultQty: 30, emoji: '⚡', premium: true },
  { id: 'maltodextrina', name: 'Maltodextrina', category: 'suplemento', per100: { cal: 380, protein: 0, carb: 95, fat: 0 }, defaultUnit: 'g', defaultQty: 30, emoji: '⚡', premium: true },

  // ── PREMIUM — Outros ───────────────────────────────────────────────────────
  { id: 'mel', name: 'Mel', category: 'outros', per100: { cal: 304, protein: 0.3, carb: 82, fat: 0 }, defaultUnit: 'g', defaultQty: 20, emoji: '🍯', premium: true },
  { id: 'geleia', name: 'Geleia diet', category: 'outros', per100: { cal: 32, protein: 0.5, carb: 8, fat: 0 }, defaultUnit: 'g', defaultQty: 20, emoji: '🫐', premium: true },
  { id: 'cafe', name: 'Café preto', category: 'outros', per100: { cal: 2, protein: 0.3, carb: 0, fat: 0 }, defaultUnit: 'ml', defaultQty: 200, emoji: '☕', premium: true },
  { id: 'achocolatado', name: 'Achocolatado (light)', category: 'outros', per100: { cal: 40, protein: 3, carb: 7, fat: 0.5 }, defaultUnit: 'ml', defaultQty: 200, emoji: '🍫', premium: true },
]

export const FREE_FOOD_IDS = ['ovo', 'frango', 'arroz', 'feijao', 'banana', 'aveia', 'batata-doce', 'whey', 'azeite', 'brocolis']

export const FOOD_CATEGORIES: { id: FoodCategory; label: string; emoji: string }[] = [
  { id: 'proteina', label: 'Proteínas', emoji: '🍗' },
  { id: 'carboidrato', label: 'Carboidratos', emoji: '🍚' },
  { id: 'fruta', label: 'Frutas', emoji: '🍌' },
  { id: 'vegetal', label: 'Vegetais', emoji: '🥦' },
  { id: 'laticinios', label: 'Laticínios', emoji: '🥛' },
  { id: 'gordura', label: 'Gorduras', emoji: '🥑' },
  { id: 'suplemento', label: 'Suplementos', emoji: '💊' },
  { id: 'outros', label: 'Outros', emoji: '🍴' },
]
