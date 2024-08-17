export default function AffirmationContent({ content }: { content: string }) {
  return (
    <div className="bg-amber-900/80 text-white text-xl p-10 w-fit m-auto text-center rounded-lg">
      <h5 className="text-outline-bold-inverted text-3xl">🌸 Affirmation 🌸</h5>
      <p className="mt-4">{content}</p>
    </div>
  )
}