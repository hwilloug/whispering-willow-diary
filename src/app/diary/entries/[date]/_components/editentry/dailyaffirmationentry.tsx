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

  const updateMutation = trpc.affirmation.put.useMutation()

  const update = useCallback(
    debounce((id: number, content: string) => {
      updateMutation.mutate({ id, content })
    }, 500),
    []
  )

  const create = debounce((content: string) => {
    createMutation.mutate({ date, entryId: entry!.id, content })
  }, 500)

  const submit = useCallback(
    (value: string) => {
      if (affirmation?.id) {
        update(affirmation.id, value)
      } else {
        create(value)
      }
    },
    [affirmation?.id]
  )

  const onChange = (value: string) => {
    setAffirmationContent(value)
    submit(value)
  }

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
