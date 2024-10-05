import { differenceInMinutes, parse } from "date-fns"
import { useParams } from "next/navigation"
import { useMemo } from "react"
import SleepEntry from "../editentry/sleepentry"
import { trpc } from "~/utils/trpc"

export default function SleepContent({ isEditMode }: { isEditMode: boolean }) {
  const { date } = useParams()

  if (!date || typeof date !== "string") throw new Error("Invalid date")

  const { data: sleep, isLoading } = trpc.sleep.one.useQuery({ date })
  const hoursSleep = useMemo(() => {
    const parseDbDate = (date: string) => {
      return new Date(date)
    }
    
    function getHoursSleep(bedTime: string, wakeUpTime: string) {
      const bedTimeDate = parseDbDate(bedTime)
      const wakeUpTimeDate = parseDbDate(wakeUpTime)
      const diffMin = differenceInMinutes(wakeUpTimeDate, bedTimeDate)
      let diff = diffMin / 60
      if (diff < 0) {
        diff += 24
      }
      return diff
    }

    if (!sleep) return 0
    return sleep
      .reduce(
        (acc, sleep) =>
          acc +
          (sleep.bedTime && sleep.wakeUpTime
            ? getHoursSleep(sleep.bedTime, sleep.wakeUpTime)
            : 0),
        0
      )
      .toFixed(2)
  }, [sleep])

  return (
    <div className="bg-blue-300 rounded-xl p-4">
      <h5 className="text-outline-bold text-2xl text-center my-4">Sleep</h5>
      {isEditMode ? (
        <SleepEntry />
      ) : (
        <div className="text-center m-4">{hoursSleep} hours</div>
      )}
    </div>
  )
}
