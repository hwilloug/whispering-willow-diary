import { useParams } from "next/navigation";
import CreateEntryButton from "../../_components/createentrybutton";

export default function NoEntry() {
  const { date } = useParams()

  if (!date || typeof date !== "string") return null

  return (
    <>
      <div className="container-transparent text-4xl text-center">No entry for this date</div>
      <CreateEntryButton date={date} />
    </>
  )
}