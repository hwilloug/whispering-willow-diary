"use client"

import { format } from "date-fns";
import { useParams } from "next/navigation";
import EntryForm from "~/app/diary/_components/entryform";

export default function EditEntryPage() {
  const { date } = useParams()

  return (
    <div>
      <div className="text-outline-bold text-5xl text-center m-4">{format(new Date(), "eeee, LLLL d, yyyy")}</div>
        <EntryForm date={date as string} />
    </div>
  ) 
}