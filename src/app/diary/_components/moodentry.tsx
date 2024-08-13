import FaceIcon from "./icons/faceicon";

export default function MoodEntry() {
  
  return (
    <div className="container-transparent">
      <div className="container-title">Mood</div>
      <div className="flex justify-center mt-2 gap-4 p-4 bg-[--primary] w-fit mx-auto rounded-lg">
        <FaceIcon color="red" variant="distressed" />
        <FaceIcon color="orange" variant="bad" />
        <FaceIcon color="blue" variant="neutral" />
        <FaceIcon color="green" variant="happy" />
        <FaceIcon color="purple" variant="ecstatic" />
      </div>
    </div>
  )
}