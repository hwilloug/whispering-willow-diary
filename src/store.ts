import { DateObject } from "react-multi-date-picker"
import { create } from "zustand"

export interface EntryState {
  id: number
  date: string
  mood?: number
  sleep?: SleepState[]
  affirmation?: string
  mentalHealth: string[]
  feelings: string[]
  substances: SubstancesState[]
  entryContent?: string
  morningEntryContent?: string
  dailyQuestionQ?: string
  dailyQuestionA?: string
  exercise?: number
}

export interface SubstancesState {
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
  entries: EntryState[],
  setEntries: (entry: EntryState[]) => void
}

export const useJournalStore = create<JournalState>((set) => ({
  entries: [],
  setEntries: (entries: EntryState[]) => set({ entries })
}))