"use client"

import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import { EntryState, useJournalStore } from '~/store';
import { useMemo, useState } from 'react';
import TimeRangeButton from './timerangebutton';
import { format, fromUnixTime, getUnixTime, parse, parseISO, sub } from 'date-fns';
import { trpc } from '~/utils/trpc';

interface HighchartsDataPoint {
  x: number,
  y: number
}

export function MoodTracker() {  
  const { data: mood, isLoading } = trpc.moods.useQuery()

  const today = new Date()

  const [timeFilter, setTimeFilter] = useState(sub(today, { days: 7 }))
  const timeRangeButtonValues = useMemo(() => {
    return [
      {
        text: "Last Week",
        value: sub(today, { days: 7 }),
      },
      {
        text: "Last 2 Weeks",
        value: sub(today, { days: 14 }),
      },
      {
        value: sub(today, { days: 30 }),
        text: "Last Month",
      },
      {
        text: "Last Year",
        value: sub(today, { days: 375 }),
      }
    ]
  }, [])

  const moodColors = {
    "0": "red",
    "1": "orange",
    "2": "blue",
    "3": "green",
    "4": "purple",
  }

  const moodText = {
    "0": "Awful",
    "1": "Bad",
    "2": "Ok",
    "3": "Good",
    "4": "Ecstatic",
  }

  const moodData = useMemo(() => {
    if (!mood) return []

    let moodData: HighchartsDataPoint[] = []
    for (let idx = 0; idx < mood.length; idx++) {
      if (mood![idx]?.mood !== undefined) {
        moodData.push({
          x: getUnixTime(parse(mood[idx]!.date, "yyyy-MM-dd", new Date())),
          y: mood![idx]!.mood,
        })
      }
    }
    moodData.sort((a, b) => a.x - b.x)
    return moodData
  }, [mood])

  const filteredMoodData = useMemo(() => {
    return moodData.filter((d) => {
      return d.x > getUnixTime(parseISO(timeFilter.toISOString()))
    })
  }, [moodData, timeFilter])

  const chartOptions: Highcharts.Options = {
    title: {
      text: "",
    },
    chart: {
      backgroundColor: "rgba(224, 240, 187)",
      borderRadius: 10,
    },
    xAxis: {
      min: getUnixTime(parseISO(timeFilter.toISOString())),
      labels: {
        formatter: (function () {
          return format(fromUnixTime(typeof this.value === "string" ? parseInt(this.value) : this.value), "MMM dd")
        }),
      },
    },
    yAxis: [
      {
        title: {
          text: "Mood",
        },
        max: 4.5,
        min: 0,
        tickInterval: 1,
        gridLineColor: "transparent",
        labels: {
          useHTML: true,
          // @ts-ignore
          formatter: function () {
            let mouth
            let color
            // @ts-ignore
            switch (this.value) {
              case 0:
                mouth = `<>
                  <path d="M8,18 Q12,14 16,18" />
                  <rect x="8" y="18" width="8" height="0.25" />
                </>`
                color = "red"
                break
              case 1:
                mouth = `<path d="M8,17 Q12,14 16,17" />`
                color = "orange"
                break
              case 2:
                mouth = `<path d="M8,17 16,17" />`
                color = "blue"
                break
              case 3:
                mouth = `<path d="M8,17 Q12,20 16,17" />`
                color = "green"
                break
              case 4:
                mouth = `<>
                  <path d="M8,17 Q12,20 16,17" />
                  <rect x="7" y="16" width="10" height="0.25" />
                </>`
                color = "purple"
                break
            }
            return `<svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke=${color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <circle cx="8" cy="10" r="1" />
              <circle cx="16" cy="10" r="1" />
              ${mouth}
            </svg>`
          },
        },
      }
    ],
    plotOptions: {
      column: {
        stacking: "normal",
      },
      series: {
        point: {
          events: {
            click: function () {
              // navigate(`/diary/${convertToShortDate(new Date(this.x))}/view`)
            },
          },
        },
      },
    },
    tooltip: {
      formatter: function () {
        switch (this.series.name) {
          case "Mood":
            return `${format(fromUnixTime(typeof this.x === "string" ? parseInt(this.x) : this.x!), "MMM dd, yyyy")}: <b>${
              // @ts-ignore
              moodText[this.y!.toString()]
            }</b>`
        }
      },
    },
    series: [
      // @ts-ignore
      {
        name: "Mood",
        data: filteredMoodData,
        type: "spline",
        yAxis: 0,
        zIndex: 1,
        color: "theme.palette.info.main",
        zones: [
          {
            value: 0.5,
            color: moodColors["0"],
          },
          {
            value: 1.5,
            color: moodColors["1"],
          },
          {
            value: 2.5,
            color: moodColors["2"],
          },
          {
            value: 3.5,
            color: moodColors["3"],
          },
          {
            value: 4.5,
            color: moodColors["4"],
          },
        ],
      }
    ],
    legend: {
      enabled: true,
    },
  }
  
  return (
    <div className="container-transparent">
      <div className="container-title">Mood Tracker</div>
      <div className="text-center">
        {timeRangeButtonValues.map((t) => <TimeRangeButton key={t.text} onClick={() => setTimeFilter(t.value)} value={t.text} isActive={timeFilter.toLocaleDateString() === t.value.toLocaleDateString()} />)}
      </div>
      <div>
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      </div>
    </div>
  )
}