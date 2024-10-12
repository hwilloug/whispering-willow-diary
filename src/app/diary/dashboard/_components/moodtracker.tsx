"use client"

import Highcharts from "highcharts/highstock"
import HighchartsReact from "highcharts-react-official"
import { EntryState, useJournalStore } from "~/store"
import { useMemo, useState } from "react"
import TimeRangeButton from "./timerangebutton"
import {
  format,
  fromUnixTime,
  getUnixTime,
  parse,
  parseISO,
  sub
} from "date-fns"
import { trpc } from "~/utils/trpc"
import { useRouter } from "next/navigation"

interface HighchartsDataPoint {
  x: number
  y: number
}

export function MoodTracker() {
  const router = useRouter()

  const { data: mood, isLoading } = trpc.mood.all.useQuery()
  const { data: mentalHealth, isLoading: mentalHealthLoading } =
    trpc.mentalHealth.all.useQuery()

  const today = new Date()

  const [timeFilter, setTimeFilter] = useState(sub(today, { days: 7 }))
  const timeRangeButtonValues = useMemo(() => {
    return [
      {
        text: "Last Week",
        value: sub(today, { days: 7 })
      },
      {
        text: "Last 2 Weeks",
        value: sub(today, { days: 14 })
      },
      {
        value: sub(today, { days: 30 }),
        text: "Last Month"
      },
      {
        text: "Last Year",
        value: sub(today, { days: 375 })
      }
    ]
  }, [])

  const moodColors = {
    "0": "red",
    "1": "red",
    "2": "orange",
    "3": "orange",
    "4": "blue",
    "5": "blue",
    "6": "green",
    "7": "green",
    "8": "purple",
    "9": "purple",
    "10": "purple"
  }

  const moodText = {
    "0": "Awful",
    "1": "Awful",
    "2": "Bad",
    "3": "Bad",
    "4": "Ok",
    "5": "Ok",
    "6": "Good",
    "7": "Good",
    "8": "Ecstatic",
    "9": "Ecstatic",
    "10": "Ecstatic"
  }

  const moodData = useMemo(() => {
    if (!mood) return []

    const moodData: HighchartsDataPoint[] = []
    for (const moodEntry of mood) {
      if (moodEntry.mood !== undefined) {
        moodData.push({
          x: getUnixTime(parse(moodEntry.date, "yyyy-MM-dd", new Date())),
          y: moodEntry.mood
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
      text: ""
    },
    chart: {
      backgroundColor: "rgba(224, 240, 187)",
      borderRadius: 10
    },
    xAxis: {
      min: getUnixTime(parseISO(timeFilter.toISOString())),
      labels: {
        formatter: function () {
          return format(
            fromUnixTime(
              typeof this.value === "string" ? parseInt(this.value) : this.value
            ),
            "MMM dd"
          )
        }
      }
    },
    yAxis: [
      {
        title: {
          text: "Mood"
        },
        max: 10.5,
        min: 0,
        tickInterval: 1,
        gridLineColor: "transparent",
        labels: {
          useHTML: true,
          formatter: function () {
            let mouth
            let color
            switch (this.value) {
              case 0:
                mouth = `<>
                  <path d="M8,18 Q12,14 16,18" />
                  <rect x="8" y="18" width="8" height="0.25" />
                </>`
                color = "red"
                break
              case 2:
                mouth = `<path d="M8,17 Q12,14 16,17" />`
                color = "orange"
                break
              case 4:
                mouth = `<path d="M8,17 16,17" />`
                color = "#decd4e"
                break
              case 6:
                mouth = `<path d="M8,17 16,17" />`
                color = "#8cd18d"
                break
              case 8:
                mouth = `<path d="M8,17 Q12,20 16,17" />`
                color = "green"
                break
              case 10:
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
          }
        }
      }
    ],
    plotOptions: {
      column: {
        stacking: "normal"
      },
      series: {
        point: {
          events: {
            click: function () {
              router.push(
                `/diary/entries/${format(fromUnixTime(typeof this.x === "string" ? parseInt(this.x) : this.x), "yyyy-MM-dd")}`
              )
            }
          }
        }
      }
    },
    tooltip: {
      formatter: function () {
        switch (this.series.name) {
          case "Mood":
            return `${format(fromUnixTime(typeof this.x === "string" ? parseInt(this.x) : this.x!), "MMM dd, yyyy")}: <b>${
              // @ts-expect-error  index of string is fine
              moodText[this.y!.toString()]
            }</b><br />${mentalHealth?.find((mh) => mh.date === format(fromUnixTime(typeof this.x === "string" ? parseInt(this.x) : this.x!), "yyyy-MM-dd"))?.mentalHealth.join(", ") || ""}`
        }
      }
    },
    series: [
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
            color: moodColors["0"]
          },
          {
            value: 1.5,
            color: moodColors["1"]
          },
          {
            value: 2.5,
            color: moodColors["2"]
          },
          {
            value: 3.5,
            color: moodColors["3"]
          },
          {
            value: 4.5,
            color: moodColors["4"]
          },
          {
            value: 5.5,
            color: moodColors["5"]
          },
          {
            value: 6.5,
            color: moodColors["6"]
          },
          {
            value: 7.5,
            color: moodColors["7"]
          },
          {
            value: 8.5,
            color: moodColors["8"]
          },
          {
            value: 9.5,
            color: moodColors["9"]
          },
          {
            value: 10.5,
            color: moodColors["10"]
          }
        ]
      }
    ],
    legend: {
      enabled: true
    }
  }

  return (
    <div className="container-transparent">
      <div className="container-title">Mood Tracker</div>
      <div className="text-center">
        {timeRangeButtonValues.map((t) => (
          <TimeRangeButton
            key={t.text}
            onClick={() => setTimeFilter(t.value)}
            value={t.text}
            isActive={
              timeFilter.toLocaleDateString() === t.value.toLocaleDateString()
            }
          />
        ))}
      </div>
      <div>
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      </div>
    </div>
  )
}
