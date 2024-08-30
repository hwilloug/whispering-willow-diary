"use client"

export default function TimeRangeButton({
  onClick,
  value,
  isActive
}: Readonly<{ onClick: () => void; value: string; isActive: boolean }>) {
  return (
    <button
      className={`${isActive ? "bg-purple-800" : "bg-green-900"} text-white p-2 my-4 mx-2 rounded-xl`}
      onClick={onClick}
    >
      {value}
    </button>
  )
}
