export default function ExerciseContent({content}: {content: string | number}) {
  return (
    <div className="bg-lime-300 my-4 p-4 rounded-xl">
      <h5 className="text-outline-bold text-2xl text-center my-4">Exercise</h5>
      <div className="text-center my-4">{content} minutes</div>
    </div>
  )
}