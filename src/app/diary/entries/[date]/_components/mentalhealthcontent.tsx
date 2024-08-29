import { useParams } from "next/navigation"
import { MentalHealthState } from "~/store"
import { trpc } from "~/utils/trpc"

export default function MentalHealthContent() {
  const { date } = useParams()

  if (!date || typeof date !== "string") return null

  const { data: mentalHealth, isLoading } = trpc.mentalHealth.one.useQuery({ date })

  return (
    <div className="bg-pink-300 rounded-xl p-4 mt-4">
      <h5 className="text-outline-bold text-2xl text-center my-4">Mental Health</h5>
      <div className="m-4 flex flex-wrap justify-center gap-4">{
        mentalHealth?.mentalHealth.map((item: string, index: number) => (
          <div key={index}>{item}</div>
        ))
      }</div>
    </div>
  )
}