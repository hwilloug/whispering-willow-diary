"use client"

import { differenceInMinutes, format, parse } from "date-fns"
import { useParams } from "next/navigation"
import { useJournalStore } from "~/store"
import { DailyAffirmation } from "../../dashboard/_components/dailyaffirmation"
import { useMemo } from "react"
import MorningEntryContent from "./_components/morningentrycontent"
import SleepContent from "./_components/hourssleepcontent"
import MoodContent from "./_components/moodcontent"
import AffirmationContent from "./_components/affirmationcontent"
import MentalHealthContent from "./_components/mentalhealthcontent"
import FeelingsContent from "./_components/feelingscontent"
import ExerciseContent from "./_components/exercisecontent"
import DailyQuestionContent from "./_components/dailyquestioncontent"
import SubstanceUseContent from "./_components/substanceusecontent"
import EveningEntryContent from "./_components/eveningentrycontent"

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

  if (!entry) return <div className="container-transparent text-4xl text-center">No entry for this date</div>

  return (
    <div className="container-transparent">
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
          { entry.exercise &&
            <ExerciseContent content={entry.exercise || 0} />
          }
          { entry.dailyQuestionA && 
            <DailyQuestionContent question={entry.dailyQuestionQ!} answer={entry.dailyQuestionA} />
          }
        </div>
        <div>
          { entry.substances.length > 0 &&
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