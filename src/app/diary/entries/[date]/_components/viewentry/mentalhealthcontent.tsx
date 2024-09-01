import { useParams } from "next/navigation"
import MentalHealthEntry from "../editentry/mentalhealthentry"
import { trpc } from "~/utils/trpc"

export default function MentalHealthContent({
  isEditMode
}: {
  isEditMode: boolean
}) {
  const { date } = useParams()

  if (!date || typeof date !== "string") return null

  const { data: mentalHealth, isLoading } = trpc.mentalHealth.one.useQuery({
    date
  })

  return (
    <div className="bg-pink-300 rounded-xl p-4 mt-4">
      <h5 className="text-outline-bold text-2xl text-center my-4">
        Mental Health & Behavior
      </h5>
      <div className="flex flex-wrap justify-center gap-4">
        {isEditMode ? (
          <MentalHealthEntry />
        ) : !isLoading && !mentalHealth?.mentalHealth ? (
          <div className="text-center m-4">None</div>
        ) : (
          mentalHealth?.mentalHealth.map((item: string, index: number) => (
            <div key={index}>{item}</div>
          ))
        )}
      </div>
    </div>
  )
}
