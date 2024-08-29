import { useMemo } from "react";
import { trpc } from "~/utils/trpc";

export default function Entry({ date }: {date: string;}) {
  const { data: content, isLoading} = trpc.content.one.useQuery({ date })

  return (
    <div className="container-transparent">
      <div className="container-title mb-4">Entries</div>
      {isLoading && <div>Loading...</div>}
      {!isLoading && content?.map((c, idx) => (
        <div key={idx}>
          <textarea className="w-full p-4 bg-[--primary]" value={c.content} />
        </div>
      ))}
      {!isLoading && content?.length === 0 && (
        <div className="w-fit m-auto">
          <button className="styled-button m-auto">Add Entry</button>
        </div>
      )}
    </div>
  )
}