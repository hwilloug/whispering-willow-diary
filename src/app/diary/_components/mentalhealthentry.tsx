import MultipleSelector, { Option } from "~/components/ui/multiselect"
import { EntryState, useJournalStore } from "~/store";
import { trpc } from "~/utils/trpc";

// TODO - move this to user settings
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

export default function MentalHealthEntry({ date }: {date: string}) {
  const { data: mentalHealth, isLoading } = trpc.mentalHealth.one.useQuery({ date })

  const mentalHealthOptions = mentalHealth?.mentalHealth.map((s) => ({ label: s, value: s}))

  return (
    <div className="container-transparent">
      <div className="container-title">Mental Health & Behavior</div>
      <MultipleSelector className="bg-[--primary]" badgeClassName="bg-[--primary-dark]" value={mentalHealthOptions} defaultOptions={mentalHealthSymptoms.map((s) => ({ label: s, value: s}))} />
    </div>
  )
}