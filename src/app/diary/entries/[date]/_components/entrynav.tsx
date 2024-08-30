import { addDays, format, isAfter, isBefore, parse, subDays } from "date-fns"
import { useParams, useRouter } from "next/navigation"
import ArrowLeft from "./icons/arrowleft"
import ArrowRight from "./icons/arrowright"
import { useMemo } from "react"

export default function EntryNav() {
  const router = useRouter()
  const { date } = useParams()

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
    <div className="grid grid-cols-2 m-6">
      <div>
        <button className="styled-button" onClick={onBack}>
          <ArrowLeft />
        </button>
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
  )
}
