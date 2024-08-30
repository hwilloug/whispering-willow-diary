import { type EntryState } from "~/store"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function entryDTOToContent(entry: Record<string, any>): EntryState {
  return {
    id: entry.id,
    date: entry.date,
    sleep: entry.sleep,
    affirmation: entry.affirmation,
    mentalHealth: entry.mentalHealth,
    feelings: entry.feelings,
    substances: entry.substances,
    content: entry.content,
    mood: entry.mood,
    exercise: entry.exercise,
    question: entry.question
  }
}
