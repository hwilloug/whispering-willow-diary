import { z } from "zod"
import { initTRPC } from "@trpc/server"
import { createEntry, getMyEntries, getMyEntry } from "../db/queries/entries"
import {
  createAffirmation,
  getAffirmationByDate
} from "../db/queries/affirmations"
import { createFeelings, getFeelingsByDate } from "../db/queries/feelings"
import {
  createMentalHealth,
  getMentalHealthByDate
} from "../db/queries/mentalhealth"
import {
  createSubstances,
  getMySubstances,
  getSubstancesByDate
} from "../db/queries/substances"
import { createMood, getMoodByDate, getMyMoods } from "../db/queries/mood"
import { createSleep, getMySleep, getSleepByDate } from "../db/queries/sleep"
import { createExercise, getExerciseByDate } from "../db/queries/exercise"
import { createQuestion, getQuestionByDate } from "../db/queries/question"
import { createContent, getContentByDate } from "../db/queries/content"

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
    one: t.procedure
      .input(
        z.object({
          date: z.string()
        })
      )
      .query((opts) => {
        return getMentalHealthByDate(opts.input.date)
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
          bedTime: z.date(),
          wakeUpTime: z.date(),
          sleepQuality: z.string()
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
    one: t.procedure
      .input(
        z.object({
          date: z.string()
        })
      )
      .query((opts) => {
        return getSleepByDate(opts.input.date)
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
    post: t.procedure
      .input(
        z.object({
          date: z.string(),
          entryId: z.number(),
          question: z.string(),
          answer: z.string()
        })
      )
      .mutation((opts) => {
        return createQuestion(
          opts.input.date,
          opts.input.entryId,
          opts.input.question,
          opts.input.answer
        )
      }),
    one: t.procedure
      .input(
        z.object({
          date: z.string()
        })
      )
      .query((opts) => {
        return getQuestionByDate(opts.input.date)
      })
  }),
  content: t.router({
    post: t.procedure
      .input(
        z.object({
          date: z.string(),
          entryId: z.number(),
          content: z.string()
        })
      )
      .mutation((opts) => {
        return createContent(
          opts.input.date,
          opts.input.entryId,
          opts.input.content
        )
      }),
    one: t.procedure
      .input(
        z.object({
          date: z.string()
        })
      )
      .query((opts) => {
        return getContentByDate(opts.input.date)
      })
  })
})

// export type definition of API
export type AppRouter = typeof appRouter
