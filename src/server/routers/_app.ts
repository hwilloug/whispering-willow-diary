import { z } from "zod"
import { initTRPC } from "@trpc/server"
import {
  createEntry,
  deleteEntry,
  getMyEntries,
  getMyEntry
} from "../db/queries/entries"
import {
  createAffirmation,
  getAffirmationByDate,
  updateAffirmation
} from "../db/queries/affirmations"
import {
  createFeelings,
  getFeelingsByDate,
  updateFeelings
} from "../db/queries/feelings"
import {
  createMentalHealth,
  getMentalHealthByDate,
  getMyMentalHealth,
  updateMentalHealth
} from "../db/queries/mentalhealth"
import {
  createSubstances,
  getMySubstances,
  getSubstancesByDate,
  updateSubstance
} from "../db/queries/substances"
import {
  createMood,
  getMoodByDate,
  getMyMoods,
  updateMood
} from "../db/queries/mood"
import {
  createSleep,
  deleteSleep,
  getMySleep,
  getSleepByDate,
  updateSleep
} from "../db/queries/sleep"
import {
  createExercise,
  getExerciseByDate,
  updateExercise
} from "../db/queries/exercise"
import {
  createContent,
  deleteContent,
  getContentByDate,
  updateContent
} from "../db/queries/content"
import {
  createAnswer,
  getAnswerByDate,
  getQuestion,
  updateAnswer
} from "../db/queries/question"
import {
  createAppointment,
  deleteAppointment,
  getMyAppointments,
  updateAppointment
} from "../db/queries/appointments"
import { createNote, deleteNote, updateNote } from "../db/queries/notes"
import {
  createDailyGoal,
  createMonthlyGoal,
  createReflection,
  createWeeklyGoal,
  createYearlyGoal,
  deleteDailyGoal,
  deleteMonthlyGoal,
  deleteReflection,
  deleteWeeklyGoal,
  deleteYearlyGoal,
  getDailyGoals,
  getMonthlyGoals,
  getReflections,
  getWeeklyGoals,
  getYearlyGoals,
  updateDailyGoal,
  updateMonthlyGoal,
  updateReflection,
  updateWeeklyGoal,
  updateYearlyGoal
} from "../db/queries/goals"

const t = initTRPC.create()

export const appRouter = t.router({
  entries: t.router({
    all: t.procedure.query(() => {
      return getMyEntries()
    }),
    post: t.procedure
      .input(
        z.object({
          date: z.string()
        })
      )
      .mutation((opts) => {
        return createEntry(opts.input.date)
      }),
    one: t.procedure
      .input(
        z.object({
          date: z.string()
        })
      )
      .query((opts) => {
        return getMyEntry(opts.input.date)
      }),
    delete: t.procedure
      .input(
        z.object({
          id: z.number()
        })
      )
      .mutation((opts) => {
        return deleteEntry(opts.input.id)
      })
  }),
  affirmation: t.router({
    post: t.procedure
      .input(
        z.object({
          date: z.string(),
          entryId: z.number(),
          content: z.string()
        })
      )
      .mutation((opts) => {
        return createAffirmation(
          opts.input.date,
          opts.input.entryId,
          opts.input.content
        )
      }),
    put: t.procedure
      .input(
        z.object({
          id: z.number(),
          content: z.string()
        })
      )
      .mutation((opts) => {
        return updateAffirmation(opts.input.id, opts.input.content)
      }),
    one: t.procedure
      .input(
        z.object({
          date: z.string()
        })
      )
      .query((opts) => {
        return getAffirmationByDate(opts.input.date)
      })
  }),
  feelings: t.router({
    post: t.procedure
      .input(
        z.object({
          date: z.string(),
          entryId: z.number(),
          content: z.string().array()
        })
      )
      .mutation((opts) => {
        return createFeelings(
          opts.input.date,
          opts.input.entryId,
          opts.input.content
        )
      }),
    put: t.procedure
      .input(
        z.object({
          id: z.number(),
          content: z.string().array()
        })
      )
      .mutation((opts) => {
        return updateFeelings(opts.input.id, opts.input.content)
      }),
    one: t.procedure
      .input(
        z.object({
          date: z.string()
        })
      )
      .query((opts) => {
        return getFeelingsByDate(opts.input.date)
      })
  }),
  mentalHealth: t.router({
    post: t.procedure
      .input(
        z.object({
          date: z.string(),
          entryId: z.number(),
          content: z.string().array()
        })
      )
      .mutation((opts) => {
        return createMentalHealth(
          opts.input.date,
          opts.input.entryId,
          opts.input.content
        )
      }),
    put: t.procedure
      .input(
        z.object({
          id: z.number(),
          content: z.string().array()
        })
      )
      .mutation((opts) => {
        return updateMentalHealth(opts.input.id, opts.input.content)
      }),
    one: t.procedure
      .input(
        z.object({
          date: z.string()
        })
      )
      .query((opts) => {
        return getMentalHealthByDate(opts.input.date)
      }),
    all: t.procedure.query(() => {
      return getMyMentalHealth()
    })
  }),
  substances: t.router({
    all: t.procedure.query(() => {
      return getMySubstances()
    }),
    post: t.procedure
      .input(
        z.object({
          date: z.string(),
          entryId: z.number(),
          name: z.string(),
          amount: z.number()
        })
      )
      .mutation((opts) => {
        return createSubstances(
          opts.input.date,
          opts.input.entryId,
          opts.input.name,
          opts.input.amount
        )
      }),
    put: t.procedure
      .input(
        z.object({
          id: z.number(),
          amount: z.number()
        })
      )
      .mutation((opts) => {
        return updateSubstance(opts.input.id, opts.input.amount)
      }),
    one: t.procedure
      .input(
        z.object({
          date: z.string()
        })
      )
      .query((opts) => {
        return getSubstancesByDate(opts.input.date)
      })
  }),
  mood: t.router({
    all: t.procedure.query(() => {
      return getMyMoods()
    }),
    post: t.procedure
      .input(
        z.object({
          date: z.string(),
          entryId: z.number(),
          mood: z.number()
        })
      )
      .mutation((opts) => {
        return createMood(opts.input.date, opts.input.entryId, opts.input.mood)
      }),
    put: t.procedure
      .input(
        z.object({
          id: z.number(),
          mood: z.number()
        })
      )
      .mutation((opts) => {
        return updateMood(opts.input.id, opts.input.mood)
      }),
    one: t.procedure
      .input(
        z.object({
          date: z.string()
        })
      )
      .query((opts) => {
        return getMoodByDate(opts.input.date)
      })
  }),
  sleep: t.router({
    post: t.procedure
      .input(
        z.object({
          date: z.string(),
          entryId: z.number(),
          bedTime: z.date().optional(),
          wakeUpTime: z.date().optional(),
          sleepQuality: z.string().optional()
        })
      )
      .mutation((opts) => {
        return createSleep(
          opts.input.date,
          opts.input.entryId,
          opts.input.bedTime,
          opts.input.wakeUpTime,
          opts.input.sleepQuality
        )
      }),
    put: t.procedure
      .input(
        z.object({
          id: z.number(),
          bedTime: z.string().optional(),
          wakeUpTime: z.string().optional(),
          sleepQuality: z.string().optional()
        })
      )
      .mutation((opts) => {
        return updateSleep(
          opts.input.id,
          opts.input.bedTime,
          opts.input.wakeUpTime,
          opts.input.sleepQuality
        )
      }),
    all: t.procedure
      .input(
        z.object({
          date: z.string()
        })
      )
      .query((opts) => {
        return getMySleep()
      }),
    one: t.procedure
      .input(
        z.object({
          date: z.string()
        })
      )
      .query((opts) => {
        return getSleepByDate(opts.input.date)
      }),
    delete: t.procedure
      .input(
        z.object({
          id: z.number()
        })
      )
      .mutation((opts) => {
        return deleteSleep(opts.input.id)
      })
  }),
  exercise: t.router({
    post: t.procedure
      .input(
        z.object({
          date: z.string(),
          entryId: z.number(),
          content: z.number()
        })
      )
      .mutation((opts) => {
        return createExercise(
          opts.input.date,
          opts.input.entryId,
          opts.input.content
        )
      }),
    put: t.procedure
      .input(
        z.object({
          id: z.number(),
          minutes: z.number()
        })
      )
      .mutation((opts) => {
        return updateExercise(opts.input.id, opts.input.minutes)
      }),
    one: t.procedure
      .input(
        z.object({
          date: z.string()
        })
      )
      .query((opts) => {
        return getExerciseByDate(opts.input.date)
      })
  }),
  question: t.router({
    one: t.procedure
      .input(
        z.object({
          dayOfMonth: z.number()
        })
      )
      .query((opts) => {
        return getQuestion(opts.input.dayOfMonth)
      })
  }),
  answer: t.router({
    post: t.procedure
      .input(
        z.object({
          date: z.string(),
          entryId: z.number(),
          questionId: z.number(),
          answer: z.string()
        })
      )
      .mutation((opts) => {
        return createAnswer(
          opts.input.date,
          opts.input.entryId,
          opts.input.questionId,
          opts.input.answer
        )
      }),
    put: t.procedure
      .input(
        z.object({
          id: z.number(),
          answer: z.string()
        })
      )
      .mutation((opts) => {
        return updateAnswer(opts.input.id, opts.input.answer)
      }),
    one: t.procedure
      .input(
        z.object({
          date: z.string()
        })
      )
      .query((opts) => {
        return getAnswerByDate(opts.input.date)
      })
  }),
  content: t.router({
    post: t.procedure
      .input(
        z.object({
          date: z.string(),
          entryId: z.number(),
          content: z.string().optional()
        })
      )
      .mutation((opts) => {
        return createContent(
          opts.input.date,
          opts.input.entryId,
          opts.input.content
        )
      }),
    put: t.procedure
      .input(
        z.object({
          id: z.number(),
          content: z.string().optional()
        })
      )
      .mutation((opts) => {
        return updateContent(opts.input.id, opts.input.content)
      }),
    one: t.procedure
      .input(
        z.object({
          date: z.string()
        })
      )
      .query((opts) => {
        return getContentByDate(opts.input.date)
      }),
    delete: t.procedure
      .input(
        z.object({
          id: z.number()
        })
      )
      .mutation((opts) => {
        return deleteContent(opts.input.id)
      })
  }),
  appointments: t.router({
    all: t.procedure.query(() => {
      return getMyAppointments()
    }),
    post: t.procedure
      .input(
        z.object({
          date: z.string(),
          title: z.string(),
          description: z.string()
        })
      )
      .mutation((opts) => {
        return createAppointment(opts.input)
      }),
    put: t.procedure
      .input(
        z.object({
          appointmentId: z.number(),
          date: z.date(),
          title: z.string(),
          description: z.string()
        })
      )
      .mutation((opts) => {
        return updateAppointment(opts.input)
      }),
    delete: t.procedure
      .input(
        z.object({
          id: z.number()
        })
      )
      .mutation((opts) => {
        return deleteAppointment(opts.input.id)
      })
  }),
  notes: t.router({
    post: t.procedure
      .input(
        z.object({
          appointmentId: z.number(),
          note: z.string().optional()
        })
      )
      .mutation((opts) => {
        return createNote(opts.input)
      }),
    put: t.procedure
      .input(
        z.object({
          id: z.number(),
          note: z.string()
        })
      )
      .mutation((opts) => {
        return updateNote(opts.input)
      }),
    delete: t.procedure
      .input(
        z.object({
          id: z.number()
        })
      )
      .mutation((opts) => {
        return deleteNote(opts.input.id)
      })
  }),
  goals: t.router({
    daily: t.procedure
      .input(
        z.object({
          date: z.string()
        })
      )
      .query((opts) => {
        return getDailyGoals(opts.input.date)
      }),
    createDaily: t.procedure
      .input(
        z.object({
          goal: z.string(),
          date: z.string()
        })
      )
      .mutation((opts) => {
        return createDailyGoal(opts.input.goal, opts.input.date)
      }),
    updateDaily: t.procedure
      .input(
        z.object({
          goalId: z.number(),
          goal: z.string()
        })
      )
      .mutation((opts) => {
        return updateDailyGoal(opts.input.goalId, opts.input.goal)
      }),
    deleteDaily: t.procedure
      .input(
        z.object({
          goalId: z.number()
        })
      )
      .mutation((opts) => {
        return deleteDailyGoal(opts.input.goalId)
      }),
    weekly: t.procedure
      .input(
        z.object({
          week: z.number(),
          year: z.number()
        })
      )
      .query((opts) => {
        return getWeeklyGoals(opts.input.week, opts.input.year)
      }),
    createWeekly: t.procedure
      .input(
        z.object({
          goal: z.string(),
          week: z.number(),
          year: z.number()
        })
      )
      .mutation((opts) => {
        return createWeeklyGoal(
          opts.input.goal,
          opts.input.week,
          opts.input.year
        )
      }),
    updateWeekly: t.procedure
      .input(
        z.object({
          goalId: z.number(),
          goal: z.string()
        })
      )
      .mutation((opts) => {
        return updateWeeklyGoal(opts.input.goalId, opts.input.goal)
      }),
    deleteWeekly: t.procedure
      .input(
        z.object({
          goalId: z.number()
        })
      )
      .mutation((opts) => {
        return deleteWeeklyGoal(opts.input.goalId)
      }),
    yearly: t.procedure
      .input(
        z.object({
          year: z.number()
        })
      )
      .query((opts) => {
        return getYearlyGoals(opts.input.year)
      }),
    createYearly: t.procedure
      .input(
        z.object({
          goal: z.string(),
          year: z.number()
        })
      )
      .mutation((opts) => {
        return createYearlyGoal(opts.input.goal, opts.input.year)
      }),
    updateYearly: t.procedure
      .input(
        z.object({
          goalId: z.number(),
          goal: z.string()
        })
      )
      .mutation((opts) => {
        return updateYearlyGoal(opts.input.goalId, opts.input.goal)
      }),
    deleteYearly: t.procedure
      .input(
        z.object({
          goalId: z.number()
        })
      )
      .mutation((opts) => {
        return deleteYearlyGoal(opts.input.goalId)
      }),
    monthly: t.procedure
      .input(
        z.object({
          month: z.number(),
          year: z.number()
        })
      )
      .query((opts) => {
        return getMonthlyGoals(opts.input.month, opts.input.year)
      }),
    createMonthly: t.procedure
      .input(
        z.object({
          goal: z.string(),
          month: z.number(),
          year: z.number()
        })
      )
      .mutation((opts) => {
        return createMonthlyGoal(
          opts.input.goal,
          opts.input.month,
          opts.input.year
        )
      }),
    updateMonthly: t.procedure
      .input(
        z.object({
          goalId: z.number(),
          goal: z.string()
        })
      )
      .mutation((opts) => {
        return updateMonthlyGoal(opts.input.goalId, opts.input.goal)
      }),
    deleteMonthly: t.procedure
      .input(
        z.object({
          goalId: z.number()
        })
      )
      .mutation((opts) => {
        return deleteMonthlyGoal(opts.input.goalId)
      }),
    reflections: t.procedure
      .input(
        z.object({
          goalId: z.number()
        })
      )
      .query((opts) => {
        return getReflections(opts.input.goalId)
      }),
    createReflection: t.procedure
      .input(
        z.object({
          goalId: z.number(),
          reflection: z.string()
        })
      )
      .mutation((opts) => {
        return createReflection(opts.input.goalId, opts.input.reflection)
      }),
    updateReflection: t.procedure
      .input(
        z.object({
          reflectionId: z.number(),
          reflection: z.string()
        })
      )
      .mutation((opts) => {
        return updateReflection(opts.input.reflectionId, opts.input.reflection)
      }),
    deleteReflection: t.procedure
      .input(
        z.object({
          reflectionId: z.number()
        })
      )
      .mutation((opts) => {
        return deleteReflection(opts.input.reflectionId)
      })
  })
})

// export type definition of API
export type AppRouter = typeof appRouter
