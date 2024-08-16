"use client"

import { differenceInHours, format, parse } from "date-fns";
import { useMemo, useState } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker"
import TimePicker from "react-multi-date-picker/plugins/time_picker"
import { EntryState, useJournalStore } from "~/store";

export default function SleepEntry({ date, onSave }: {date?: string; onSave: (saveObj: Partial<EntryState>) => void}) {

  const sleep = useJournalStore(state => state.entries.find(e => e.date === date)?.sleep) || []

  const totalHoursSleep = useMemo(() => {
    return sleep.reduce((acc, s) => acc + (s.hoursSleep ? s.hoursSleep : 0), 0)
  }, [[...sleep]])

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

  return (
    <div className="container-transparent text-center">
      <div className="container-title">Sleep</div>
      { sleep.map((s, idx) => (
        <div className="grid grid-cols-[1fr,auto,1fr,1fr] gap-2 m-2 items-center">
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