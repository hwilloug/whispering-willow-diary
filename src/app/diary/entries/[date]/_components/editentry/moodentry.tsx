import FaceIcon from "~/app/diary/_components/icons/faceicon"
import { trpc } from "~/utils/trpc"

export default function MoodEntry({ date }: { date: string }) {
  const { data: mood, isLoading } = trpc.mood.one.useQuery({ date })
  const { data: entry, isLoading: isLoadingEntry } = trpc.entries.one.useQuery({
    date
  })
  const utils = trpc.useUtils()

  if (entry === undefined && !isLoadingEntry) throw new Error("Invalid entry")

  const createMutation = trpc.mood.post.useMutation({
    onSuccess: async () => {
      await utils.mood.invalidate()
    }
  })

  const updateMutation = trpc.mood.put.useMutation({
    onSuccess: async () => {
      await utils.mood.invalidate()
    }
  })

  const onClick = (value: number) => {
    if (mood?.id !== undefined) {
      updateMutation.mutate({ id: mood.id, mood: value })
    } else {
      createMutation.mutate({ date, entryId: entry!.id, mood: value })
    }
  }

  const activeMoodStyle =
    "outline outline-offset-2 outline-[--primary-dark] rounded-full"

  return (
    <div className="flex justify-center mt-2 gap-4 p-4 bg-[--primary] w-fit mx-auto rounded-lg">
      <FaceIcon
        value={0}
        className={mood?.mood === 0 ? activeMoodStyle : ""}
        color="red"
        variant="distressed"
        onClick={onClick}
      />
      <FaceIcon
        value={1}
        className={mood?.mood === 1 ? activeMoodStyle : ""}
        color="orange"
        variant="bad"
        onClick={onClick}
      />
      <FaceIcon
        value={2}
        className={mood?.mood === 2 ? activeMoodStyle : ""}
        color="blue"
        variant="neutral"
        onClick={onClick}
      />
      <FaceIcon
        value={3}
        className={mood?.mood === 3 ? activeMoodStyle : ""}
        color="green"
        variant="happy"
        onClick={onClick}
      />
      <FaceIcon
        value={4}
        className={mood?.mood === 4 ? activeMoodStyle : ""}
        color="purple"
        variant="ecstatic"
        onClick={onClick}
      />
    </div>
  )
}
