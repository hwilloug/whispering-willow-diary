import { parse } from "date-fns";
import { Input } from "~/components/ui/input";
import { EntryState, useJournalStore } from "~/store";
import { trpc } from "~/utils/trpc";

export default function DailyAffirmationEntry({ date }: {date: string;}) {
  const { data: affirmation, isLoading } = trpc.affirmation.one.useQuery({ date })

  return (
      <div>
        {isLoading && <div>Loading...</div>}
        {!isLoading && <textarea className="w-full p-4 bg-[--primary] text-black" value={affirmation?.affirmation} />}
      </div>
  )
}