"use client"

import { addDays, format } from "date-fns"
import { trpc } from "~/utils/trpc"

export default function GoalsPage() {
  const todayObject = new Date()
  const today = format(todayObject, "yyyy-MM-dd")

  const tomorrowObject = addDays(todayObject, 1)
  const tomorrow = format(tomorrowObject, "yyyy-MM-dd")

  const { data: dailyGoals, isLoading: isDailyGoalsLoading } =
    trpc.goals.daily.useQuery({ date: today })
  const { data: tomorrowGoals, isLoading: isTomorrowGoalsLoading } =
    trpc.goals.daily.useQuery({ date: tomorrow })

  const createGoalMutation = trpc.goals.createDaily.useMutation()

  const handleAddGoal = () => {
    createGoalMutation.mutate({
      date: today,
      goal: ""
    })
  }

  return (
    <div>
      <div className="text-outline-bold text-6xl text-center py-6">Goals</div>
      <div className="container-transparent">
        <div>
          <div>
            {dailyGoals?.map((goal) => <div key={goal.id}>{goal.goal}</div>)}
          </div>
          <div>
            <button onClick={handleAddGoal}>Add Goal</button>
          </div>
        </div>
      </div>
    </div>
  )
}
