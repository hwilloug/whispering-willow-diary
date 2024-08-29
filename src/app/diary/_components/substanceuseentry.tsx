import { Input } from "~/components/ui/input"
import { EntryState, useJournalStore } from "~/store";
import { trpc } from "~/utils/trpc";

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
  "Other",
]

export default function SubstanceUseEntry({ date }: {date: string}) {
  const { data: substances, isLoading } = trpc.substances.one.useQuery({ date })


  return (
    <div className="container-transparent">
      <div className="container-title">Substance Use</div>
      <div className="grid grid-cols-2 gap-4">
        {allSubstances.map((s) => {
          const substance = substances?.find((substance) => substance.substance === s)
          return (
            <div className="flex items-center gap-2" key={s}>
              <Input type="number" value={substance?.amount}  className="max-w-20 bg-[--primary]" /><span>{s}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}