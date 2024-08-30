import { useParams } from "next/navigation"
import { trpc } from "~/utils/trpc"

export default function DailyQuestionContent({ isEditMode }: { isEditMode: boolean }) {
  const { date } = useParams()

  if (!date || typeof date !== "string") return null

  const { data, isLoading } = trpc.question.one.useQuery({ date })

  return (
    <div className="bg-blue-300 rounded-xl my-4 p-4">
      <h5 className="text-outline-bold text-2xl text-center my-4">Daily Question</h5>
      { isEditMode ? (
        <div>TODO: DailyQuestionEntry</div>
      ) : !isLoading && !data ? (
          <div className="text-center m-4">None</div>
        ) : (
          <>
            <div className="text-center text-lg m-4">{data?.question}</div>
            <div className="text-center m-4">{data?.answer}</div>
          </>
        )
      }
    </div>
  )
}