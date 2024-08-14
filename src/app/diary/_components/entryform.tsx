"use client"

import { useState } from "react";
import DailyAffirmationEntry from "./dailyaffirmationentry";
import GoalsEntry from "./goalsentry";
import Entry from "./entry";
import MoodEntry from "./moodentry";
import SleepEntry from "./sleepentry";
import MentalHealthEntry from "./mentalhealthentry";
import FeelingsEntry from "./feelingsentry";
import SubstanceUseEntry from "./substanceuseentry";
import ExerciseEntry from "./exerciseentry";
import { isEqual, isFirstDayOfMonth, startOfWeek } from "date-fns";
import { EntryState, useJournalStore } from "~/store";

export default function EntryForm({date}: Readonly<{date: string}>) {
  const { setEntries } = useJournalStore()
  const entries = useJournalStore(state => state.entries)

  const entry = entries.find(e => e.date === date)
  
  const [timeOfDay, setTimeOfDay] = useState("Morning")

  const handleSave = async (saveObj: Partial<EntryState>) => {
    setEntries([...entries.filter(e => e.date !== date), {...entry!, ...saveObj}])
    await fetch("/diary/api/entries", {
      method: "PUT",
      body: JSON.stringify({date, content: {...saveObj}}),
      headers: {
        "Content-Type": "application/json"
      }
    })
  }

  const handleCreate = async () => {
    await fetch("/diary/api/entries", {
      method: "POST",
      body: JSON.stringify({date}),
      headers: {
        "Content-Type": "application/json"
      }
    })
  }

  if (!entry) {
    return (
      <div className="m-auto mt-12 w-fit">
        <button className="styled-button" onClick={handleCreate}>Create Entry</button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl m-auto">
      <div className="flex gap-6 justify-center m-4">
        <div className="flex gap-2">
          <input type="radio" id="morning" name="morning" checked={timeOfDay === "Morning"} onChange={() => setTimeOfDay("Morning")} />
          <label htmlFor="morning" className="text-outline-bold text-lg">Morning</label>
        </div>
        <div className="flex gap-2">
          <input type="radio" id="evening" checked={timeOfDay === "Evening"} onChange={() => setTimeOfDay("Evening")} />
          <label htmlFor="evening" className="text-outline-bold text-lg">Evening</label>
        </div>
      </div>
      {
        timeOfDay === "Morning" && (
          <>
            <SleepEntry />
            <MoodEntry date={date} onSave={handleSave} />
            <DailyAffirmationEntry />
            <GoalsEntry cadence="Daily" />
              {isEqual(startOfWeek(date), date) && <GoalsEntry cadence="Weekly" />}
              {isFirstDayOfMonth(date) && <GoalsEntry cadence="Monthly" />}
            <Entry />
          </>
        )
      }
      {
        timeOfDay === "Evening" && (
          <>
            <MentalHealthEntry />
            <FeelingsEntry />
            <SubstanceUseEntry />
            <ExerciseEntry />
            <Entry />
          </>
        )
      }
      
    </div>
  )
}