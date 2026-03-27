export type ActionType = 'draw' | 'explain' | 'act'
export type Difficulty = 'easy' | 'medium' | 'hard'
export type GameMode = '1v1' | 'teams'
export type Vibe = 'family' | 'party' | 'mixed'

export const CATEGORIES = [
  'animals',
  'food',
  'popculture',
  'sports',
  'tech',
  'travel',
  'professions',
  'emotions',
] as const

export type Category = (typeof CATEGORIES)[number]

export const CATEGORY_LABELS: Record<Category, string> = {
  animals: 'Animals & Nature',
  food: 'Food & Cooking',
  popculture: 'Pop Culture & Memes',
  sports: 'Sports & Action',
  tech: 'Tech & Internet',
  travel: 'Travel & Places',
  professions: 'Professions & People',
  emotions: 'Emotions & Abstract',
}

export interface Player {
  id: string
  name: string
}

export interface Team {
  id: string
  name: string
  color: string
  playerIds: string[]
  score: number
}

export interface WordCard {
  en: string
  es: string
  difficulty: Difficulty
  category: Category
  vibe: 'family' | 'party'
}

export interface TurnState {
  teamId: string
  activePlayerId: string
  action: ActionType
  card: WordCard
}

export interface GameSettings {
  difficulty: Difficulty
  targetScore: number
  timerDuration: number
  vibe: Vibe
  selectedCategories: Category[]
}

export const TEAM_COLORS = [
  '#067F73',
  '#EB9838',
  '#E04E6A',
  '#6C63FF',
  '#2ECC71',
  '#E67E22',
  '#9B59B6',
  '#1ABC9C',
]

export const ACTION_COLORS: Record<ActionType, string> = {
  draw: '#EB9838',
  explain: '#067F73',
  act: '#F7EF00',
}

export const ACTION_LABELS: Record<ActionType, string> = {
  draw: 'DRAW',
  explain: 'EXPLAIN',
  act: 'ACT',
}
