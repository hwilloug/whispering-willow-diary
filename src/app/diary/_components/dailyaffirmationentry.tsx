import { Input } from "~/components/ui/input";
import { EntryState, useJournalStore } from "~/store";

export default function DailyAffirmationEntry({ date, onSave }: {date?: string; onSave: (saveObj: Partial<EntryState>) => void}) {
  const affirmation = useJournalStore((store) => store.entries.find((e) => e.date === date)?.affirmation)
  return (
    <div className="container-transparent">
      <div className="container-title mb-4">Daily Affirmation</div>
      <div>
        <textarea className="w-full p-4 bg-[--primary]" value={affirmation} onChange={(e) => onSave({affirmation: e.target.value})} />
      </div>
    </div>
  )
}