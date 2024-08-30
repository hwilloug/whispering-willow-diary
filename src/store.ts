import { create } from "zustand"

export interface EntryState {
  id: number
  date: string
  mood?: MoodState
  sleep?: SleepState[]
  affirmation?: AffirmationState
  mentalHealth: MentalHealthState[]
  feelings: FeelingsState[]
  substances: SubstancesState[]
  content?: ContentState[]
  question?: QuestionState
  exercise?: ExerciseState
}

export interface MoodState {
  mood: number
  id?: number
}

export interface ExerciseState {
  id?: number
  minutesExercise: number
}

export interface AffirmationState {
  id?: number
  affirmation: string
}

export interface MentalHealthState {
  id?: number
  mentalHealth: string
}

export interface FeelingsState {
  id?: number
  feelings: string
}

export interface ContentState {
  id?: number
  content: string
}

export interface QuestionState {
  id?: number
  question: string
  answer: string
}

export interface SubstancesState {
  id?: number
  substance: string
  value: number
}

export interface SleepState {
  id?: number
  hoursSleep?: number
  bedTime?: string
  wakeUpTime?: string
  sleepQuality?: string
}

interface JournalState {
  entries: Record<string, EntryState>
  setEntries: (entry: Record<string, EntryState>) => void
}

export const useJournalStore = create<JournalState>((set) => ({
  entries: {},
  setEntries: (entries: Record<string, EntryState>) => set({ entries })
}))
