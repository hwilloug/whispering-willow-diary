"use client"

import { useParams } from "next/navigation"
import SubstanceUseEntry from "../editentry/substanceuseentry"
import { trpc } from "~/utils/trpc"
import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"
import { useMemo } from "react"

export default function SubstanceUseContent({
  isEditMode
}: {
  isEditMode: boolean
}) {
  const { date } = useParams()

  const { data, isLoading } = trpc.substances.one.useQuery({
    date: date as string
  })

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

  const chartData = useMemo(() => {
    return (
      data?.map((s) => ({
        y: s.amount,
        color: getSubstanceColor(s.substance)
      })) ?? []
    )
  }, [data])

  const categories = useMemo(() => {
    return data?.map((s) => s.substance) ?? []
  }, [data])

  const chartOptions = useMemo(() => {
    return {
      chart: {
        type: "column",
        backgroundColor: "transparent"
      },
      title: {
        text: ""
      },
      xAxis: {
        categories: categories,
        title: {
          text: ""
        },
        labels: {
          style: {
            fontSize: "15px",
            textOutline: "1px 1px 1px #ffffff",
            fontWeight: "bold"
          }
        }
      },
      yAxis: {
        title: {
          text: ""
        },
        labels: {
          format: "{value}x"
        },
        min: 0,
        tickInterval: 1,
        visible: false
      },
      plotOptions: {
        column: {
          dataLabels: {
            enabled: true,
            format: "<div style='font-size: 20px;'>{y}x</div>"
          },
          borderRadius: 20,
          borderWidth: 0,
          pointWidth: 100,
          shadow: true
        }
      },
      series: [
        {
          name: "",
          data: chartData,
          colorByPoint: true
        }
      ],
      legend: {
        enabled: false
      }
    }
  }, [categories, chartData])

  return (
    <div className="bg-red-500 rounded-xl my-4 p-4">
      <h5 className="text-outline-bold text-2xl text-center my-4">
        Substance Use
      </h5>
      {isEditMode ? (
        <SubstanceUseEntry />
      ) : !isLoading && data?.length === 0 ? (
        <div className="text-center m-4">None</div>
      ) : (
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      )}
    </div>
  )
}
