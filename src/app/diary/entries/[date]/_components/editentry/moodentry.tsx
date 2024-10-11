import { useMemo, useState, useEffect, useCallback } from "react"
import FaceIcon from "~/app/diary/_components/icons/faceicon"
import { Slider } from "~/components/ui/slider"
import { cn } from "~/lib/utils"
import { trpc } from "~/utils/trpc"
import { debounce } from "lodash"

export default function MoodEntry({ date }: { date: string }) {
  const { data: mood, isLoading } = trpc.mood.one.useQuery({ date })
  const { data: entry, isLoading: isLoadingEntry } = trpc.entries.one.useQuery({
    date
  })
  const utils = trpc.useUtils()

  const [localMood, setLocalMood] = useState(mood?.mood || 0)

  useEffect(() => {
    if (mood?.mood !== undefined) {
      setLocalMood(mood.mood)
    }
  }, [mood?.mood])

  if (entry === undefined && !isLoadingEntry) throw new Error("Invalid entry")

  const createMutation = trpc.mood.post.useMutation({
    onSuccess: async () => {
      await utils.mood.invalidate()
    }
  })

  const updateMutation = trpc.mood.put.useMutation({
    onSuccess: async () => {
      await utils.mood.invalidate()
    }
  })

  const debouncedMoodChange = useCallback(
    debounce(
      (newMood: number) => {
        if (mood?.id !== undefined) {
          updateMutation.mutate({ id: mood.id, mood: newMood })
        } else if (entry?.id) {
          createMutation.mutate({ date, entryId: entry.id, mood: newMood })
        }
      },
      1000,
      { trailing: true }
    ),
    []
  )

  const onChange = (value: number[]) => {
    if (value.length === 0) return
    const newMood = value[0]
    if (newMood === undefined) return
    setLocalMood(newMood)
    debouncedMoodChange(newMood)
  }

  const sliderClassName = useMemo(() => {
    if (localMood > 9) return cn("bg-purple-700")
    else if (localMood > 7) return cn("bg-green-600")
    else if (localMood > 5) return cn("bg-green-500")
    else if (localMood > 3) return cn("bg-blue-500")
    else if (localMood > 1) return cn("bg-orange-500")
    else return cn("bg-red-500")
  }, [localMood])

  return (
    <div className=" mt-2 bg-[--primary] mx-auto rounded-lg">
      <div className="w-full">
        <Slider
          className={sliderClassName}
          value={[localMood]}
          max={10}
          step={1}
          onValueChange={onChange}
        />
      </div>
      <div className="w-full flex justify-between gap-4 mt-2">
        <FaceIcon value={0} color="red" variant="distressed" />
        <FaceIcon value={1} color="orange" variant="bad" />
        <FaceIcon value={2} color="#decd4e" variant="neutral" />
        <FaceIcon value={2} color="#8cd18d" variant="neutral" />
        <FaceIcon value={3} color="green" variant="happy" />
        <FaceIcon value={4} color="purple" variant="ecstatic" />
      </div>
    </div>
  )
}
