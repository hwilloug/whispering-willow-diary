"use client"

import { format } from "date-fns"
import { useJournalStore } from "~/store"

export function DailyAffirmation() {
  const affirmation = useJournalStore((store) => store.entries.find((e) => e.date === format(new Date(), "yyyy-MM-dd"))?.affirmation)

  return (
    <div className="bg-amber-900/80 w-1/2 text-center m-auto p-4 my-4 rounded-md border-black border">
      <div className="text-outline-bold-inverted text-3xl">
        🌸 Today's Affirmation 🌸
      </div>
      <div className="text-white my-2 font-ubuntu-bold text-lg">
        {affirmation}
      </div>
    </div>
  )
}
