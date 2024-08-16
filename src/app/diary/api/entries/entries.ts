import { NextRequest, NextResponse } from "next/server"
import { createEntry, updateEntry } from "~/server/entries-queries"

export async function entry_post(req: NextRequest) {
  const { date } = await req.json()
  await createEntry(date)
  return NextResponse.json({message: "Entry created"}, {status: 201})
}

export async function entry_put(req: NextRequest) {
  const { entryId, date, content } = await req.json()
  await updateEntry(entryId, date, content)
  return NextResponse.json({message: "Entry updated"}, {status: 201})
}