export default function FeelingsContent({feelings}: {feelings: string[]}) {
  return (
    <div className="bg-purple-300 rounded-xl mt-4 p-4">
      <h5 className="text-outline-bold text-2xl text-center my-4">Feelings</h5>
      <div className="m-4 flex flex-wrap justify-center gap-4">{
        feelings.map((item, index) => (
          <div key={index}>{item}</div>
        ))
      }</div>
    </div>
  )
}