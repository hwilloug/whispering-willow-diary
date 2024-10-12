"use client"

import { useCallback, useMemo } from "react"
import DatePicker from "react-multi-date-picker"
import TimePicker from "react-multi-date-picker/plugins/time_picker"
import TrashIcon from "~/app/diary/_components/icons/trashicon"
import { trpc } from "~/utils/trpc"
import { useParams } from "next/navigation"
import { getHoursSleep } from "~/app/utils"

export default function SleepEntry() {
  const { date } = useParams()
  const utils = trpc.useUtils()

  if (!date && typeof date !== "string") throw new Error("Invalid date")

  const { data: entry, isLoading: isLoadingEntry } = trpc.entries.one.useQuery({
    // @ts-expect-error  date will always be a string
    date
  })
  if (entry === undefined && !isLoadingEntry) throw new Error("Invalid entry")

  // @ts-expect-error  date will always be a string
  const { data: sleep, isLoading } = trpc.sleep.one.useQuery({ date })

  const createMutation = trpc.sleep.post.useMutation({
    onSuccess: async () => {
      await utils.sleep.invalidate()
    }
  })

  const updateMutation = trpc.sleep.put.useMutation({
    onSuccess: async () => {
      await utils.sleep.invalidate()
    }
  })

  const deleteMutation = trpc.sleep.delete.useMutation({
    onSuccess: async () => {
      await utils.sleep.invalidate()
    }
  })

  const parseDbDate = (date: string) => {
    return new Date(date)
  }

  const sleepWithHours = useMemo(() => {
    if (!sleep) return []
    const sleepWithHours = sleep?.map((s) => {
      if (s.bedTime && s.wakeUpTime) {
        return {
          ...s,
          hoursSleep: parseFloat(
            getHoursSleep(s.bedTime, s.wakeUpTime).toFixed(2)
          )
        }
      }
      return { ...s, hoursSleep: 0 }
    })
    return sleepWithHours.sort((a, b) => a.id - b.id)
  }, [sleep])

  const totalHoursSleep = useMemo(() => {
    return sleepWithHours
      ?.reduce((acc, s) => acc + (s.hoursSleep ? s.hoursSleep : 0), 0)
      .toFixed(2)
  }, [sleepWithHours])

  const addSleep = () => {
    // @ts-expect-error  date will always be a string
    createMutation.mutate({ date, entryId: entry!.id })
  }

  const updateSleep = ({
    id,
    bedTime,
    wakeUpTime,
    sleepQuality
  }: {
    id: number
    bedTime?: string
    wakeUpTime?: string
    sleepQuality?: string
  }) => {
    updateMutation.mutate({ id, bedTime, wakeUpTime, sleepQuality })
  }

  const submit = useCallback(
    ({
      id,
      wakeUpTime,
      bedTime,
      sleepQuality
    }: {
      id?: number
      wakeUpTime?: string
      bedTime?: string
      sleepQuality?: string
    }) => {
      if (id) {
        updateSleep({ id, wakeUpTime, bedTime, sleepQuality })
      } else {
        addSleep()
      }
    },
    []
  )

  const onChange = (data: {
    id?: number
    wakeUpTime?: string
    bedTime?: string
    sleepQuality?: string
  }) => {
    submit(data)
  }

  const onDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this sleep entry?")) return

    deleteMutation.mutate({ id })
  }

  return (
    <>
      {sleepWithHours?.map((s, idx) => (
        <>
          <div
            key={idx}
            className="lg:grid grid-cols-[1fr,auto,1fr,1fr,auto] gap-2 m-2 items-center text-center"
          >
            <DatePicker
              disableDayPicker
              value={s.bedTime}
              onChange={(value) => {
                onChange({ id: s.id, bedTime: value?.format("HH:mm") })
              }}
              format="hh:mm A"
              plugins={[
                <TimePicker
                  key={`${idx}-bed-time`}
                  position="bottom"
                  hideSeconds
                />
              ]}
              style={{
                padding: 20,
                textAlign: "center",
                backgroundColor: "#bfdbfe"
              }}
            />
            <p>to</p>
            <DatePicker
              disableDayPicker
              value={s.wakeUpTime}
              onChange={(value) => {
                onChange({ id: s.id, wakeUpTime: value?.format("HH:mm") })
              }}
              format="hh:mm A"
              plugins={[
                <TimePicker
                  key={`${idx}-wake-up-time`}
                  position="bottom"
                  hideSeconds
                />
              ]}
              style={{
                padding: 20,
                backgroundColor: "#bfdbfe",
                textAlign: "center"
              }}
            />
            <div>
              <p>({s.hoursSleep} hours)</p>
            </div>
            <div className="flex justify-center">
              <TrashIcon onClick={() => onDelete(s.id)} />
            </div>
          </div>
          <hr className="border-blue-500" />
        </>
      ))}
      <div className="my-2 text-center">
        <span>Total hours sleep: </span>
        <span>{totalHoursSleep}</span>
      </div>
      <div className="w-fit m-auto">
        <button className="styled-button" onClick={() => addSleep()}>
          Add Sleep
        </button>
      </div>
    </>
  )
}
