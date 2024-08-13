import { useMemo, useState } from "react";
import DatePicker from "react-multi-date-picker"
import TimePicker from "react-multi-date-picker/plugins/time_picker"

export default function SleepEntry() {
  const [sleep, setSleep] = useState<{bedTime: string, wakeUpTime: string, sleepQuality: string, hoursSleep: number}[]>([])

  const totalHoursSleep = useMemo(() => {
    let hours = 0
    for (let s in sleep) {
      hours += sleep[s]!.hoursSleep
    }
    return hours
  }, [[...sleep]])

  return (
    <div className="container-transparent text-center">
      <div className="container-title">Sleep</div>
      { sleep.map((s) => (
        <div className="grid grid-cols-[1fr,auto,1fr,1fr] gap-2 m-2 items-center">
          <DatePicker
            disableDayPicker
            format="hh:mm A"
            plugins={[
              <TimePicker position="bottom" hideSeconds />
            ]}
            style={{padding: 20, backgroundColor: "var(--primary)", textAlign: "center"}}
          />
          <span>to</span>
          <DatePicker
            disableDayPicker
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
        <button className="w-fit px-8 py-2 border border-[--secondary] hover:text-[--secondary] m-auto rounded-lg bg-[--secondary] text-white hover:bg-transparent" onClick={() => setSleep([...sleep, {bedTime: "", wakeUpTime: "", hoursSleep: 0, sleepQuality: ""}])}>Add Sleep</button>
      </div>
    </div>
  )
}