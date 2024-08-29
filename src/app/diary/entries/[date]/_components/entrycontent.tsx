import { useParams } from "next/navigation"
import { trpc } from "~/utils/trpc"

export default function EntryContent() {
  const { date } = useParams()

  if (!date || typeof date !== "string") return null

  const { data, isLoading } = trpc.content.one.useQuery({ date })


  return (
    <div className="bg-amber-300 rounded-xl p-2">
      <h5 className="text-outline-bold text-2xl text-center my-4">Entries</h5>
      {
        !isLoading && data?.length === 0 ? (
          <div className="text-center m-4">None</div>
        ) : (
          data?.map((entry) => (
            <div key={entry.id} className="text-justify m-4">{entry.content}</div>
          ))
        )
      }
    </div>
  )
}