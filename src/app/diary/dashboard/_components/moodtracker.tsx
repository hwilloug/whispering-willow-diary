"use client"

import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import { EntryState, useJournalStore } from '~/store';

export function MoodTracker() {  

  const entries = useJournalStore((state) => state.entries)

  console.log(entries)

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