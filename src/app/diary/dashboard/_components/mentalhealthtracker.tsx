"use client"

import { differenceInDays, format, parse, subDays } from "date-fns"
import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"
import { useMemo } from "react"
import { mentalHealthSymptoms } from "~/app/diary/entries/[date]/_components/editentry/mentalhealthentry"
import { trpc } from "~/utils/trpc"
require("highcharts/highcharts-more")(Highcharts)

export function MentalHealthTracker() {
  const { data: mentalHealthData } = trpc.mentalHealth.all.useQuery()

  const filteredMentalHealthData = useMemo(() => {
    return mentalHealthData?.filter(
      (entry) =>
        differenceInDays(
          parse(entry.date, "yyyy-MM-dd", new Date()),
          new Date()
        ) < 14
    )
  }, [mentalHealthData])

  const parsedMentalHealthData = useMemo(() => {
    const categoryColors = {
      Anxiety: "#FF6B6B",
      Mania: "#4ECDC4",
      Depression: "#45B7D1",
      Other: "#FFA07A"
    }

    return Object.entries(mentalHealthSymptoms)
      .map(([category, symptoms]) => ({
        name: category,
        type: "packedbubble" as const,
        color: categoryColors[category as keyof typeof categoryColors],
        data: symptoms
          .map((symptom) => {
            const totalCount =
              filteredMentalHealthData?.reduce((acc, entry) => {
                const count = entry.mentalHealth.filter(
                  (item) => item === symptom
                ).length
                return acc + count
              }, 0) || 0
            return {
              value: totalCount,
              name: symptom
            }
          })
          .filter((item) => item.value > 0)
      }))
      .filter((category) => category.data.length > 0)
  }, [filteredMentalHealthData])

  const chartOptions: Highcharts.Options = useMemo(
    () => ({
      chart: {
        type: "packedbubble",
        backgroundColor: "transparent"
      },
      title: {
        text: ""
      },
      tooltip: {
        useHTML: true,
        pointFormat: "<b>{point.name}:</b> {point.value}"
      },
      series: parsedMentalHealthData,
      legend: {
        enabled: true,
        itemStyle: {
          color: "#333333"
        },
        labelFormatter: function (this: Highcharts.Point) {
          if (this.series) {
            const series = this.series
            return `<span style="color:${series.color}">${this.name}</span>`
          }
          return this.name
        }
      },
      plotOptions: {
        packedbubble: {
          dataLabels: {
            enabled: true,
            format: "{point.name}",
            style: {
              textOutline: "none",
              fontWeight: "normal"
            }
          },
          minSize: 50,
          maxSize: 100,
          draggable: false
        }
      }
    }),
    [parsedMentalHealthData]
  )

  return (
    <div className="container-transparent">
      <div className="container-title">Mental Health Tracker</div>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  )
}
