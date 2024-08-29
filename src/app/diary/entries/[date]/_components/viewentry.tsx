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
import { useMemo, useState } from "react"
import NoEntry from "../../_components/noentry"
import { useParams } from "next/navigation"
import { trpc } from "~/utils/trpc"
import EntryContent from "./entrycontent"
import CheckCircleIcon from "./icons/checkcircle"


export default function ViewEntry() {
  const { date } = useParams()

  const [ isEditMode, setIsEditMode ] = useState(false)

  if (!date || typeof date !== "string") return <div>Invalid date</div>

  const { data: entry, isLoading } = trpc.entries.one.useQuery({ date })

  const toggleMode = () => {
    setIsEditMode((prev) => !prev)
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!entry) return <NoEntry />
  
  return (
    <div className="container-transparent">
      <div className="flex justify-end">
        { isEditMode ? <CheckCircleIcon className="mx-4 text-[--secondary] cursor-pointer" onClick={toggleMode} /> :
          <PencilIcon className="mx-4 cursor-pointer" onClick={toggleMode} />
        }
        <TrashIcon className="mx-4 cursor-pointer" />
      </div>
      <div className="text-outline-bold text-4xl text-center py-6">{format(parse(date! as string, "yyyy-MM-dd", new Date()), "eeee, LLLL d, yyyy")}</div>
      <div>
        <div className="grid grid-cols-[1fr,2fr] gap-4">
          <MoodContent isEditMode={isEditMode} />
          <SleepContent isEditMode={isEditMode} />
        </div>
        <div>
          <AffirmationContent isEditMode={isEditMode} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <MentalHealthContent isEditMode={isEditMode} />
          <FeelingsContent isEditMode={isEditMode} />
        </div>
        <div>
          <SubstanceUseContent isEditMode={isEditMode} />
        </div>
        <div className="grid grid-cols-[2fr,1fr] gap-4">
          <DailyQuestionContent isEditMode={isEditMode} />
          <ExerciseContent isEditMode={isEditMode} />
        </div>
        <div>
          <EntryContent isEditMode={isEditMode} />
        </div>
      </div>
    </div>
  )
}