"use client"

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
      <div className="w-fit m-auto">
        <button className="styled-button" onClick={() => setGoals([...goals, {value: "", checked: false}])}>Add Goal</button>
      </div>
    </div>
  )
}