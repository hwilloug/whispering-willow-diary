"use client"

import { useRouter } from "next/navigation"
import { trpc } from "~/utils/trpc"

export default function CreateEntryButton({
  date
}: Readonly<{ date: string }>) {
  const utils = trpc.useUtils()
  const router = useRouter()

  const mutation = trpc.entries.post.useMutation({
    onSuccess: async () => {
      await utils.entries.invalidate()
      router.push(`/diary/entries/${date}?edit=true`)
    }
  })

  const handleCreate = () => {
    mutation.mutate({ date })
  }

  return (
    <button
      className="styled-button"
      disabled={mutation.isPending}
      onClick={handleCreate}
    >
      Create Entry
    </button>
  )
}
