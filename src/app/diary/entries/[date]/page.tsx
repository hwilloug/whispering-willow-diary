"use client"

import { useParams, useRouter } from "next/navigation"
import ViewEntry from "./_components/viewentry"
import EntryNav from "./_components/entrynav"
import { addDays, format, parse, subDays } from "date-fns"


export default function ViewEntryPage() {
  const { date } = useParams()
  const router = useRouter()

  const dateObject = parse(date as string, "yyyy-MM-dd", new Date())

  const onBack = () => {
    const yesterday = format(subDays(dateObject, 1), "yyyy-MM-dd")
    router.push(`/diary/entries/${yesterday}`)
  }

  const onForward = () => {
    const tomorrow = format(addDays(dateObject, 1), "yyyy-MM-dd")
    router.push(`/diary/entries/${tomorrow}`)
  }

  return (
    <div>
      <div>
        <EntryNav onBack={onBack} onForward={onForward} />
      </div>
      <div>
        <ViewEntry />
      </div>
      <div>
        <EntryNav onBack={onBack} onForward={onForward} />
      </div>
    </div>
  )
}