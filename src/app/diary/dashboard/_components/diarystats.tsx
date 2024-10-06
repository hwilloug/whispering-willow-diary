"use client"

import { differenceInDays, formatDate, subDays } from "date-fns"
import { type ReactNode, useMemo } from "react"
import { trpc } from "~/utils/trpc"
import FaceIcon from "../../_components/icons/faceicon"

export function DiaryStats() {
  const utils = trpc.useUtils()

  const { data: entries, isLoading } = trpc.entries.all.useQuery()

  const today = new Date()
  const numEntries = useMemo(() => entries?.length, [entries])
  const last7entries = entries?.slice(0, 7)

  const streak = useMemo(() => {
    let streak = 0
    const firstEntry = entries?.[entries.length - 1]

    if (!firstEntry) return streak

    const firstEntryDate = firstEntry?.date
    const numDays = differenceInDays(today, firstEntryDate)

    for (let i = 0; i < numDays - 1; i++) {
      const date = subDays(today, i)
      const dateString = formatDate(date, "yyyy-MM-dd")
      if (entries?.some((entry) => entry.date === dateString)) {
        streak++
      } else {
        break
      }
    }
    return streak
  }, [entries])

  const avgMood = useMemo(() => {
    if (!last7entries) return 0

    const today = new Date()

    let moodTotal = 0
    let moodCount = 0
    for (let i = 0; i <= 7; i++) {
      const date = subDays(today, i)
      if (
        last7entries.some(
          (entry) =>
            formatDate(entry.date, "yyyy-MM-dd") ===
            formatDate(date, "yyyy-MM-dd")
        )
      ) {
        if (last7entries[i]?.mood) {
          moodTotal += last7entries[i]!.mood!.mood
          moodCount += 1
        }
      }
    }
    return moodTotal / moodCount
  }, [entries])

  const avgMoodIcon = useMemo(() => {
    switch (Math.round(avgMood)) {
      case 0:
        return (
          <FaceIcon
            color="red"
            variant="distressed"
            value={avgMood}
            className="m-auto"
          />
        )
      case 1:
        return (
          <FaceIcon
            color="orange"
            variant="bad"
            value={avgMood}
            className="m-auto"
          />
        )
      case 2:
        return (
          <FaceIcon
            color="blue"
            variant="neutral"
            value={avgMood}
            className="m-auto"
          />
        )
      case 3:
        return (
          <FaceIcon
            color="green"
            variant="happy"
            value={avgMood}
            className="m-auto"
          />
        )
      case 4:
        return (
          <FaceIcon
            color="purple"
            variant="ecstatic"
            value={avgMood}
            className="m-auto"
          />
        )
    }
  }, [avgMood])

  const avgMoodBgColor = useMemo(() => {
    switch (Math.round(avgMood)) {
      case 0:
        return `linear-gradient(to bottom, #ef9a999, #ff1744)`
      case 1:
        return `linear-gradient(to bottom, #ffcc8099, #ff9100)`
      case 2:
        return `linear-gradient(to bottom, #90caf999, #2979ff)`
      case 3:
        return `linear-gradient(to bottom, #a5d6a799, #00e676)`
      case 4:
        return `linear-gradient(to bottom, #ce93d899, #d500f9)`
      default:
        return `linear-gradient(to bottom, #a5d6a799, #00e676)`
    }
  }, [avgMood])

  const stdDeviation = useMemo(() => {
    if (!last7entries) return 0

    const deviations = []
    let numEntries = 0
    for (let i = 0; i <= 7; i++) {
      const date = subDays(today, i)
      if (
        last7entries.some(
          (entry) => entry.date === formatDate(date, "yyyy-MM-dd")
        )
      ) {
        if (last7entries[i]?.mood) {
          deviations.push((last7entries[i]!.mood!.mood - avgMood) ** 2)
          numEntries++
        }
      }
    }

    const deviationSum = deviations.reduce((accumulator, currentValue) => {
      return accumulator + currentValue
    }, 0)

    return parseFloat(Math.sqrt(deviationSum / (numEntries - 1)).toFixed(2))
  }, [entries, avgMood])

  const stdDeviationColor = useMemo(() => {
    if (stdDeviation > 0.5) {
      return "linear-gradient(to bottom, #ef9a9a99, #ef5350)"
    } else {
      return "linear-gradient(to bottom, #a5d6a799, #00e676)"
    }
  }, [stdDeviation])

  return (
    <div className="px-4 py-2 text-outline-bold">
      <div className="grid md:grid-cols-3 justify-stretch p-4 gap-4">
        <StatCard
          name="Streak"
          value={streak + (streak > 1 ? "🔥" : "")}
          color="linear-gradient(to bottom, #ce93d899, #9c27b0)"
        />
        <StatCard
          name="Average Mood"
          value={avgMoodIcon}
          color={avgMoodBgColor}
        />
        <StatCard
          name="Standard Deviation"
          value={stdDeviation}
          color={stdDeviationColor}
        />
      </div>
    </div>
  )
}

function StatCard({
  name,
  value,
  color
}: {
  name: string
  value: string | number | ReactNode
  color: string
}) {
  return (
    <div
      className="px-4 py-2 rounded-lg text-outline-bold"
      style={{ background: color }}
    >
      <div className="text-center">
        <div className="text-lg font-bold">{name}</div>
        <div className="text-lg font-bold">{value}</div>
      </div>
    </div>
  )
}
