import { useParams } from "next/navigation"
import FeelingsEntry from "~/app/diary/_components/feelingsentry"
import { trpc } from "~/utils/trpc"

export default function FeelingsContent({ isEditMode }: { isEditMode: boolean }) {
  const { date } = useParams()

  if (!date || typeof date !== "string") return null

  const { data, isLoading } = trpc.feelings.one.useQuery({ date })

  return (
    <div className="bg-purple-300 rounded-xl mt-4 p-4">
      <h5 className="text-outline-bold text-2xl text-center my-4">Feelings</h5>
      <div className="flex flex-wrap justify-center gap-4">{
        isEditMode ? (
          <FeelingsEntry date={date} />
        ) : !isLoading && !data?.feelings ? (
          <div className="text-center m-4">None</div>
        ) : (
          data?.feelings.map((item, index) => (
            <div key={index}>{item}</div>
          ))
        )
      }</div>
    </div>
  )
}