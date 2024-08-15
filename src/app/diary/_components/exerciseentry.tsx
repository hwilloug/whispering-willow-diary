import { Input } from "~/components/ui/input";
import { EntryState } from "~/store";

export default function ExerciseEntry({ date, onSave }: {date?: string; onSave: (saveObj: Partial<EntryState>) => void}) {
  return (
    <div className="container-transparent">
      <div className="container-title">Exercise</div>
      <div className="flex items-center gap-2 justify-center mt-4"><Input type="number" className="w-32 bg-[--primary]" /><span>minutes</span></div>
    </div>
  )
}