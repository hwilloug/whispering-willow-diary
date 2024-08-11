"use client"

import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';

export function MoodTracker() {
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