import { useMemo } from "react";
import { EntryState, useJournalStore } from "~/store";

export default function Entry({ date, onSave, timeOfDay }: {date?: string; timeOfDay: 'Morning' | 'Evening'; onSave: (saveObj: Partial<EntryState>) => void}) {
  const entry = useJournalStore((store) => store.entries.find((e) => e.date === date))
  
  const value = useMemo(() => {
    switch (timeOfDay) {
      case 'Morning':
        return entry?.morningEntryContent
      case 'Evening':
        return entry?.entryContent
    }
  }, [entry, timeOfDay])
  
  const handleSubmit = (entry: string) => {
    if (timeOfDay === 'Morning') {
      onSave({morningEntryContent: entry})
    } else if (timeOfDay === 'Evening') {
      onSave({entryContent: entry})
    }
  }

  return (
    <div className="container-transparent">
      <div className="container-title mb-4">Entry</div>
      <textarea value={value} onChange={(e) => handleSubmit(e.target.value)} className="w-full h-96 p-4 bg-[--primary]" />
    </div>
  )
}