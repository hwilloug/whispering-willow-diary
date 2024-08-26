"use client"

import ViewEntry from "./_components/viewentry"
import EntryNav from "./_components/entrynav"


export default function ViewEntryPage() {
  return (
    <div>
      <div>
        <EntryNav />
      </div>
      <div>
        <ViewEntry />
      </div>
      <div>
        <EntryNav />
      </div>
    </div>
  )
}