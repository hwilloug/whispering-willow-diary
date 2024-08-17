"use client"

import { addDays, differenceInHours, differenceInMinutes, format, parse } from "date-fns";
import { useMemo } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker"
import TimePicker from "react-multi-date-picker/plugins/time_picker"
import { EntryState, SleepState, useJournalStore } from "~/store";
import TrashIcon from "./icons/trashicon";

export default function SleepEntry({ date, onSave }: {date?: string; onSave: (saveObj: Partial<EntryState>) => void}) {

  const sleep = useJournalStore(state => state.entries.find(e => e.date === date)?.sleep) || []

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
    return sleep.map(s => {
      if (s.bedTime && s.wakeUpTime) {
        return {...s, hoursSleep: parseFloat(getHoursSleep(s.bedTime, s.wakeUpTime).toFixed(2))}
      }
      return s
    })
  }, [[...sleep]])

  const totalHoursSleep = useMemo(() => {
    return sleepWithHours.reduce((acc, s) => acc + (s.hoursSleep ? s.hoursSleep : 0), 0).toFixed(2)
  }, [[...sleepWithHours]])

  const addSleep = () => {
    onSave({sleep: [...sleep, {hoursSleep: 0}]})
  }

  const updateSleep = (index: number, data: {bedTime?: DateObject | null, wakeUpTime?: DateObject | null}) => {
    const newSleep = [...sleep]

    if (data.bedTime || data.wakeUpTime) {
      const bedTimeDate = data.bedTime?.format("HH:mm")
      const wakeUpTimeDate = data.wakeUpTime?.format("HH:mm")
      if (data.wakeUpTime && data.bedTime) {
        newSleep[index] = {
          ...newSleep[index],
          bedTime: bedTimeDate,
          wakeUpTime: wakeUpTimeDate,
        }
      } else if (data.wakeUpTime) {
        newSleep[index] = {
          ...newSleep[index],
          wakeUpTime: wakeUpTimeDate,
        }
       } else if (data.bedTime) {
          newSleep[index] = {
            ...newSleep[index],
            bedTime: bedTimeDate,
          }
      }

    } else {
      newSleep.push({hoursSleep: 0})
    }
    onSave({sleep: newSleep})
  }

  async function deleteSleep(sleepEntry: SleepState) {
    let newSleep = sleep
    if (sleepEntry.id) {
      await fetch("/diary/api/sleep", {
        method: "DELETE",
        body: JSON.stringify({sleepId: sleep.find((s) => s.id === sleepEntry.id)?.id}),
        headers: {
          "Content-Type": "application/json"
        }
      })
      newSleep = sleep.filter(s => s.id !== sleepEntry.id)
    } else {
      newSleep.filter(s => s.bedTime !== sleepEntry.bedTime && s.wakeUpTime !== sleepEntry.wakeUpTime)
    }
    onSave({sleep: newSleep})
  }

  return (
    <div className="container-transparent text-center">
      <div className="container-title">Sleep</div>
      { sleepWithHours.map((s, idx) => (
        <div className="grid grid-cols-[1fr,auto,1fr,1fr,auto] gap-2 m-2 items-center">
          <DatePicker
            disableDayPicker
            onChange={(date) => date !== null ? updateSleep(idx, {bedTime: date}) : updateSleep(idx, {})}
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
            onChange={(date) => date !== null ? updateSleep(idx, {wakeUpTime: date}) : updateSleep(idx, {})}
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
            <TrashIcon onClick={() => deleteSleep(s)} />
          </div>
        </div>
      ))}
      <div className="m-2">
        <span>Total hours sleep: </span><span>{totalHoursSleep}</span>
      </div>
      <div className="w-fit m-auto">
        <button className="styled-button" onClick={() => addSleep()}>Add Sleep</button>
      </div>
    </div>
  )
}