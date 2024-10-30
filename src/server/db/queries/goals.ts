import "server-only"

import { db } from "../models"
import { auth } from "@clerk/nextjs/server"
import {
  dailyGoals,
  monthlyGoals,
  reflections,
  weeklyGoals,
  yearlyGoals
} from "../models/goals"
import { eq } from "drizzle-orm"

export async function getDailyGoals(date: string) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  const goals = await db.query.dailyGoals.findMany({
    where: (model, { eq, and }) =>
      and(eq(model.userId, user.userId), eq(model.date, date)),
    with: {
      reflections: true
    }
  })

  return goals
}

export async function createDailyGoal(goal: string, date: string) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  const dbGoal = await db.insert(dailyGoals).values({
    userId: user.userId,
    goal,
    date
  })

  return dbGoal
}

export async function updateDailyGoal(goalId: number, goal: string) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  const dbGoal = await db
    .update(dailyGoals)
    .set({
      goal
    })
    .where(eq(dailyGoals.id, goalId))

  return dbGoal
}

export async function deleteDailyGoal(goalId: number) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  const dbGoal = await db.delete(dailyGoals).where(eq(dailyGoals.id, goalId))

  return dbGoal
}

export async function getWeeklyGoals(week: number, year: number) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  const goals = await db.query.weeklyGoals.findMany({
    where: (model, { eq, and }) =>
      and(
        eq(model.userId, user.userId),
        eq(model.week, week),
        eq(model.year, year)
      ),
    with: {
      reflections: true
    }
  })

  return goals
}

export async function createWeeklyGoal(
  goal: string,
  week: number,
  year: number
) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  const dbGoal = await db.insert(weeklyGoals).values({
    userId: user.userId,
    goal,
    week,
    year
  })

  return dbGoal
}

export async function updateWeeklyGoal(goalId: number, goal: string) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  const dbGoal = await db
    .update(weeklyGoals)
    .set({
      goal
    })
    .where(eq(weeklyGoals.id, goalId))

  return dbGoal
}

export async function deleteWeeklyGoal(goalId: number) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  const dbGoal = await db.delete(weeklyGoals).where(eq(weeklyGoals.id, goalId))

  return dbGoal
}

export async function getMonthlyGoals(month: number, year: number) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  const goals = await db.query.monthlyGoals.findMany({
    where: (model, { eq, and }) =>
      and(
        eq(model.userId, user.userId),
        eq(model.month, month),
        eq(model.year, year)
      ),
    with: {
      reflections: true
    }
  })

  return goals
}

export async function createMonthlyGoal(
  goal: string,
  month: number,
  year: number
) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  const dbGoal = await db.insert(monthlyGoals).values({
    userId: user.userId,
    goal,
    month,
    year
  })

  return dbGoal
}

export async function updateMonthlyGoal(goalId: number, goal: string) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  const dbGoal = await db
    .update(monthlyGoals)
    .set({
      goal
    })
    .where(eq(monthlyGoals.id, goalId))

  return dbGoal
}

export async function deleteMonthlyGoal(goalId: number) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  const dbGoal = await db
    .delete(monthlyGoals)
    .where(eq(monthlyGoals.id, goalId))

  return dbGoal
}

export async function getYearlyGoals(year: number) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  const goals = await db.query.yearlyGoals.findMany({
    where: (model, { eq, and }) =>
      and(eq(model.userId, user.userId), eq(model.year, year)),
    with: {
      reflections: true
    }
  })

  return goals
}

export async function createYearlyGoal(goal: string, year: number) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  const dbGoal = await db.insert(yearlyGoals).values({
    userId: user.userId,
    goal,
    year
  })

  return dbGoal
}

export async function updateYearlyGoal(goalId: number, goal: string) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  const dbGoal = await db
    .update(yearlyGoals)
    .set({
      goal
    })
    .where(eq(yearlyGoals.id, goalId))

  return dbGoal
}

export async function deleteYearlyGoal(goalId: number) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  const dbGoal = await db.delete(yearlyGoals).where(eq(yearlyGoals.id, goalId))

  return dbGoal
}

export async function getReflections(goalId: number) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  const reflections = await db.query.reflections.findMany({
    where: (model, { eq, and }) =>
      and(eq(model.userId, user.userId), eq(model.goalId, goalId))
  })

  return reflections
}

export async function createReflection(goalId: number, reflection: string) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  const dbReflection = await db.insert(reflections).values({
    userId: user.userId,
    date: new Date().toISOString(),
    reflection,
    goalId
  })

  return dbReflection
}

export async function updateReflection(
  reflectionId: number,
  reflection: string
) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  const dbReflection = await db
    .update(reflections)
    .set({
      reflection
    })
    .where(eq(reflections.id, reflectionId))

  return dbReflection
}

export async function deleteReflection(reflectionId: number) {
  const user = auth()

  if (!user.userId) throw new Error("Unauthorized")

  const dbReflection = await db
    .delete(reflections)
    .where(eq(reflections.id, reflectionId))

  return dbReflection
}
