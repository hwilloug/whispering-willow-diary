"use client"

import { trpc } from "~/utils/trpc"

export function Entries() {
  const { data: entries, isLoading: entriesLoading } =
    trpc.entries.all.useQuery()

  return (
    <div className="container-transparent">
      <div className="container-title">Entries</div>
      {entriesLoading ? (
        <div>Loading...</div>
      ) : (
        entries
          ?.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          .slice(0, 5)
          .map((entry) => <div key={entry.id}>{entry.date}</div>)
      )}
    </div>
  )
}
