import { SubstancesState } from "~/store";

export default function SubstanceUseContent({substances}: {substances: SubstancesState[]}) {
  return (
    <div className="bg-red-500 rounded-xl my-4 p-4">
      <h5 className="text-outline-bold text-2xl text-center my-4">Substance Use</h5>
      <div className="text-center m-4"></div>
    </div>
  )
}