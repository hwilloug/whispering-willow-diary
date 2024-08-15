import { Input } from "~/components/ui/input"
import { EntryState } from "~/store";

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
  return (
    <div className="container-transparent">
      <div className="container-title">Substance Use</div>
      <div className="grid grid-cols-2 gap-4">
        {allSubstances.map((s) => (
          <div className="flex items-center gap-2">
            <Input type="number" className="max-w-20 bg-[--primary]" /><span>{s}</span>
          </div>
        ))}
      </div>
    </div>
  )
}