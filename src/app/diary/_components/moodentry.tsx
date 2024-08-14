import { getMyEntry } from "~/server/queries";
import FaceIcon from "./icons/faceicon";
import { EntryState, useJournalStore } from "~/store";

export default function MoodEntry({ date, onSave }: {date?: string; onSave: (saveObj: Partial<EntryState>) => void}) {
  const mood = useJournalStore(state => state.entries.find(entry => entry.date === date))?.mood

  const activeMoodStyle = "b-2 border-[var(--secondary)] rounded-full p-1"

  const submitMood = (mood: number) => {
    onSave({ mood })
  }

  return (
    <div className="container-transparent">
      <div className="container-title">Mood</div>
      <div className="flex justify-center mt-2 gap-4 p-4 bg-[--primary] w-fit mx-auto rounded-lg">
        <FaceIcon value={0} onClick={() => submitMood(0)} className={mood === 0 ? activeMoodStyle : ""} color="red" variant="distressed" />
        <FaceIcon value={1} onClick={() => submitMood(1)} className={mood === 1 ? activeMoodStyle : ""} color="orange" variant="bad" />
        <FaceIcon value={2} onClick={() => submitMood(2)} className={mood === 2 ? activeMoodStyle : ""} color="blue" variant="neutral" />
        <FaceIcon value={3} onClick={() => submitMood(3)} className={mood === 3 ? activeMoodStyle : ""} color="green" variant="happy" />
        <FaceIcon value={4} onClick={() => submitMood(4)} className={mood === 4 ? activeMoodStyle : ""} color="purple" variant="ecstatic" />
      </div>
    </div>
  )
}