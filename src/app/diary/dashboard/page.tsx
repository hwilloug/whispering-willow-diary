"use server"

import { format } from "date-fns";
import { getMyEntries } from "~/server/queries";
import { DailyAffirmation } from "./_components/dailyaffirmation";
import { MoodTracker } from "./_components/moodtracker";
import { DiaryStats } from "./_components/diarystats";
import { MentalHealthTracker } from "./_components/mentalhealthtracker";
import { SleepTracker } from "./_components/sleeptracker";
import { SubstanceUseTracker } from "./_components/substancetracker";
import { Entries } from "./_components/entries";
import { Goals } from "./_components/goals";

function TodaysDate() {
  return (
    <div className="text-5xl text-center text-outline-bold my-4">
      { format(new Date(), "EEEE, LLLL do, yyyy") }
    </div>
  )
}

export default async function Dashboard() {

  const entries = await getMyEntries()
  
  return (
    <main>
      <TodaysDate />
      <DailyAffirmation />
      <MoodTracker />
      <div className="md:grid md:grid-cols-[1fr,1fr]">
        <DiaryStats />
        <MentalHealthTracker />
        <SleepTracker />
        <SubstanceUseTracker />
        <Entries />
        <Goals />
      </div>
    </main>
  );
}
