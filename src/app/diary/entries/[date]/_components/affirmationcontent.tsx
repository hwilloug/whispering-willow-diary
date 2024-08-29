import { useParams } from "next/navigation"
import DailyAffirmationEntry from "~/app/diary/_components/dailyaffirmationentry"
import { trpc } from "~/utils/trpc"

export default function AffirmationContent({ isEditMode }: { isEditMode: boolean }) {
  const { date } = useParams()

  if (!date || typeof date !== "string") return <div>Invalid date</div>

  const { data, isLoading } = trpc.affirmation.one.useQuery({ date })

  return (
    <div className="bg-amber-900 text-white text-xl p-10 my-4 text-center rounded-lg">
      <h5 className="text-outline-bold-inverted text-3xl">🌸 Affirmation 🌸</h5>
      { 
        isEditMode ? (
          <DailyAffirmationEntry date={date} />
        ) : !isLoading && !data?.affirmation ? (
          <p className="mt-4">None</p>
        ) : (
          <p className="mt-4">{data?.affirmation}</p>
        )
      }
    </div>
  )
}