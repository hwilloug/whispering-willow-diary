import { useParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { debounce, trpc } from "~/utils/trpc"

export default function DailyAffirmationEntry() {
  const { date } = useParams()
  const utils = trpc.useUtils()

  if (!date || typeof date !== "string") throw new Error("Invalid date")

  const { data: entry, isLoading: isLoadingEntry } = trpc.entries.one.useQuery({
    date
  })
  if (entry === undefined && !isLoadingEntry) throw new Error("Invalid entry")

  const { data: affirmation, isLoading } = trpc.affirmation.one.useQuery({
    date
  })

  const [affirmationContent, setAffirmationContent] = useState(
    affirmation?.affirmation
  )

  useEffect(() => {
    setAffirmationContent(affirmation?.affirmation)
  }, [affirmation])

  const createMutation = trpc.affirmation.post.useMutation({
    onSuccess: async () => {
      await utils.affirmation.invalidate()
    }
  })

  const updateMutation = trpc.affirmation.put.useMutation({
    onSuccess: async () => {
      await utils.affirmation.invalidate()
    }
  })

  const submitDebounced = debounce((value: string) => {
    if (affirmation?.id !== undefined) {
      updateMutation.mutate({ id: affirmation.id, content: value })
    } else {
      createMutation.mutate({ date, entryId: entry!.id, content: value })
    }
  }, 500)

  const onChange = useCallback((value: string) => {
    setAffirmationContent(value)
    submitDebounced(value)
  }, [])

  return (
    <div>
      {isLoading && <div>Loading...</div>}
      {!isLoading && (
        <textarea
          className="w-full p-4 bg-amber-800 text-white rounded-lg"
          value={affirmationContent}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  )
}
