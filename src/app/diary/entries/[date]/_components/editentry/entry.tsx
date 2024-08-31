import { format } from "date-fns"
import { useParams } from "next/navigation"
import { useCallback, useEffect, useMemo, useState } from "react"
import { debounce, trpc } from "~/utils/trpc"

export default function Entry() {
  const { date } = useParams()
  const utils = trpc.useUtils()

  if (!date || typeof date !== "string") return null

  const { data: content, isLoading } = trpc.content.one.useQuery({ date })

  const { data: entry, isLoading: isLoadingEntry } = trpc.entries.one.useQuery({
    date
  })

  if (!entry && !isLoadingEntry) throw new Error("Entry not found")

  const [contentValue, setContentValue] = useState(content ?? [])

  useEffect(() => {
    setContentValue(content?.sort((a, b) => a.id - b.id) ?? [])
  }, [content])

  const createMutation = trpc.content.post.useMutation({
    onSuccess: () => {
      utils.content.invalidate()
    }
  })

  const updateMutation = trpc.content.put.useMutation()

  const create = () => {
    createMutation.mutate({ date, entryId: entry!.id })
  }

  const update = debounce((id: number, content?: string) => {
    updateMutation.mutate({ id, content })
  }, 500)

  const submit = useCallback((id?: number, content?: string) => {
    if (id) {
      update(id, content)
    } else {
      create()
    }
  }, [])

  const onChange = useCallback(
    (id?: number, content?: string) => {
      submit(id, content)

      const newContent = [...contentValue].map((c) => {
        if (c.id === id) {
          return { ...c, content: content ?? null }
        }
        return c
      })
      setContentValue([...newContent])
    },
    [[...contentValue]]
  )

  if (isLoading) return <div>Loading...</div>

  return (
    <>
      {contentValue?.map((c, idx) => (
        <div key={idx} className="mt-4">
          <h2>{format(new Date(c.createdAt), "hh:mm a")}</h2>
          <textarea
            className="w-full p-4 bg-yellow-200 rounded-lg h-60"
            value={c.content ?? ""}
            onChange={(e) => onChange(c.id, e.target.value)}
          />
        </div>
      ))}
      <div className="w-fit m-auto my-4">
        <button className="styled-button m-auto" onClick={() => onChange()}>
          Add Entry
        </button>
      </div>
    </>
  )
}
