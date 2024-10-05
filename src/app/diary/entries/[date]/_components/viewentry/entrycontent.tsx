import { useParams } from "next/navigation"
import Entry from "../editentry/entry"
import { trpc } from "~/utils/trpc"
import { format } from "date-fns"

export default function EntryContent({ isEditMode }: { isEditMode: boolean }) {
  const { date } = useParams()

  if (!date || typeof date !== "string") return null

  const { data, isLoading } = trpc.content.one.useQuery({ date })

  return (
    <div className="bg-amber-300 rounded-xl mt-4 p-2">
      <h5 className="text-outline-bold text-2xl text-center my-4">Entries</h5>
      {isEditMode ? (
        <Entry />
      ) : !isLoading && data?.length === 0 ? (
        <div className="text-center m-4">None</div>
      ) : (
        data
          ?.sort((a, b) => a.id - b.id)
          .map((entry, idx) => (
            <div key={idx} className="m-6">
              <p className="mb-2">{format(entry.createdAt, "h:mm a")}</p>
              <div
                key={entry.id}
                className="text-justify bg-amber-200 p-4 rounded-lg"
              >
                {entry.content}
              </div>
            </div>
          ))
      )}
    </div>
  )
}
