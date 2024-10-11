"use client"

import SleepContent from "./viewentry/hourssleepcontent"
import MoodContent from "./viewentry/moodcontent"
import AffirmationContent from "./viewentry/affirmationcontent"
import MentalHealthContent from "./viewentry/mentalhealthcontent"
import FeelingsContent from "./viewentry/feelingscontent"
import ExerciseContent from "./viewentry/exercisecontent"
import DailyQuestionContent from "./viewentry/dailyquestioncontent"
import SubstanceUseContent from "./viewentry/substanceusecontent"
import TrashIcon from "../../../_components/icons/trashicon"
import PencilIcon from "../../../_components/icons/pencilicon"
import { format, parse } from "date-fns"
import { useMemo } from "react"
import NoEntry from "../../_components/noentry"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { trpc } from "~/utils/trpc"
import EntryContent from "./viewentry/entrycontent"
import CheckCircleIcon from "./icons/checkcircle"

export default function ViewEntry() {
  const { date } = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const utils = trpc.useUtils()

  const isEditMode = useMemo(() => {
    return searchParams.get("edit") === "true"
  }, [searchParams])

  if (!date || typeof date !== "string") throw new Error("Invalid date")

  const { data: entry, isLoading } = trpc.entries.one.useQuery({ date })

  const deleteMutation = trpc.entries.delete.useMutation({
    onSuccess: async () => {
      await utils.entries.invalidate()
    }
  })

  const onDelete = () => {
    if (entry?.id === undefined) return

    if (confirm("Are you sure you want to delete this entry?")) {
      deleteMutation.mutate({ id: entry.id })
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (entry === undefined || entry === null) return <NoEntry />

  return (
    <div className="container-transparent" key={entry.id}>
      <div className="flex justify-end">
        {isEditMode ? (
          <CheckCircleIcon
            className="mx-4 text-[--secondary] cursor-pointer"
            onClick={() => router.push(`/diary/entries/${date}`)}
          />
        ) : (
          <PencilIcon
            className="mx-4 cursor-pointer"
            onClick={() => router.push(`/diary/entries/${date}?edit=true`)}
          />
        )}
        <TrashIcon className="mx-4 cursor-pointer" onClick={onDelete} />
      </div>
      <div className="text-outline-bold text-4xl text-center py-6">
        {format(parse(date, "yyyy-MM-dd", new Date()), "eeee, LLLL d, yyyy")}
      </div>
      <div>
        <div className="grid grid-cols-[1fr,1fr] gap-4">
          <MoodContent isEditMode={isEditMode} />
          <SleepContent isEditMode={isEditMode} />
        </div>
        <div>
          <AffirmationContent isEditMode={isEditMode} />
        </div>
        <div className="grid grid-cols-[1fr,2fr] gap-4">
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
