"use client"

import { useJournalStore } from "~/store"

// @ts-ignore
export default function AppInitializer({ entries, children }) {
  useJournalStore.setState({ 
    entries,
  })

  return children
}