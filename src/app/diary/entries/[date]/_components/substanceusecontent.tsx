import { useParams } from "next/navigation";
import { trpc } from "~/utils/trpc";

export default function SubstanceUseContent() {
  const { date } = useParams()

  if (!date || typeof date !== "string") return null

  const { data, isLoading } = trpc.substances.one.useQuery({ date })

  return (
    <div className="bg-red-500 rounded-xl my-4 p-4">
      <h5 className="text-outline-bold text-2xl text-center my-4">Substance Use</h5>
      {
        !isLoading && data?.length === 0 ? (
          <div className="text-center m-4">None</div>
        ) : (
          data?.map((s) => (
            <div key={s.id} className="text-center my-4">{s.substance} {s.amount}x</div>
          ))
        )
      }
    </div>
  )
}