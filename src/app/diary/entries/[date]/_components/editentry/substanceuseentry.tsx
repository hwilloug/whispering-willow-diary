import { useParams } from "next/navigation"
import { Input } from "~/components/ui/input"
import { EntryState, useJournalStore } from "~/store"
import { trpc } from "~/utils/trpc"

export const allSubstances = [
  "Caffeine",
  "Nicotine (Cigarrette)",
  "Nicotine (Vape)",
  "Alcohol",
  "Marijuana (Flower)",
  "Marijuana (Concentrate)",
  "Marijuana (Edible)",
  "Cocaine",
  "Mushrooms",
  "Adderall",
  "Other"
]

export default function SubstanceUseEntry() {
  const { date } = useParams()
  const utils = trpc.useUtils()

  if (!date || typeof date !== "string") throw new Error("Invalid date")

  const { data: substances, isLoading } = trpc.substances.one.useQuery({
    date
  })

  const { data: entry, isLoading: isLoadingEntry } = trpc.entries.one.useQuery({
    date
  })

  if (!entry && !isLoadingEntry) throw new Error("Entry not found")

  const createMutation = trpc.substances.post.useMutation({
    onSuccess: async () => {
      await utils.substances.invalidate()
    }
  })

  const updateMutation = trpc.substances.put.useMutation({
    onSuccess: async () => {
      await utils.substances.invalidate()
    }
  })

  const create = (substance: string, amount: number) => {
    createMutation.mutate({ date, entryId: entry!.id, name: substance, amount })
  }

  const update = (id: number, amount: number) => {
    updateMutation.mutate({ id, amount })
  }

  const onChange = ({
    id,
    substance,
    amount
  }: {
    id?: number
    substance: string
    amount: number
  }) => {
    if (id) {
      update(id, amount)
    } else {
      create(substance, amount)
    }
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 m-auto w-fit">
      {allSubstances.map((s) => {
        const substance = substances?.find(
          (substance) => substance.substance === s
        )
        return (
          <div className="flex items-center gap-2" key={s}>
            <Input
              type="number"
              value={substance?.amount}
              className="max-w-20 bg-red-400"
              onChange={(e) =>
                onChange({
                  id: substance?.id,
                  substance: s,
                  amount: parseInt(e.target.value)
                })
              }
            />
            <span>{s}</span>
          </div>
        )
      })}
    </div>
  )
}
