'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Exercise, MuscleGroup } from '@/types/workout'

const PRESET_EXERCISES: Exercise[] = [
  // Chest
  { id: 'bench-press', name: 'Supino Reto (Barra)', muscleGroup: 'chest', equipment: 'barbell' },
  { id: 'incline-bench', name: 'Supino Inclinado (Barra)', muscleGroup: 'chest', equipment: 'barbell' },
  { id: 'db-fly', name: 'Crucifixo (Halteres)', muscleGroup: 'chest', equipment: 'dumbbell' },
  { id: 'db-bench', name: 'Supino (Halteres)', muscleGroup: 'chest', equipment: 'dumbbell' },
  { id: 'cable-fly', name: 'Crossover (Cabo)', muscleGroup: 'chest', equipment: 'cable' },
  { id: 'pushup', name: 'Flexão de Braço', muscleGroup: 'chest', equipment: 'bodyweight' },
  // Back
  { id: 'deadlift', name: 'Levantamento Terra', muscleGroup: 'back', equipment: 'barbell' },
  { id: 'barbell-row', name: 'Remada Curvada (Barra)', muscleGroup: 'back', equipment: 'barbell' },
  { id: 'pullup', name: 'Barra Fixa', muscleGroup: 'back', equipment: 'bodyweight' },
  { id: 'lat-pulldown', name: 'Puxada Frontal', muscleGroup: 'back', equipment: 'cable' },
  { id: 'cable-row', name: 'Remada Sentada (Cabo)', muscleGroup: 'back', equipment: 'cable' },
  { id: 'db-row', name: 'Remada Unilateral (Haltere)', muscleGroup: 'back', equipment: 'dumbbell' },
  // Shoulders
  { id: 'ohp', name: 'Desenvolvimento (Barra)', muscleGroup: 'shoulders', equipment: 'barbell' },
  { id: 'db-press', name: 'Desenvolvimento (Halteres)', muscleGroup: 'shoulders', equipment: 'dumbbell' },
  { id: 'lateral-raise', name: 'Elevação Lateral', muscleGroup: 'shoulders', equipment: 'dumbbell' },
  { id: 'face-pull', name: 'Face Pull', muscleGroup: 'shoulders', equipment: 'cable' },
  { id: 'front-raise', name: 'Elevação Frontal', muscleGroup: 'shoulders', equipment: 'dumbbell' },
  // Biceps
  { id: 'barbell-curl', name: 'Rosca Direta (Barra)', muscleGroup: 'biceps', equipment: 'barbell' },
  { id: 'db-curl', name: 'Rosca Alternada (Haltere)', muscleGroup: 'biceps', equipment: 'dumbbell' },
  { id: 'hammer-curl', name: 'Rosca Martelo', muscleGroup: 'biceps', equipment: 'dumbbell' },
  { id: 'cable-curl', name: 'Rosca no Cabo', muscleGroup: 'biceps', equipment: 'cable' },
  // Triceps
  { id: 'skull-crusher', name: 'Tríceps Testa (Barra)', muscleGroup: 'triceps', equipment: 'barbell' },
  { id: 'tricep-pushdown', name: 'Tríceps Corda', muscleGroup: 'triceps', equipment: 'cable' },
  { id: 'overhead-ext', name: 'Tríceps Francês', muscleGroup: 'triceps', equipment: 'dumbbell' },
  { id: 'close-grip', name: 'Supino Fechado', muscleGroup: 'triceps', equipment: 'barbell' },
  // Legs
  { id: 'squat', name: 'Agachamento Livre', muscleGroup: 'legs', equipment: 'barbell' },
  { id: 'leg-press', name: 'Leg Press', muscleGroup: 'legs', equipment: 'machine' },
  { id: 'rdl', name: 'Stiff (Halteres)', muscleGroup: 'legs', equipment: 'dumbbell' },
  { id: 'leg-curl', name: 'Flexão de Joelhos', muscleGroup: 'legs', equipment: 'machine' },
  { id: 'leg-ext', name: 'Extensão de Joelhos', muscleGroup: 'legs', equipment: 'machine' },
  { id: 'calf-raise', name: 'Panturrilha em Pé', muscleGroup: 'legs', equipment: 'machine' },
  { id: 'hack-squat', name: 'Hack Squat', muscleGroup: 'legs', equipment: 'machine' },
  // Glutes
  { id: 'hip-thrust', name: 'Hip Thrust', muscleGroup: 'glutes', equipment: 'barbell' },
  { id: 'glute-bridge', name: 'Glute Bridge', muscleGroup: 'glutes', equipment: 'bodyweight' },
  // Core
  { id: 'plank', name: 'Prancha', muscleGroup: 'core', equipment: 'bodyweight' },
  { id: 'cable-crunch', name: 'Crunch no Cabo', muscleGroup: 'core', equipment: 'cable' },
  { id: 'hanging-leg-raise', name: 'Elevação de Pernas Suspenso', muscleGroup: 'core', equipment: 'bodyweight' },
  { id: 'ab-wheel', name: 'Roda Abdominal', muscleGroup: 'core', equipment: 'other' },
  // Surf/Functional Core
  { id: 'landmine-rot', name: 'Landmine Rotation', muscleGroup: 'core', equipment: 'barbell' },
  { id: 'medball-throw', name: 'Med Ball Rotational Throw', muscleGroup: 'core', equipment: 'other' },
  { id: 'woodchop', name: 'Cable Woodchop', muscleGroup: 'core', equipment: 'cable' },
  { id: 'copenhagen', name: 'Copenhagen Plank', muscleGroup: 'core', equipment: 'bodyweight' },
  { id: 'hollow-body', name: 'Hollow Body Rock', muscleGroup: 'core', equipment: 'bodyweight' },
  { id: 'dead-bug', name: 'Dead Bug', muscleGroup: 'core', equipment: 'bodyweight' },
  { id: 'bird-dog', name: 'Bird Dog', muscleGroup: 'core', equipment: 'bodyweight' },
  { id: 'pallof-press', name: 'Pallof Press', muscleGroup: 'core', equipment: 'cable' },
  { id: 'dragon-flag', name: 'Dragon Flag', muscleGroup: 'core', equipment: 'bodyweight' },
  { id: 'l-sit', name: 'L-Sit', muscleGroup: 'core', equipment: 'bodyweight' },
  { id: 'toes-to-bar', name: 'Toes to Bar', muscleGroup: 'core', equipment: 'bodyweight' },
  { id: 'side-plank', name: 'Prancha Lateral', muscleGroup: 'core', equipment: 'bodyweight' },
  // More chest
  { id: 'dips', name: 'Paralelas (Tríceps / Peito)', muscleGroup: 'chest', equipment: 'bodyweight' },
  { id: 'decline-pushup', name: 'Flexão Declinada', muscleGroup: 'chest', equipment: 'bodyweight' },
  { id: 'archer-pushup', name: 'Flexão Arqueiro', muscleGroup: 'chest', equipment: 'bodyweight' },
  { id: 'chest-press-machine', name: 'Supino Máquina', muscleGroup: 'chest', equipment: 'machine' },
  // More back
  { id: 'seal-row', name: 'Seal Row', muscleGroup: 'back', equipment: 'barbell' },
  { id: 'tbar-row', name: 'Remada T-bar', muscleGroup: 'back', equipment: 'barbell' },
  { id: 'chest-supported-row', name: 'Remada Apoiada no Banco', muscleGroup: 'back', equipment: 'dumbbell' },
  { id: 'inverted-row', name: 'Remada Invertida', muscleGroup: 'back', equipment: 'bodyweight' },
  // More legs
  { id: 'bulgarian-split', name: 'Agachamento Búlgaro', muscleGroup: 'legs', equipment: 'dumbbell' },
  { id: 'walking-lunge', name: 'Avanço Caminhando', muscleGroup: 'legs', equipment: 'dumbbell' },
  { id: 'sumo-squat', name: 'Agachamento Sumô', muscleGroup: 'legs', equipment: 'barbell' },
  { id: 'goblet-squat', name: 'Goblet Squat (Kettlebell)', muscleGroup: 'legs', equipment: 'kettlebell' },
  { id: 'box-jump', name: 'Box Jump', muscleGroup: 'legs', equipment: 'other' },
  { id: 'single-leg-rdl', name: 'Stiff Unilateral', muscleGroup: 'legs', equipment: 'dumbbell' },
  { id: 'step-up', name: 'Step Up', muscleGroup: 'legs', equipment: 'dumbbell' },
  // More shoulders
  { id: 'arnold-press', name: 'Arnold Press', muscleGroup: 'shoulders', equipment: 'dumbbell' },
  { id: 'cable-lateral', name: 'Elevação Lateral (Cabo)', muscleGroup: 'shoulders', equipment: 'cable' },
  { id: 'ytwl', name: 'Y-T-W-L (Rotador)', muscleGroup: 'shoulders', equipment: 'dumbbell' },
  { id: 'wall-slides', name: 'Wall Slides', muscleGroup: 'shoulders', equipment: 'bodyweight' },
  // Full body / Functional surf
  { id: 'clean-press', name: 'Clean & Press', muscleGroup: 'full_body', equipment: 'barbell' },
  { id: 'thrusters', name: 'Thrusters', muscleGroup: 'full_body', equipment: 'barbell' },
  { id: 'kb-swing', name: 'Kettlebell Swing', muscleGroup: 'full_body', equipment: 'kettlebell' },
  { id: 'turkish-getup', name: 'Turkish Get-Up', muscleGroup: 'full_body', equipment: 'kettlebell' },
  { id: 'burpee', name: 'Burpee', muscleGroup: 'full_body', equipment: 'bodyweight' },
  { id: 'surf-burpee', name: 'Surf Burpee (Pop-up Treino)', muscleGroup: 'full_body', equipment: 'bodyweight' },
  { id: 'battle-ropes', name: 'Battle Ropes', muscleGroup: 'full_body', equipment: 'other' },
  { id: 'sled-push', name: 'Empurrar Trenó', muscleGroup: 'full_body', equipment: 'other' },
  { id: 'single-leg-balance', name: 'Equilíbrio Unipodal', muscleGroup: 'full_body', equipment: 'bodyweight' },
  { id: 'bear-crawl', name: 'Bear Crawl', muscleGroup: 'full_body', equipment: 'bodyweight' },
  { id: 'crab-walk', name: 'Crab Walk', muscleGroup: 'full_body', equipment: 'bodyweight' },
  // ── PLANILHA SURF PERFORMANCE 90 DIAS ────────────────────────────────────
  // Lower Power
  { id: 'trap-bar-deadlift', name: 'Trap Bar Deadlift', muscleGroup: 'legs', equipment: 'barbell', instructions: 'Levantamento terra com barra hexagonal. Posição mais vertical do tronco que o deadlift convencional, maior ativação de quadríceps.' },
  { id: 'lateral-bounds', name: 'Lateral Bounds (Saltos Laterais)', muscleGroup: 'legs', equipment: 'bodyweight', instructions: 'Salte lateralmente de uma perna para a outra, absorvendo o impacto com controle. 8 reps cada lado.' },
  { id: 'explosive-calf', name: 'Panturrilha Explosiva', muscleGroup: 'legs', equipment: 'bodyweight', instructions: '15 reps. Suba na ponta do pé de forma explosiva e desça devagar. Desenvolve potência para manobras.' },
  // Upper Surf
  { id: 'remada-baixa', name: 'Remada Baixa (Barra/Cabo)', muscleGroup: 'back', equipment: 'cable', instructions: 'Puxada horizontal com pegada supinada ou neutra, cotovelos próximos ao corpo. Imita o padrão de remada no surf.' },
  { id: 'landmine-press', name: 'Landmine Press', muscleGroup: 'shoulders', equipment: 'barbell', instructions: 'Encaixe uma extremidade da barra no canto. Empurre em arco com um ou dois braços. Ativa ombro, core e rotação torácica.' },
  { id: 'medball-slam', name: 'Medicine Ball Slam', muscleGroup: 'full_body', equipment: 'other', instructions: '8 reps. Levante a bola acima da cabeça e arremesse no chão com força máxima. Potência explosiva total.' },
  // Manobra Day
  { id: 'front-squat', name: 'Front Squat (Agachamento Frontal)', muscleGroup: 'legs', equipment: 'barbell', instructions: 'Barra apoiada na frente, na altura dos ombros. Exige mais mobilidade de tornozelo e torácica. Crucial para posição no surf.' },
  { id: 'rotational-lunge', name: 'Lunge Rotacional', muscleGroup: 'legs', equipment: 'bodyweight', instructions: '10 reps. Avance e gire o tronco para o mesmo lado da perna avançada. Simula o movimento de manobra no surf.' },
  { id: 'explosive-popup', name: 'Pop-up Explosivo', muscleGroup: 'full_body', equipment: 'bodyweight', instructions: '5 séries de 5. Pop-up com máxima velocidade, focando no tempo do chão ao pé. Cronometre para acompanhar evolução.' },
  { id: 'sprint-20m', name: 'Sprint 20m', muscleGroup: 'cardio', equipment: 'bodyweight', instructions: '6 tiros de 20m. Saída explosiva, máxima velocidade. 60s de descanso entre tiros. Potência e capacidade anaeróbia.' },
  // Push Press e Jump Squat (citados nas Fases 2 e 3)
  { id: 'push-press', name: 'Push Press', muscleGroup: 'shoulders', equipment: 'barbell', instructions: 'Extensão de joelhos + press explosivo acima da cabeça. Une força de quadril com força de ombro.' },
  { id: 'jump-squat', name: 'Jump Squat', muscleGroup: 'legs', equipment: 'bodyweight', instructions: 'Agachamento com salto máximo. 4x5. Foco em aterrissar suave e imediata re-aceleração.' },
  // ── MOBILIDADE & FLEXIBILIDADE SURF ──────────────────────────────────────
  // Mobilidade torácica / coluna
  { id: 'thoracic-rotation', name: 'Rotação Torácica em Pé', muscleGroup: 'mobility', equipment: 'bodyweight' },
  { id: 'thoracic-ext', name: 'Extensão Torácica (Foam Roller)', muscleGroup: 'mobility', equipment: 'other' },
  { id: 'cat-cow', name: 'Gato-Vaca (Cat-Cow)', muscleGroup: 'mobility', equipment: 'bodyweight' },
  { id: 'child-pose', name: 'Postura da Criança (Child\'s Pose)', muscleGroup: 'mobility', equipment: 'bodyweight' },
  { id: 'cobra', name: 'Cobra (Sphinx)', muscleGroup: 'mobility', equipment: 'bodyweight' },
  { id: 'down-dog', name: 'Cachorro Olhando para Baixo', muscleGroup: 'mobility', equipment: 'bodyweight' },
  { id: 'supine-twist', name: 'Torção Supina (Spinal Twist)', muscleGroup: 'mobility', equipment: 'bodyweight' },
  // Mobilidade de quadril — crucial para surf
  { id: 'hip-9090', name: 'Hip 90/90', muscleGroup: 'mobility', equipment: 'bodyweight' },
  { id: 'worlds-greatest', name: 'World\'s Greatest Stretch', muscleGroup: 'mobility', equipment: 'bodyweight' },
  { id: 'pigeon-pose', name: 'Pombo (Pigeon Pose)', muscleGroup: 'mobility', equipment: 'bodyweight' },
  { id: 'hip-circles', name: 'Círculos de Quadril em Pé', muscleGroup: 'mobility', equipment: 'bodyweight' },
  { id: 'hip-flexor-mob', name: 'Mobilização do Flexor do Quadril', muscleGroup: 'mobility', equipment: 'bodyweight' },
  { id: 'butterfly', name: 'Butterfly Stretch', muscleGroup: 'mobility', equipment: 'bodyweight' },
  { id: 'deep-squat-hold', name: 'Agachamento Profundo (Segurado)', muscleGroup: 'mobility', equipment: 'bodyweight' },
  { id: 'cossack-squat', name: 'Agachamento Cossaco', muscleGroup: 'mobility', equipment: 'bodyweight' },
  { id: 'duck-walk', name: 'Duck Walk', muscleGroup: 'mobility', equipment: 'bodyweight' },
  // Mobilidade de ombro — essencial para remar
  { id: 'shoulder-passthrough', name: 'Shoulder Pass-Through (Elástico)', muscleGroup: 'mobility', equipment: 'resistance_band' },
  { id: 'dislocates', name: 'Dislocates (Bastão)', muscleGroup: 'mobility', equipment: 'other' },
  { id: 'arm-circles', name: 'Círculos de Braço', muscleGroup: 'mobility', equipment: 'bodyweight' },
  { id: 'pec-stretch-doorway', name: 'Alongamento Peitoral na Porta', muscleGroup: 'mobility', equipment: 'bodyweight' },
  { id: 'lat-stretch', name: 'Alongamento de Latíssimo', muscleGroup: 'mobility', equipment: 'bodyweight' },
  { id: 'cross-body-shoulder', name: 'Ombro Cross-Body', muscleGroup: 'mobility', equipment: 'bodyweight' },
  // Mobilidade tornozelo / panturrilha — crucial para remada e posição no surf
  { id: 'ankle-circles', name: 'Círculos de Tornozelo', muscleGroup: 'mobility', equipment: 'bodyweight' },
  { id: 'calf-stretch-wall', name: 'Alongamento de Panturrilha na Parede', muscleGroup: 'mobility', equipment: 'bodyweight' },
  { id: 'ankle-mob', name: 'Mobilização de Tornozelo (Knee-to-Wall)', muscleGroup: 'mobility', equipment: 'bodyweight' },
  // Flexibilidade isquiotibiais / posterior
  { id: 'hamstring-stretch', name: 'Alongamento Isquiotibiais (em pé)', muscleGroup: 'mobility', equipment: 'bodyweight' },
  { id: 'seated-forward-fold', name: 'Flexão para Frente Sentado', muscleGroup: 'mobility', equipment: 'bodyweight' },
  { id: 'supta-padangusthasana', name: 'Alongamento Isquiotibiais Deitado', muscleGroup: 'mobility', equipment: 'bodyweight' },
  // Quadríceps / flexores do quadril
  { id: 'quad-stretch', name: 'Alongamento de Quadríceps em Pé', muscleGroup: 'mobility', equipment: 'bodyweight' },
  { id: 'lizard-pose', name: 'Lagarto (Lizard Pose) — Flexor Quadril', muscleGroup: 'mobility', equipment: 'bodyweight' },
  { id: 'couch-stretch', name: 'Couch Stretch (Flexor Quadril)', muscleGroup: 'mobility', equipment: 'bodyweight' },
  // Surf-específicos
  { id: 'open-book', name: 'Open Book (Rotação Torácica Deitado)', muscleGroup: 'mobility', equipment: 'bodyweight', instructions: 'Deitado de lado, braço estendido. Abra o peito girando o braço de cima para o lado oposto. 1 min cada lado. Mobilidade diária.' },
  { id: 'popup-drill', name: 'Treino de Pop-Up (10 reps)', muscleGroup: 'mobility', equipment: 'bodyweight' },
  { id: 'scorpion-stretch', name: 'Scorpion Stretch', muscleGroup: 'mobility', equipment: 'bodyweight' },
  { id: 'neck-rolls', name: 'Mobilização de Pescoço', muscleGroup: 'mobility', equipment: 'bodyweight' },
  { id: 'thoracic-triangle', name: 'Triângulo com Rotação Torácica', muscleGroup: 'mobility', equipment: 'bodyweight' },
  { id: 'foam-roll-thoracic', name: 'Foam Roll — Coluna Torácica', muscleGroup: 'mobility', equipment: 'other' },
  { id: 'foam-roll-hip', name: 'Foam Roll — TFL / Quadril', muscleGroup: 'mobility', equipment: 'other' },
  { id: 'foam-roll-lats', name: 'Foam Roll — Latíssimos', muscleGroup: 'mobility', equipment: 'other' },
]

interface ExerciseStore {
  exercises: Exercise[]
  search: string
  filterMuscle: MuscleGroup | 'all'
  setSearch: (q: string) => void
  setFilter: (m: MuscleGroup | 'all') => void
  addCustomExercise: (ex: Exercise) => void
  getFiltered: () => Exercise[]
}

export const useExerciseStore = create<ExerciseStore>()(
  persist(
    (set, get) => ({
      exercises: PRESET_EXERCISES,
      search: '',
      filterMuscle: 'all',
      setSearch: (q) => set({ search: q }),
      setFilter: (m) => set({ filterMuscle: m }),
      addCustomExercise: (ex) =>
        set((s) => ({ exercises: [...s.exercises, ex] })),
      getFiltered: () => {
        const { exercises, search, filterMuscle } = get()
        return exercises.filter((ex) => {
          const matchSearch = ex.name.toLowerCase().includes(search.toLowerCase())
          const matchMuscle = filterMuscle === 'all' || ex.muscleGroup === filterMuscle
          return matchSearch && matchMuscle
        })
      },
    }),
    { name: 'waveform-exercises', skipHydration: true }
  )
)
