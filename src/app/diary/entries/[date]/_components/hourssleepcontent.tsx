export default function SleepContent({content}: {content: string | number}) {
  return (
    <div className="bg-blue-300 rounded-xl">
      <h5 className="text-outline-bold text-2xl text-center my-4">Sleep</h5>
      <div className="text-center m-4">{content}</div>
    </div>
  )
}