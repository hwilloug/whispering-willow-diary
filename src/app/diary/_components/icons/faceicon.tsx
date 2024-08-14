import { useMemo } from "react";

export default function FaceIcon({color, variant, className, value, onClick}: Readonly<{ value: number; color: string; variant: "distressed" | "bad" | "neutral" | "happy" | "ecstatic"; className?: string; onClick?: (mood: number) => void }>) {
  const mouth = useMemo(() => {
    switch (variant) {
      case "distressed":
        return ( <>
        <path d="M8,18 Q12,14 16,18" />
        <rect x="8" y="18" width="8" height="0.25" />
      </>)
      case "bad":
        return (
          <path d="M8,17 Q12,14 16,17" />
        )
      case "neutral":
        return (
          <path d="M8,17 16,17" />
        )
      case "happy":
        return (
          <path d="M8,17 Q12,20 16,17" />
        )
      case "ecstatic":
        return (
          <>
            <path d="M8,17 Q12,20 16,17" />
            <rect x="7" y="16" width="10" height="0.25" />
          </>
        )
    }
  }, [variant])
  
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      onClick={() => onClick && onClick(value)}
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="8" cy="10" r="1" />
      <circle cx="16" cy="10" r="1" />
      {mouth}
    </svg>
  )
}