"use client"

import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"
import { useMemo } from "react"
import { trpc } from "~/utils/trpc"
import { subDays, format } from "date-fns"

export function SubstanceUseTracker() {
  const { data, isLoading } = trpc.substances.all.useQuery()

  const dates = useMemo(() => {
    const today = new Date()
    return Array.from({ length: 7 }, (_, i) =>
      format(subDays(today, i), "yyyy-MM-dd")
    ).reverse()
  }, [])

  const substances = useMemo(() => {
    return [...new Set(data?.map((s) => s.substance))] ?? []
  }, [data])

  const getSubstanceColor = (substance: string) => {
    const colorMap: Record<string, string> = {
      Caffeine: "#8B4513",
      "Nicotine (Cigarrette)": "#A9A9A9",
      "Nicotine (Vape)": "#B0E0E6",
      Alcohol: "#FFD700",
      "Marijuana (Flower)": "#228B22",
      "Marijuana (Concentrate)": "#006400",
      "Marijuana (Edible)": "#32CD32",
      Cocaine: "#FFFFFF",
      Mushrooms: "#8B4513",
      Adderall: "#FF4500",
      Other: "#808080"
    }
    return colorMap[substance] ?? Highcharts.getOptions().colors![0]
  }

  const chartOptions = useMemo(() => {
    const series = substances.map((substance) => ({
      name: substance,
      data: dates.map((date) => {
        const entry = data?.find(
          (s) => s.date === date && s.substance === substance
        )
        return entry ? entry.amount : 0
      }),
      color: getSubstanceColor(substance)
    }))

    return {
      chart: {
        type: "column",
        backgroundColor: "transparent",
        height: 300
      },
      title: {
        text: ""
      },
      xAxis: {
        categories: dates,
        title: {
          text: ""
        },
        labels: {
          formatter: function (
            this: Highcharts.AxisLabelsFormatterContextObject
          ): string {
            return format(new Date(this.value as string), "MMM d")
          }
        }
      },
      yAxis: {
        title: {
          text: ""
        },
        visible: false
      },
      plotOptions: {
        column: {
          stacking: "normal",
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            formatter: function (
              this: Highcharts.PointLabelObject
            ): string | undefined {
              if (this.point.y !== undefined && this.point.y !== 0) {
                return `${this.point.y}`
              }
              return undefined
            }
          }
        }
      },
      series: series
    }
  }, [data, dates, substances])

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="container-transparent">
      <div className="container-title">Substance Use Tracker</div>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  )
}
