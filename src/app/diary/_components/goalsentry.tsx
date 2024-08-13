import { useState } from "react"
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input"

export default function GoalsEntry({ cadence }: Readonly<{cadence: "Daily" | "Weekly" | "Monthly" | "Yearly"}>) {

  const [goals, setGoals] = useState<{value: string; checked: boolean}[]>([])

  return (
    <div className="container-transparent">
      <div className="container-title mb-4">{cadence} Goal</div>
      <div>
        {goals.map((goal) => (
          <div key={goal.value} className="m-2 grid grid-cols-[auto,1fr] items-center">
            <Checkbox className="bg-white border-0 w-6 h-6 rounded-full mr-2" />
            <Input className="bg-[--primary]" />
          </div>
        ))}
      </div>
      <div className="mb-2 mt-4 w-fit px-8 py-2 border border-[--secondary] hover:text-[--secondary] m-auto rounded-lg bg-[--secondary] text-white hover:bg-transparent">
        <button onClick={() => setGoals([...goals, {value: "", checked: false}])}>Add Goal</button>
      </div>
    </div>
  )
}