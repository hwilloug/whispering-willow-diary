export default function DailyQuestionContent({question, answer}: {question: string; answer: string}) {
  return (
    <div className="bg-blue-300 rounded-xl">
      <h5 className="text-outline-bold text-2xl text-center my-4">Daily Question</h5>
      <div className="text-center text-lg m-4">{question}</div>
      <div className="text-center m-4">{answer}</div>
    </div>
  )
}