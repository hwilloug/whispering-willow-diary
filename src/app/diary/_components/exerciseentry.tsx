import { Input } from "~/components/ui/input";
import { EntryState, useJournalStore } from "~/store";
import { trpc } from "~/utils/trpc";

export default function ExerciseEntry({ date }: {date: string}) {
  const { data: exercise, isLoading } = trpc.exercise.one.useQuery({ date })

  return (
    <div className="container-transparent">
      <div className="container-title">Exercise</div>
      <div className="flex items-center gap-2 justify-center mt-4"><Input type="number" value={exercise?.exercise} className="w-32 bg-[--primary]" /><span>minutes</span></div>
    </div>
  )
}