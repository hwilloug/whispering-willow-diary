export default function MoodContent({ mood }: { mood: string | number }) {
  return (
    <div className="bg-[--primary] rounded-xl">
      <h5 className="text-outline-bold text-2xl text-center my-4">Mood</h5>
      <div className="text-center m-4">{mood}</div>
    </div>
  )
}