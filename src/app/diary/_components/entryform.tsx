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
import { trpc } from "~/utils/trpc";
import CreateEntryButton from "./createentrybutton";

export default function EntryForm({date}: Readonly<{date: string}>) {
  const { data: entry, isLoading } = trpc.entries.one.useQuery({ date })

  const [timeOfDay, setTimeOfDay] = useState("Morning")

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!entry && !isLoading) {
    return (
      <div className="m-auto mt-12 w-fit">
        <CreateEntryButton date={date} />
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
      <SleepEntry date={date} />
      <MoodEntry date={date} />
      <DailyAffirmationEntry date={date} />
      <GoalsEntry cadence="Daily" />
        {isEqual(startOfWeek(date), date) && <GoalsEntry cadence="Weekly" />}
        {isFirstDayOfMonth(date) && <GoalsEntry cadence="Monthly" />}
      <Entry date={date} />
      <MentalHealthEntry date={date} />
      <FeelingsEntry date={date} />
      <SubstanceUseEntry date={date} />
      <ExerciseEntry date={date} />
    </div>
  )
}