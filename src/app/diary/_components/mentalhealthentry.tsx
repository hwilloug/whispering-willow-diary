import MultipleSelector from "~/components/ui/multiselect"
import { EntryState } from "~/store";

export const mentalHealthSymptoms = [
  "Anxiety",
  "Avoidance",
  "Depression",
  "Hypomania",
  "No Focus",
  "Hyper-fixation",
  "Irritability",
  "Paranoia",
  "Low Appetite",
  "Food Restriction",
  "Pressured Speech",
  "Sociability Up",
  "Sociability Down",
  "Libido Up",
  "Libido Down",
  "Reckless Behavior",
  "Fatigue",
  "Illusions of Grandeur",
  "Low Self-Esteem",
  "Reckless Spending",
  "Suicidal Ideation",
]

export default function MentalHealthEntry({ date, onSave }: {date?: string; onSave: (saveObj: Partial<EntryState>) => void}) {
  return (
    <div className="container-transparent">
      <div className="container-title">Mental Health & Behavior</div>
      <MultipleSelector className="bg-[--primary]" defaultOptions={mentalHealthSymptoms.map((s) => ({ label: s, value: s}))} />
    </div>
  )
}