import { useParams } from "next/navigation"
import { useMemo } from "react"
import { trpc } from "~/utils/trpc"

export default function Entry() {
  const { date } = useParams()

  if (!date || typeof date !== "string") return null

  const { data: content, isLoading } = trpc.content.one.useQuery({ date })

  if (isLoading) return <div>Loading...</div>

  return (
    <>
      {content?.map((c, idx) => (
        <div key={idx}>
          <textarea className="w-full p-4 bg-[--primary]" value={c.content} />
        </div>
      ))}
      <div className="w-fit m-auto my-4">
        <button className="styled-button m-auto">Add Entry</button>
      </div>
    </>
  )
}
