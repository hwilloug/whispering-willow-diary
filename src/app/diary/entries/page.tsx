"use client"

import { format, subDays } from "date-fns"
import Link from "next/link"
import { useJournalStore } from "~/store"
import EyeIcon from "../_components/icons/eyeicon"
import TrashIcon from "../_components/icons/trashicon"
import DocumentPlusIcon from "../_components/icons/documentplusicon"

export default function EntriesList({}) {
  const entries = useJournalStore(state => state.entries)

  const today = new Date()

  const lastThirtyDays = [...Array(30).keys()].map(i => subDays(today, i))

  return (
    <div>
    <div className="text-outline-bold text-5xl text-center py-6">Entries List</div>
    <div className="grid grid-cols-3 gap-4">
      {lastThirtyDays.map(date => {
        const entryDate = format(date, "yyyy-MM-dd")
        const entry = entries.find(entry => entry.date === entryDate)
        return (
          <div key={date.toISOString()} className="border border-black container-transparent grid grid-rows-2">
            <div className="text-lg">{date.toDateString()}</div>
            {entry ? (
              <div className="grid grid-cols-2 mt-1 gap-2">
                <Link href={`/diary/entries/${entryDate}`} className="bg-[--primary] p-4 border rounded-2xl hover:bg-transparent hover:cursor-pointer">
                  <EyeIcon className="m-auto" />
                </Link>
                <div className="bg-[--primary] p-4 border rounded-2xl hover:bg-transparent hover:cursor-pointer">
                  <TrashIcon className="m-auto" />
                </div>
              </div>
            ) : (
              <Link  href={`/diary/entries/${entryDate}/edit`} >
                <div className="bg-[--primary] mt-1 p-4 border rounded-2xl hover:bg-transparent hover:cursor-pointer">
                  <DocumentPlusIcon className="m-auto" />
                </div>
            </Link>
            )}
          </div>
        )
      })}
    </div>
  </div>
  )
}