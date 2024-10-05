import { useParams } from "next/navigation"
import { trpc } from "~/utils/trpc"
import DailyQuestionEntry from "../editentry/dailyquestionentry"

export default function DailyQuestionContent({
  isEditMode
}: {
  isEditMode: boolean
}) {
  const { date } = useParams()

  if (!date || typeof date !== "string") return null

  const { data, isLoading } = trpc.answer.one.useQuery({ date })

  return (
    <div className="bg-blue-300 rounded-xl p-4">
      <h5 className="text-outline-bold text-2xl text-center my-4">
        Daily Question
      </h5>
      {isEditMode ? (
        <DailyQuestionEntry />
      ) : !isLoading && !data ? (
        <div className="text-center m-4">None</div>
      ) : (
        <>
          <div className="text-center text-lg m-4">
            {data?.question.question}
          </div>
          <div className="text-center m-4">{data?.answer}</div>
        </>
      )}
    </div>
  )
}
