import { useParams } from "next/navigation"
import { trpc } from "~/utils/trpc"

export default function MoodContent() {
  const { date } = useParams()

  if (!date || typeof date !== "string") return <div>Invalid date</div>

  const { data, isLoading } = trpc.mood.one.useQuery({ date })

  return (
    <div className="bg-[--primary] rounded-xl">
      <h5 className="text-outline-bold text-2xl text-center my-4">Mood</h5>
      <div className="text-center m-4">{data?.mood}</div>
    </div>
  )
}