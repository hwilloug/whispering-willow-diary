export default function EveningEntryContent({content}: {content: string}) {
  return (
    <div className="bg-blue-300 rounded-xl p-4">
      <h5 className="text-outline-bold text-2xl text-center my-4">Evening Entry</h5>
      <div className="text-center m-4">{content}</div>
    </div>
  )
}