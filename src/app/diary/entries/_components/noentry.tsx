import { useParams } from "next/navigation";
import CreateEntryButton from "../../_components/createentrybutton";

export default function NoEntry() {
  const { date } = useParams()

  if (!date || typeof date !== "string") return null

  return (
    <>
      <div className="container-transparent text-center">
        <div className="text-center m-4">
          <CreateEntryButton date={date} />
        </div>
      </div>
    </>
  )
}