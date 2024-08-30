"use client"

import { addDays, differenceInHours, differenceInMinutes, format, parse } from "date-fns";
import { useMemo } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker"
import TimePicker from "react-multi-date-picker/plugins/time_picker"
import { EntryState, SleepState, useJournalStore } from "~/store";
import TrashIcon from "~/app/diary/_components/icons/trashicon";
import { trpc } from "~/utils/trpc";
import { useParams } from "next/navigation";

export default function SleepEntry() {

  const { date } = useParams()

  if (!date || typeof date !== "string") {
    return <div>Invalid date</div>
  }

  const { data: sleep, isLoading } = trpc.sleep.one.useQuery({ date })

  function getHoursSleep(bedTime: string, wakeUpTime: string) {
    const bedTimeDate = parse(bedTime, "HH:mm", new Date())
    const wakeUpTimeDate = parse(wakeUpTime, "HH:mm", new Date())
    const diffMin = differenceInMinutes(wakeUpTimeDate, bedTimeDate)
    let diff = diffMin / 60
    if (diff < 0) {
      diff += 24
    }
    return diff
  }

  const sleepWithHours = useMemo(() => {
    return sleep?.map(s => {
      if (s.bedTime && s.wakeUpTime) {
        return {...s, hoursSleep: parseFloat(getHoursSleep(s.bedTime, s.wakeUpTime).toFixed(2))}
      }
      return {...s, hoursSleep: 0}
    })
  }, [sleep])

  const totalHoursSleep = useMemo(() => {
    return sleepWithHours?.reduce((acc, s) => acc + (s.hoursSleep ? s.hoursSleep : 0), 0).toFixed(2)
  }, [sleepWithHours])

  return (
    <>
      { sleepWithHours?.map((s, idx) => (
        <div className="grid grid-cols-[1fr,auto,1fr,1fr,auto] gap-2 m-2 items-center">
          <DatePicker
            disableDayPicker
            value={s.bedTime ? parse(s.bedTime, "HH:mm", new Date()) : null}
            format="hh:mm A"
            plugins={[
              <TimePicker position="bottom" hideSeconds />
            ]}
            style={{padding: 20, backgroundColor: "var(--primary)", textAlign: "center"}}
          />
          <span>to</span>
          <DatePicker
            disableDayPicker
            value={s.wakeUpTime ? parse(s.wakeUpTime, "HH:mm", new Date()) : null}
            format="hh:mm A"
            plugins={[
              <TimePicker position="bottom" hideSeconds />
            ]}
            style={{padding: 20, backgroundColor: "var(--primary)", textAlign: "center"}}
          />
          <div>
            <span>({s.hoursSleep} hours)</span>
          </div>
          <div>
            <TrashIcon onClick={() => ({})} />
          </div>
        </div>
      ))}
      <div className="m-2">
        <span>Total hours sleep: </span><span>{totalHoursSleep}</span>
      </div>
      <div className="w-fit m-auto">
        <button className="styled-button" onClick={() => ({})}>Add Sleep</button>
      </div>
    </>
  )
}