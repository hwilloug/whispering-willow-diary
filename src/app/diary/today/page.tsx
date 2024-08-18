import { format } from "date-fns";
import EntryForm from "../_components/entryform";

export default function TodaysEntry() {
  return (
    <div>
      <div className="text-outline-bold text-6xl text-center py-6">Today's Entry</div>
      <div className="text-outline-bold text-5xl text-center">{format(new Date(), "eeee, LLLL d, yyyy")}</div>
        <EntryForm date={format(new Date(), "yyyy-MM-dd")} />
    </div>
  )
}