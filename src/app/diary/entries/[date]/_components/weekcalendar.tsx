import { addDays, format, isAfter, isEqual, subDays } from "date-fns"
import React, { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { trpc } from "~/utils/trpc"
const WeeklyCalendar: React.FC<{
  selectedDate: Date
  setSelectedDate: (date: Date) => void
  today: Date
}> = ({ selectedDate, setSelectedDate, today }) => {
  const router = useRouter()

  const { data: entries } = trpc.entries.all.useQuery()

  const { weekDates, entryDays } = useMemo(() => {
    const days = []
    const entryDays = []
    for (let i = 3; i >= 0; i--) {
      days.push(subDays(selectedDate, i))
      if (
        entries?.find((entry) =>
          isEqual(entry.date, subDays(format(selectedDate, "yyyy-MM-dd"), i))
        )
      ) {
        entryDays.push(format(subDays(selectedDate, i), "yyyy-MM-dd"))
      }
    }
    for (let i = 1; i < 4; i++) {
      days.push(addDays(selectedDate, i))
      if (
        entries?.find((entry) =>
          isEqual(entry.date, addDays(format(selectedDate, "yyyy-MM-dd"), i))
        )
      ) {
        entryDays.push(format(addDays(selectedDate, i), "yyyy-MM-dd"))
      }
    }
    return { weekDates: days, entryDays }
  }, [selectedDate])

  return (
    <div className="container-transparent" style={{ padding: "0px" }}>
      <div className="flex justify-between">
        {weekDates.map((date) => (
          <button
            key={date.toISOString()}
            className="p-4 text-outline-bold grid grid-cols-1 justify-items-center"
            style={{
              color: isAfter(date, today) ? "grey" : "black"
            }}
            onClick={() => {
              setSelectedDate(date)
              router.push(`/diary/entries/${format(date, "yyyy-MM-dd")}`)
            }}
            disabled={isAfter(date, today)}
          >
            <div>
              {entryDays.includes(format(date, "yyyy-MM-dd")) && (
                <div className="bg-purple-600 w-3 h-3 rounded-full" />
              )}
            </div>
            <div
              className={`${format(date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd") && "text-purple-600"}`}
            >
              {format(date, "MMM d")}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default WeeklyCalendar
