import MultipleSelector, { Option } from "~/components/ui/multiselect"
import { EntryState, useJournalStore } from "~/store";

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
  const mentalHealth = useJournalStore((store) => store.entries.find((e) => e.date === date)?.mentalHealth) || []

  const mentalHealthOptions = mentalHealth.map((s) => ({ label: s, value: s}))

  const handleSubmit = (options: Option[]) => {
    onSave({mentalHealth: options.map((o) => o.value)})
  }

  return (
    <div className="container-transparent">
      <div className="container-title">Mental Health & Behavior</div>
      <MultipleSelector className="bg-[--primary]" badgeClassName="bg-[--primary-dark]" value={mentalHealthOptions} defaultOptions={mentalHealthSymptoms.map((s) => ({ label: s, value: s}))} onChange={(e) => handleSubmit(e)} />
    </div>
  )
}