import { format } from "date-fns"
import { useParams } from "next/navigation"
import { useCallback, useEffect, useMemo, useState } from "react"
import TrashIcon from "~/app/diary/_components/icons/trashicon"
import { debounce, trpc } from "~/utils/trpc"

export default function Entry() {
  const { date } = useParams()
  const utils = trpc.useUtils()

  if (!date || typeof date !== "string") throw new Error("Invalid date")

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
    onSuccess: async () => {
      await utils.content.invalidate()
    }
  })

  const updateMutation = trpc.content.put.useMutation()

  const deleteMutatoin = trpc.content.delete.useMutation({
    onSuccess: async () => {
      await utils.content.invalidate()
    }
  })

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

  const onDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this entry?")) return

    const newContent = contentValue.filter((c) => c.id !== id)
    setContentValue([...newContent])
    deleteMutatoin.mutate({ id })
  }

  if (isLoading) return <div>Loading...</div>

  return (
    <>
      {contentValue?.map((c, idx) => (
        <div key={idx} className="mt-9">
          <div className="flex justify-between m-2">
            <h2 className="font-bold">
              {format(new Date(c.createdAt), "h:mm a")}
            </h2>
            <TrashIcon
              className="cursor-pointer"
              onClick={() => onDelete(c.id)}
            />
          </div>
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
