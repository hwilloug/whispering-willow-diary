import { format } from "date-fns";
import EntryForm from "~/app/diary/_components/entryform";

export default function EditEntryPage() {
  return (
    <div>
      <div className="text-outline-bold text-5xl text-center m-4">{format(new Date(), "eeee, LLLL d, yyyy")}</div>
        <EntryForm date={format(new Date(), "yyyy-MM-dd")} />
    </div>
  ) 
}