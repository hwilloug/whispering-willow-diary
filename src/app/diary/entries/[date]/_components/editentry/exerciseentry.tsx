import { useParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { Input } from "~/components/ui/input"
import { debounce, trpc } from "~/utils/trpc"

export default function ExerciseEntry() {
  const { date } = useParams()
  const utils = trpc.useUtils()

  if (!date || typeof date !== "string") throw new Error("Invalid date")

  const { data: exercise, isLoading } = trpc.exercise.one.useQuery({ date })

  const { data: entry, isLoading: isLoadingEntry } = trpc.entries.one.useQuery({
    date
  })
  if (entry === undefined && !isLoadingEntry) throw new Error("Invalid entry")

  const [exerciseContent, setExerciseContent] = useState(exercise?.exercise)

  useEffect(() => {
    setExerciseContent(exercise?.exercise)
  }, [exercise])

  const createMutation = trpc.exercise.post.useMutation({
    onSuccess: async () => {
      await utils.exercise.invalidate()
    }
  })

  const updateMutation = trpc.exercise.put.useMutation({
    onSuccess: async () => {
      await utils.exercise.invalidate()
    }
  })

  const submitDebounced = debounce((value: number) => {
    if (exercise?.id !== undefined) {
      updateMutation.mutate({ id: exercise.id, minutes: value })
    } else {
      createMutation.mutate({ date, entryId: entry!.id, content: value })
    }
  }, 500)

  const onChange = useCallback((value: number) => {
    setExerciseContent(value)
    submitDebounced(value)
  }, [])

  return (
    <div className="flex items-center gap-2 justify-center mt-4">
      <Input
        type="number"
        value={exerciseContent}
        className="w-32 bg-lime-100"
        onChange={(e) => onChange(parseInt(e.target.value))}
      />
      <span>minutes</span>
    </div>
  )
}
