import { addDays, format, isAfter, isBefore, parse, subDays } from "date-fns"
import { useParams, useRouter } from "next/navigation"
import ArrowLeft from "./icons/arrowleft"
import ArrowRight from "./icons/arrowright"
import { useMemo, useState } from "react"
import WeeklyCalendar from "./weekcalendar"
import CalendarIcon from "./icons/calendaricon"

export default function EntryNav() {
  const router = useRouter()
  const { date } = useParams()

  const [selectedDate, setSelectedDate] = useState(
    parse(date as string, "yyyy-MM-dd", new Date())
  )

  const dateObject = parse(date as string, "yyyy-MM-dd", new Date())
  const yesterday = format(subDays(dateObject, 1), "yyyy-MM-dd")
  const tomorrow = format(addDays(dateObject, 1), "yyyy-MM-dd")

  const onBack = () => {
    router.push(`/diary/entries/${yesterday}`)
  }

  const onForward = () => {
    router.push(`/diary/entries/${tomorrow}`)
  }

  const noForward = useMemo(() => {
    const today = new Date()
    const formattedToday = format(today, "yyyy-MM-dd")

    if (isAfter(today, dateObject) && formattedToday !== date) {
      return true
    }

    return false
  }, [dateObject])

  return (
    <div>
      <div>
        <CalendarIcon className="text-white" color="white" />
      </div>
      <div className="grid grid-cols-[auto,3fr,auto] mx-6 items-center">
        <div>
          <button className="styled-button" onClick={onBack}>
            <ArrowLeft />
          </button>
        </div>
        <div>
          <WeeklyCalendar
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            today={new Date()}
          />
        </div>
        {noForward && (
          <div className="text-right">
            <button
              className="styled-button justify-self-end"
              onClick={onForward}
            >
              <ArrowRight />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
