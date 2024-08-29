"use client"

import { trpc } from "~/utils/trpc";

export default function CreateEntryButton({date}: Readonly<{date: string}>) {
  const utils = trpc.useUtils()

  const mutation = trpc.entries.post.useMutation({
    onSuccess: () => {
      utils.entries.invalidate()
    }
  })

  const handleCreate = () => {
    mutation.mutate({date})
  }

  return (
    <button className="styled-button" disabled={mutation.isPending} onClick={handleCreate}>Create Entry</button>
  )
}