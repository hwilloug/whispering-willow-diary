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
import { format, isEqual, isFirstDayOfMonth, startOfWeek } from "date-fns";

export default function EntryForm({date}: Readonly<{date: string}>) {
  const [timeOfDay, setTimeOfDay] = useState("Morning")

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
            <MoodEntry />
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