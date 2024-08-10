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

function Stats() {
  return (
    <div>
      Test Stats
    </div>
  )
}

function MentalHealthTracker() {
  return (
    <div className="container-transparent">
      <div className="container-title">Mental Health Tracker</div>
    </div>
  )
}

function SleepTracker() {
  return (
    <div className="container-transparent">
      <div className="container-title">Sleep Tracker</div>
    </div>
  )
}

function SubstanceUseTracker() {
  return (
    <div className="container-transparent">
      <div className="container-title">Substance Use Tracker</div>
    </div>
  )
}

function Entries() {
  return (
    <div className="container-transparent">
      <div className="container-title">Entries</div>
    </div>
  )
}

function Goals() {
  return (
    <div className="container-transparent">
      <div className="container-title">Goals</div>
    </div>
  )
}

export default async function Dashboard() {
  return (
    <main>
      <TodaysDate />
      <DailyAffirmation />
      <MoodTracker />
      <div className="md:grid md:grid-cols-[1fr,1fr] lg:grid-cols[1fr,1fr,1fr,1fr">
        <Stats />
        <MentalHealthTracker />
        <SleepTracker />
        <SubstanceUseTracker />
        <Entries />
        <Goals />
      </div>
    </main>
  );
}
