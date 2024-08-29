import { useParams } from "next/navigation"
import { trpc } from "~/utils/trpc"

export default function ExerciseContent() {
  const { date } = useParams()

  if (!date || typeof date !== "string") return null

  const { data, isLoading } = trpc.exercise.one.useQuery({ date })

  return (
    <div className="bg-lime-300 my-4 p-4 rounded-xl">
      <h5 className="text-outline-bold text-2xl text-center my-4">Exercise</h5>
      <div className="text-center my-4">{data?.exercise} minutes</div>
    </div>
  )
}