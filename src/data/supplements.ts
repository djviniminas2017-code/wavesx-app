export interface SuppDef {
  id: string
  name: string
  benefit: string
  suggestedDose: string
  timing: string
  emoji: string
  premium: boolean
}

export const SUPPLEMENTS: SuppDef[] = [
  // FREE (5)
  { id: 'creatina', name: 'Creatina Monohidratada', benefit: 'Força e potência muscular', suggestedDose: '5g', timing: 'Pós-treino', emoji: '💪', premium: false },
  { id: 'vitd3', name: 'Vitamina D3', benefit: 'Imunidade e saúde óssea', suggestedDose: '2000 UI', timing: 'Manhã', emoji: '☀️', premium: false },
  { id: 'omega3', name: 'Ômega 3', benefit: 'Anti-inflamatório e saúde cardiovascular', suggestedDose: '1g', timing: 'Jantar', emoji: '🐟', premium: false },
  { id: 'vitc', name: 'Vitamina C', benefit: 'Antioxidante e imunidade', suggestedDose: '1000mg', timing: 'Manhã', emoji: '🍊', premium: false },
  { id: 'whey-s', name: 'Whey Protein', benefit: 'Recuperação e síntese muscular', suggestedDose: '30g', timing: 'Pós-treino', emoji: '🥛', premium: false },

  // PREMIUM
  { id: 'bcaa', name: 'BCAA', benefit: 'Redução de catabolismo durante treino', suggestedDose: '5g', timing: 'Durante treino', emoji: '⚡', premium: true },
  { id: 'glutamina', name: 'Glutamina', benefit: 'Recuperação intestinal e muscular', suggestedDose: '5g', timing: 'Pós-treino', emoji: '🔬', premium: true },
  { id: 'cafeina', name: 'Cafeína', benefit: 'Foco, energia e queima de gordura', suggestedDose: '200mg', timing: 'Pré-treino', emoji: '☕', premium: true },
  { id: 'zma', name: 'ZMA (Zinco + Magnésio + B6)', benefit: 'Testosterona e qualidade do sono', suggestedDose: '1 dose', timing: 'Antes de dormir', emoji: '😴', premium: true },
  { id: 'beta-alanina', name: 'Beta-Alanina', benefit: 'Resistência e atraso da fadiga', suggestedDose: '3.2g', timing: 'Pré-treino', emoji: '🏃', premium: true },
  { id: 'pre-treino', name: 'Pré-treino (Câimbra)', benefit: 'Energia, foco e pump muscular', suggestedDose: '1 dose', timing: '30min antes do treino', emoji: '⚡', premium: true },
  { id: 'magnesio', name: 'Magnésio Quelato', benefit: 'Relaxamento muscular e sono', suggestedDose: '400mg', timing: 'À noite', emoji: '🌙', premium: true },
  { id: 'melatonina', name: 'Melatonina', benefit: 'Regulação do sono e recuperação', suggestedDose: '1-3mg', timing: '30min antes de dormir', emoji: '💤', premium: true },
  { id: 'colageno', name: 'Colágeno Hidrolisado', benefit: 'Saúde das articulações e pele', suggestedDose: '10g', timing: 'Em jejum', emoji: '🦴', premium: true },
  { id: 'vitb12', name: 'Vitamina B12', benefit: 'Energia e saúde neurológica', suggestedDose: '1000mcg', timing: 'Manhã', emoji: '🔋', premium: true },
  { id: 'zinco', name: 'Zinco', benefit: 'Testosterona, imunidade e cicatrização', suggestedDose: '25mg', timing: 'Manhã', emoji: '🛡️', premium: true },
  { id: 'ferro', name: 'Ferro', benefit: 'Energia, transporte de oxigênio', suggestedDose: '18mg', timing: 'Em jejum', emoji: '🩸', premium: true },
  { id: 'probiotico', name: 'Probiótico', benefit: 'Saúde intestinal e imunidade', suggestedDose: '10 bilhões UFC', timing: 'Manhã em jejum', emoji: '🦠', premium: true },
  { id: 'caseina-s', name: 'Caseína', benefit: 'Síntese proteica noturna', suggestedDose: '35g', timing: 'Antes de dormir', emoji: '🌙', premium: true },
  { id: 'eletrolitico', name: 'Eletrólitos (Surf)', benefit: 'Hidratação e performance aquática', suggestedDose: '1 sachê', timing: 'Durante/pós surfe', emoji: '🏄', premium: true },
]

export const FREE_SUPP_IDS = ['creatina', 'vitd3', 'omega3', 'vitc', 'whey-s']
