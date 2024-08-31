import { useParams } from "next/navigation"
import { useMemo } from "react"
import MultipleSelector from "~/components/ui/multiselect"
import { trpc } from "~/utils/trpc"

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
  "Suicidal Ideation"
]

export default function MentalHealthEntry() {
  const utils = trpc.useUtils()
  const { date } = useParams()

  if (!date || typeof date !== "string") throw new Error("Invalid date")

  const createMutation = trpc.mentalHealth.post.useMutation({
    onSuccess: async () => {
      await utils.mentalHealth.invalidate()
    }
  })

  const updateMutation = trpc.mentalHealth.put.useMutation({
    onSuccess: async () => {
      await utils.mentalHealth.invalidate()
    }
  })

  const { data: mentalHealth, isLoading } = trpc.mentalHealth.one.useQuery({
    date
  })

  const { data: entry, isLoading: entryIsLoading } = trpc.entries.one.useQuery({
    date
  })

  if (!entryIsLoading && entry === undefined) throw new Error("Invalid entry")

  const mentalHealthValue = useMemo(() => {
    return mentalHealth?.mentalHealth.map((s) => ({ label: s, value: s })) ?? []
  }, [mentalHealth])

  const update = (value: string[]) => {
    updateMutation.mutate({
      id: mentalHealth!.id,
      content: value
    })
  }

  const add = (value: string[]) => {
    createMutation.mutate({
      date,
      entryId: entry!.id,
      content: value
    })
  }

  const onChange = (value: string[]) => {
    if (mentalHealth?.id) {
      update(value)
    } else {
      add(value)
    }
  }

  return (
    <MultipleSelector
      className="bg-pink-200"
      badgeClassName="bg-[--primary-dark]"
      value={mentalHealthValue}
      onChange={(e) => onChange(e.map((s) => s.value))}
      defaultOptions={mentalHealthSymptoms.map((s) => ({ label: s, value: s }))}
    />
  )
}
