import { useParams } from "next/navigation"
import MoodEntry from "../editentry/moodentry"
import { trpc } from "~/utils/trpc"
import { getMoodIcon } from "~/app/diary/utils"
import { useMemo } from "react"

export default function MoodContent({ isEditMode }: { isEditMode: boolean }) {
  const { date } = useParams()

  if (!date || typeof date !== "string") throw new Error("Invalid date")

  const { data, isLoading } = trpc.mood.one.useQuery({ date })

  const moodIcon = useMemo(() => getMoodIcon(data?.mood ?? 0), [data?.mood])

  return (
    <div className="bg-[--primary] rounded-xl p-4">
      <h5 className="text-outline-bold text-2xl text-center my-4">Mood</h5>
      {isEditMode ? (
        <MoodEntry date={date} />
      ) : !isLoading && !data ? (
        <div className="text-center m-4">None</div>
      ) : (
        <div className="text-center m-4">{moodIcon}</div>
      )}
    </div>
  )
}
