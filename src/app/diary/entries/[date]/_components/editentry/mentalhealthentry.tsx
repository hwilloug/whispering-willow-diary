import { useParams } from "next/navigation"
import { useMemo, useState, useEffect } from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "~/components/ui/accordion"
import { Checkbox } from "~/components/ui/checkbox"
import { trpc } from "~/utils/trpc"

// TODO - move this to user settings
export const mentalHealthSymptoms = {
  Anxiety: [
    "Avoidance",
    "Paranoia",
    "Panic",
    "Shaking",
    "Sweating",
    "Trembling",
    "Nausea",
    "Headache",
    "Fatigue",
    "Difficulty Concentrating",
    "Irritability",
    "Restlessness",
    "Sleep Disturbance",
    "Panic Attacks",
    "Shortness of Breath",
    "Chest Pain",
    "Muscle Tension"
  ],
  Mania: [
    "Pressured Speech",
    "Sociability Up",
    "Libido Up",
    "Reckless Behavior",
    "Illusions of Grandeur",
    "Reckless Spending",
    "Overjoyed",
    "High Energy",
    "Decreased Need for Sleep",
    "Hyper-focus"
  ],
  Depression: [
    "Low Appetite",
    "Sociability Down",
    "Libido Down",
    "Fatigue",
    "Low Self-Esteem",
    "Loss of Interest",
    "Sleeping Too Much",
    "Suicidal Ideation",
    "Thoughts of Death",
    "Feelings of Guilt",
    "Hopelessness",
    "Difficulty Concentrating"
  ],
  Other: ["Food Restriction"]
}

export default function MentalHealthEntry() {
  const utils = trpc.useUtils()
  const { date } = useParams()
  const [openCategories, setOpenCategories] = useState<string[]>([])

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

  useEffect(() => {
    const categoriesToOpen = Object.keys(mentalHealthSymptoms).filter(
      (category) =>
        mentalHealthValue.some((item) =>
          mentalHealthSymptoms[
            category as keyof typeof mentalHealthSymptoms
          ].includes(item.value)
        )
    )
    setOpenCategories((prev) => [...new Set([...prev, ...categoriesToOpen])])
  }, [mentalHealthValue])

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

  const onChange = (value: string[], category: string) => {
    if (mentalHealth?.id) {
      update(value)
    } else {
      add(value)
    }
    if (!openCategories.includes(category)) {
      setOpenCategories((prev) => [...prev, category])
    }
  }

  return (
    <div className="space-y-4">
      {Object.entries(mentalHealthSymptoms).map(([category, symptoms]) => (
        <div key={category} className="border rounded-md overflow-hidden">
          <Accordion
            type="multiple"
            value={openCategories}
            onValueChange={setOpenCategories}
          >
            <AccordionItem value={category}>
              <AccordionTrigger className="px-4 py-2 bg-pink-200 hover:bg-pink-300">
                <h3 className="text-lg font-semibold">{category}</h3>
              </AccordionTrigger>
              <AccordionContent className="p-4">
                {symptoms.map((symptom) => (
                  <div
                    key={symptom}
                    className="flex items-center space-x-2 mb-2"
                  >
                    <Checkbox
                      id={`${category}-${symptom}`}
                      checked={mentalHealthValue.some(
                        (item) => item.value === symptom
                      )}
                      onCheckedChange={(checked) => {
                        const newValues = checked
                          ? [
                              ...mentalHealthValue.map((item) => item.value),
                              symptom
                            ]
                          : mentalHealthValue
                              .filter((item) => item.value !== symptom)
                              .map((item) => item.value)
                        onChange(newValues, category)
                      }}
                    />
                    <label
                      htmlFor={`${category}-${symptom}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {symptom}
                    </label>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      ))}
    </div>
  )
}
