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
    <>
      <div className="md:grid grid-cols-2">
        <SleepEntry date={date} />
        <MoodEntry date={date} />
      </div>
      <div>
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
    </>
  )
}