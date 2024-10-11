import { differenceInMinutes, parse } from "date-fns"

export function getHoursSleep(bedTime: string, wakeUpTime: string) {
  const bedTimeDate = new Date(bedTime)
  const wakeUpTimeDate = new Date(wakeUpTime)
  const diffMin = differenceInMinutes(wakeUpTimeDate, bedTimeDate)
  let diff = diffMin / 60
  if (diff < 0) {
    diff += 24
  }
  if (diff > 24) {
    diff -= 24
  }
  return diff
}
