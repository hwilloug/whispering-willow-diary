import { NextRequest, NextResponse } from "next/server"
import { deleteSleep } from "~/server/entries-queries"

export async function sleep_delete(req: NextRequest) {
  const { sleepId } = await req.json()
  await deleteSleep(sleepId)
  return NextResponse.json({message: "Sleep deleted"}, {status: 201})
}