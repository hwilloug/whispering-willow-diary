"use client"

import { format } from "date-fns"
import { trpc } from "~/utils/trpc"

export function DailyAffirmation() {
  const { data: affirmation, isLoading } = trpc.affirmation.one.useQuery({
    date: format(new Date(), "yyyy-MM-dd")
  })

  if (!affirmation) return null

  return (
    <div className="bg-amber-900/80 w-1/2 text-center m-auto p-4 my-4 rounded-md border-black border">
      <div className="text-outline-bold-inverted text-3xl">
        🌸 Today&apos;s Affirmation 🌸
      </div>
      <div className="text-white my-2 font-ubuntu-bold text-lg">
        {affirmation.affirmation}
      </div>
    </div>
  )
}
