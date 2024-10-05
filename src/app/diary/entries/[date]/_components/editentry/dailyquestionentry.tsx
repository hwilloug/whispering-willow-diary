import { getDate, parse } from "date-fns"
import { useParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { answer } from "~/server/db/models/journal"
import { debounce, trpc } from "~/utils/trpc"

export default function DailyQuestionEntry() {
  const { date } = useParams()
  const utils = trpc.useUtils()

  if (!date || typeof date !== "string") throw new Error("Invalid date")

  const dayOfMonth = getDate(parse(date, "yyyy-MM-dd", new Date()))

  const createMutation = trpc.answer.post.useMutation({
    onSuccess: async () => {
      await utils.answer.invalidate()
    }
  })
  const updateMutation = trpc.answer.put.useMutation()

  const { data, isLoading } = trpc.answer.one.useQuery({ date })
  const { data: question, isLoading: isLoadingQuestion } =
    trpc.question.one.useQuery({ dayOfMonth })
  const { data: entry, isLoading: isLoadingEntry } = trpc.entries.one.useQuery({
    date
  })

  if (!entry && !isLoadingEntry) throw new Error("No xentry found")
  if (!question && !isLoadingQuestion) throw new Error("No question found")

  const [answerContent, setAnswerContent] = useState(data?.answer)

  useEffect(() => {
    setAnswerContent(data?.answer)
  }, [data?.answer])

  const update = debounce((answer: string) => {
    updateMutation.mutate({
      id: data!.id,
      answer
    })
  }, 500)

  const submit = useCallback(
    (entryId: number, questionId: number, answer: string, id?: number) => {
      if (id) {
        update(answer)
      } else {
        createMutation.mutate({
          date,
          entryId: entryId,
          questionId: questionId,
          answer: answer
        })
      }
    },
    []
  )

  const onChange = (value: string) => {
    setAnswerContent(value)
    submit(entry!.id, question!.id, value, data?.id)
  }

  if (isLoading || isLoadingQuestion || isLoadingEntry)
    return <div>Loading...</div>

  return (
    <div>
      <div className="text-center">
        {data?.question.question ?? question?.question}
      </div>
      <textarea
        className="w-full rounded-lg p-2 bg-blue-100"
        value={answerContent}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
