import { Input } from "~/components/ui/input"
import { EntryState, useJournalStore } from "~/store";

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

export default function SubstanceUseEntry({ date, onSave }: {date?: string; onSave: (saveObj: Partial<EntryState>) => void}) {
  const substances = useJournalStore((store) => store.entries.find((e) => e.date === date)?.substances) || []

  const handleSubmit = (substance: string, value: number) => {
    const newSubstances = [...substances]
    const oldSubstance = newSubstances.find((s) => s.substance === substance)
    if (oldSubstance) {
      newSubstances.filter((s) => s.substance !== substance)
      newSubstances.push({substance, value})
    } else {
      newSubstances.push({substance, value})
    }
    onSave({substances: newSubstances})
  }

  return (
    <div className="container-transparent">
      <div className="container-title">Substance Use</div>
      <div className="grid grid-cols-2 gap-4">
        {allSubstances.map((s) => (
          <div className="flex items-center gap-2">
            <Input type="number" value={substances.find((sub) => sub.substance === s)?.value} onChange={(e) => handleSubmit(s, parseInt(e.target.value))} className="max-w-20 bg-[--primary]" /><span>{s}</span>
          </div>
        ))}
      </div>
    </div>
  )
}