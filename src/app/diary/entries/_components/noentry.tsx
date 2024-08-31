import { useParams } from "next/navigation"
import CreateEntryButton from "../../_components/createentrybutton"
import { format, parse } from "date-fns"

export default function NoEntry() {
  const { date } = useParams()

  if (!date || typeof date !== "string") return null

  return (
    <>
      <div className="container-transparent text-center">
        <div className="text-outline-bold text-4xl text-center py-6">
          {format(parse(date, "yyyy-MM-dd", new Date()), "eeee, LLLL d, yyyy")}
        </div>
        <div className="text-center m-4">
          <CreateEntryButton date={date} />
        </div>
      </div>
    </>
  )
}
