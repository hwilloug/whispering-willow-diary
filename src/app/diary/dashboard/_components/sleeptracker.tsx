"use client"

import { format, parse, subDays } from "date-fns"
import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"
import { useMemo, useState } from "react"
import { getHoursSleep } from "~/app/utils"
import { trpc } from "~/utils/trpc"

const IDEAL_HOURS_SLEEP = 8

export function SleepTracker() {
  const today = new Date()

  const { data } = trpc.sleep.all.useQuery({
    date: format(today, "yyyy-MM-dd")
  })

  console.log(data)

  const timeFilters = [
    {
      name: "Last Week",
      firstDate: subDays(today, 7).valueOf()
    },
    {
      name: "Last 2 Weeks",
      firstDate: subDays(today, 14).valueOf()
    },
    {
      name: "Last Month",
      firstDate: subDays(today, 30).valueOf()
    },
    {
      name: "Last Year",
      firstDate: subDays(today, 365).valueOf()
    }
  ]

  const [timeFilter, setTimeFilter] = useState(subDays(today, 7).valueOf())

  const sleepData = useMemo(() => {
    if (!data || data.length === 0) return []

    const sleepByDate: Record<string, number> = {}

    for (const d of data) {
      if (d.bedTime === null || d.wakeUpTime === null) continue

      const date = parse(d.date, "yyyy-MM-dd", new Date())
      if (date.getTime() < timeFilter) continue

      const formattedDate = format(date, "yyyy-MM-dd")
      const hoursSleep = getHoursSleep(d.bedTime, d.wakeUpTime)

      if (formattedDate in sleepByDate) {
        sleepByDate[formattedDate]! += hoursSleep
      } else {
        sleepByDate[formattedDate] = hoursSleep
      }
    }

    return Object.entries(sleepByDate)
      .map(([dateString, totalHours]) => ({
        x: parse(dateString, "yyyy-MM-dd", new Date()).getTime(),
        y: totalHours
      }))
      .sort((a, b) => a.x - b.x)
  }, [data, timeFilter])

  console.log(sleepData)

  const chartOptions: Highcharts.Options = {
    chart: {
      backgroundColor: "rgba(224, 240, 187)",
      borderRadius: 10
    },
    title: {
      text: ""
    },
    xAxis: {
      min: timeFilter,
      labels: {
        formatter: function () {
          return (
            (new Date(this.value).getMonth() + 1).toString() +
            "/" +
            new Date(this.value).getDate().toString()
          )
        }
      }
    },
    yAxis: [
      {
        title: {
          text: "Hours Sleep"
        },
        gridLineColor: "transparent",
        plotLines: [
          {
            color: "darkgrey",
            value: IDEAL_HOURS_SLEEP + 0.5,
            dashStyle: "Dash",
            width: 2
          },
          {
            color: "darkgrey",
            value: IDEAL_HOURS_SLEEP - 0.5,
            dashStyle: "Dash",
            width: 2
          }
        ]
      },
      {
        title: {
          text: "Sleep Quality"
        },
        opposite: true,
        min: 0,
        max: 3,
        visible: false
      }
    ],
    plotOptions: {
      column: {
        stacking: "normal"
      }
    },
    tooltip: {
      formatter: function () {
        return `${format(new Date(this.x!), "MM/dd")}: <b>${this.y} hours</b>`
      }
    },
    series: [
      {
        name: "Sleep",
        data: sleepData,
        type: "spline",
        color: "darkgrey",
        zones: [
          {
            value: IDEAL_HOURS_SLEEP - 0.5,
            color: "orange"
          },
          {
            value: IDEAL_HOURS_SLEEP + 0.5,
            color: "darkgrey"
          },
          {
            color: "orange"
          }
        ],
        zIndex: 1
      }
    ],
    legend: {
      enabled: true
    }
  }

  return (
    <div className="container-transparent">
      <p className="container-title">Sleep Tracker</p>
      <div className="flex flex-row justify-center gap-4 pb-4">
        {timeFilters.map((f) => (
          <button
            key={f.name}
            className={`bg-[--${
              new Date(f.firstDate).toDateString() ===
              new Date(timeFilter).toDateString()
                ? "secondary"
                : "primary"
            }] text-[--${
              new Date(f.firstDate).toDateString() ===
              new Date(timeFilter).toDateString()
                ? "primary"
                : "secondary"
            }]`}
            color={
              new Date(f.firstDate).toDateString() ===
              new Date(timeFilter).toDateString()
                ? "primary"
                : "secondary"
            }
            onClick={() => setTimeFilter(f.firstDate)}
          >
            {f.name}
          </button>
        ))}
      </div>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  )
}
