export default function MentalHealthContent({mentalHealth}: {mentalHealth: string[]}) {
  return (
    <div className="bg-pink-300 rounded-xl p-4 mt-4">
      <h5 className="text-outline-bold text-2xl text-center my-4">Mental Health</h5>
      <div className="m-4 flex flex-wrap justify-center gap-4">{
        mentalHealth.map((item, index) => (
          <div key={index}>{item}</div>
        ))
      }</div>
    </div>
  )
}