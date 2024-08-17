export default function MorningEntryContent({content}: {content: string}) {
  return (
    <div className="bg-amber-300 rounded-xl p-2">
      <h5 className="text-outline-bold text-2xl text-center my-4">Morning Entry</h5>
      <div className="text-justify m-4">{content}</div>
    </div>
  )
}