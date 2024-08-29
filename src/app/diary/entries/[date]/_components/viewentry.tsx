"use client"

import MorningEntryContent from "./entrycontent"
import SleepContent from "../../[date]/_components/hourssleepcontent"
import MoodContent from "../../[date]/_components/moodcontent"
import AffirmationContent from "../../[date]/_components/affirmationcontent"
import MentalHealthContent from "../../[date]/_components/mentalhealthcontent"
import FeelingsContent from "../../[date]/_components/feelingscontent"
import ExerciseContent from "../../[date]/_components/exercisecontent"
import DailyQuestionContent from "../../[date]/_components/dailyquestioncontent"
import SubstanceUseContent from "../../[date]/_components/substanceusecontent"
import TrashIcon from "../../../_components/icons/trashicon"
import PencilIcon from "../../../_components/icons/pencilicon"
import Link from "next/link"
import { EntryState, useJournalStore } from "~/store"
import { differenceInMinutes, format, parse } from "date-fns"
import { useMemo } from "react"
import NoEntry from "../../_components/noentry"
import { useParams } from "next/navigation"
import { trpc } from "~/utils/trpc"
import EntryContent from "./entrycontent"


export default function ViewEntry() {
  const { date } = useParams()

  if (!date || typeof date !== "string") return <div>Invalid date</div>

  const { data: entry, isLoading } = trpc.entries.one.useQuery({ date })

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!entry) return <NoEntry />
  
  return (
    <div className="container-transparent">
      <div className="flex justify-end">
        <Link href={`/diary/entries/${date}/edit`}><PencilIcon className="mx-4" /></Link>
        <TrashIcon className="mx-4" />
      </div>
      <div className="text-outline-bold text-4xl text-center py-6">{format(parse(date! as string, "yyyy-MM-dd", new Date()), "eeee, LLLL d, yyyy")}</div>
      <div>
        <AffirmationContent />
        <div className="grid grid-cols-[1fr,2fr] m-4 gap-4">
          <MoodContent />
          <SleepContent />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <MentalHealthContent />
          <FeelingsContent />
        </div>
        <div className="grid grid-cols-[1fr,2fr] gap-4">
          <DailyQuestionContent />
          <ExerciseContent />
        </div>
        <div>
          <SubstanceUseContent />
        </div>
        <div>
          <EntryContent />
        </div>
      </div>
    </div>
  )
}