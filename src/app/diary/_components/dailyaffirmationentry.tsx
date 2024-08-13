import { Input } from "~/components/ui/input";

export default function DailyAffirmationEntry() {
  return (
    <div className="container-transparent">
      <div className="container-title mb-4">Daily Affirmation</div>
      <div>
        <textarea className="w-full p-4 bg-[--primary]" />
      </div>
    </div>
  )
}