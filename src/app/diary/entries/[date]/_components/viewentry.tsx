"use client"

import MorningEntryContent from "../../[date]/_components/morningentrycontent"
import SleepContent from "../../[date]/_components/hourssleepcontent"
import MoodContent from "../../[date]/_components/moodcontent"
import AffirmationContent from "../../[date]/_components/affirmationcontent"
import MentalHealthContent from "../../[date]/_components/mentalhealthcontent"
import FeelingsContent from "../../[date]/_components/feelingscontent"
import ExerciseContent from "../../[date]/_components/exercisecontent"
import DailyQuestionContent from "../../[date]/_components/dailyquestioncontent"
import SubstanceUseContent from "../../[date]/_components/substanceusecontent"
import EveningEntryContent from "../../[date]/_components/eveningentrycontent"
import TrashIcon from "../../../_components/icons/trashicon"
import PencilIcon from "../../../_components/icons/pencilicon"
import Link from "next/link"
import { EntryState, useJournalStore } from "~/store"
import { differenceInMinutes, format, parse } from "date-fns"
import { useMemo } from "react"
import NoEntry from "../../_components/noentry"
import { useParams } from "next/navigation"


export default function ViewEntry() {
  const { date } = useParams()
  
  const entry = useJournalStore(state => state.entries).find(entry => entry.date === date)

  const hoursSleep = useMemo(() => {
    function getHoursSleep(bedTime: string, wakeUpTime: string) {
      const bedTimeDate = parse(bedTime, "HH:mm", new Date())
      const wakeUpTimeDate = parse(wakeUpTime, "HH:mm", new Date())
      const diffMin = differenceInMinutes(wakeUpTimeDate, bedTimeDate)
      let diff = diffMin / 60
      if (diff < 0) {
        diff += 24
      }
      return diff
    }

    if (!entry?.sleep) return 0
    return entry.sleep.reduce((acc, sleep) => acc + (sleep.bedTime && sleep.wakeUpTime ? getHoursSleep(sleep.bedTime, sleep.wakeUpTime) : 0), 0).toFixed(2)
  }, [entry?.sleep])

  if (!entry) return <NoEntry />
  
  return (
    <div className="container-transparent">
      <div className="flex justify-end">
        <Link href={`/diary/entries/${date}/edit`}><PencilIcon className="mx-4" /></Link>
        <TrashIcon className="mx-4" />
      </div>
      <div className="text-outline-bold text-4xl text-center py-6">{format(parse(date! as string, "yyyy-MM-dd", new Date()), "eeee, LLLL d, yyyy")}</div>
      <div>
        { entry.affirmation && 
          <AffirmationContent content={entry.affirmation} />
        }
        <div className="grid grid-cols-[1fr,2fr] m-4 gap-4">
          {entry.mood && 
            <MoodContent mood={entry.mood} />
          }
          { entry.sleep &&
            <SleepContent content={hoursSleep} />
          }
        </div>
        <div className="m-4">
          {entry.morningEntryContent && 
            <MorningEntryContent content={entry.morningEntryContent} />
          }
        </div>
        <hr className="border-[--secondary]" />
        <div className="grid grid-cols-2 gap-4">
          { entry.mentalHealth.length > 0 &&
            <MentalHealthContent mentalHealth={entry.mentalHealth} />
          }
          { entry.feelings.length > 0 &&
            <FeelingsContent feelings={entry.feelings} />
          }
        </div>
        <div className="grid grid-cols-[1fr,2fr] gap-4">
          { entry.dailyQuestionA && 
            <DailyQuestionContent question={entry.dailyQuestionQ!} answer={entry.dailyQuestionA} />
          }
          { entry.exercise &&
            <ExerciseContent content={entry.exercise || 0} />
          }
        </div>
        <div>
          { entry.substances?.length > 0 &&
            <SubstanceUseContent substances={entry.substances} />
          }
        </div>
        <div>
          { entry.entryContent &&
            <EveningEntryContent content={entry.entryContent} />
          }
        </div>
      </div>
    </div>
  )
}