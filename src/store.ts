import { create } from "zustand"

export interface EntryState {
  date: string
  mood?: number
  hoursSleep?: string
  bedTime?: string
  wakeUpTime?: string
  sleepQuality?: string
  affirmation?: string
  mentalHealth: string[]
  feelings: string[]
  substances: string[]
  entryContent?: string
  morningEntryContent?: string
  dailyQuestionQ?: string
  dailyQuestionA?: string
  exercise?: number
}

interface JournalState {
  entries: EntryState[],
  setEntries: (entry: EntryState[]) => void
}

export const useJournalStore = create<JournalState>((set) => ({
  entries: [],
  setEntries: (entries: EntryState[]) => set({ entries })
}))