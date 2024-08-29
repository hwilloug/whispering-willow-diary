import { useParams } from "next/navigation"
import { trpc } from "~/utils/trpc"

export default function AffirmationContent() {
  const { date } = useParams()

  if (!date || typeof date !== "string") return <div>Invalid date</div>

  const { data, isLoading } = trpc.affirmation.one.useQuery({ date })

  return (
    <div className="bg-amber-900 text-white text-xl p-10 m-4 text-center rounded-lg">
      <h5 className="text-outline-bold-inverted text-3xl">🌸 Affirmation 🌸</h5>
      <p className="mt-4">{data?.affirmation}</p>
    </div>
  )
}