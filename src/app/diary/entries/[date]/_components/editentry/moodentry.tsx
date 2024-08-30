import FaceIcon from "~/app/diary/_components/icons/faceicon"
import { trpc } from "~/utils/trpc"

export default function MoodEntry({ date }: { date: string }) {
  const { data: mood, isLoading } = trpc.mood.one.useQuery({ date })

  const activeMoodStyle =
    "outline outline-offset-2 outline-[--primary-dark] rounded-full"

  return (
    <div className="flex justify-center mt-2 gap-4 p-4 bg-[--primary] w-fit mx-auto rounded-lg">
      <FaceIcon
        value={0}
        className={mood?.mood === 0 ? activeMoodStyle : ""}
        color="red"
        variant="distressed"
      />
      <FaceIcon
        value={1}
        className={mood?.mood === 1 ? activeMoodStyle : ""}
        color="orange"
        variant="bad"
      />
      <FaceIcon
        value={2}
        className={mood?.mood === 2 ? activeMoodStyle : ""}
        color="blue"
        variant="neutral"
      />
      <FaceIcon
        value={3}
        className={mood?.mood === 3 ? activeMoodStyle : ""}
        color="green"
        variant="happy"
      />
      <FaceIcon
        value={4}
        className={mood?.mood === 4 ? activeMoodStyle : ""}
        color="purple"
        variant="ecstatic"
      />
    </div>
  )
}
