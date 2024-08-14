"use server"

import { format } from "date-fns";
import { createEntry } from "~/server/queries";

export default async function CreateEntryButton() {
  return (
    <div><button className="styled-button" onClick={() => createEntry(format(new Date(), "yyyy-MM-dd"))}>Create Entry</button></div>
  )
}