"use client"

import { format } from "date-fns";
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';

function TodaysDate() {
  return (
    <div className="text-5xl text-center text-outline-bold my-4">
      { format(new Date(), "EEEE, LLLL do, yyyy") }
    </div>
  )
}

function DailyAffirmation() {
  return (
    <div className="bg-amber-900/80 w-1/2 text-center m-auto p-4 my-4 rounded-md">
      <div className="text-outline-bold-inverted text-3xl">
        🌸 Today's Affirmation 🌸
      </div>
      <div className="text-white my-2 font-ubuntu-bold text-lg">
        Dummy affirmation.
      </div>
    </div>
  )
}

function MoodTracker() {
  return (
    <div className="container-transparent">
      <div className="container-title">Mood Tracker</div>
      <div>
        <HighchartsReact highcharts={Highcharts} options={{}} 
        />
      </div>
    </div>
  )
}

export default async function Home() {
  return (
    <main className="grid">
      <TodaysDate />
      <DailyAffirmation />
      <MoodTracker />
    </main>
  );
}
