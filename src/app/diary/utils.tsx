import FaceIcon from "./_components/icons/faceicon"

export function getMoodIcon(mood: number) {
  const roundedMood = Math.round(mood)
  if (roundedMood >= 0 && roundedMood <= 1) {
    return (
      <FaceIcon
        color="red"
        variant="distressed"
        value={mood}
        className="m-auto"
      />
    )
  } else if (roundedMood >= 2 && roundedMood <= 3) {
    return (
      <FaceIcon color="orange" variant="bad" value={mood} className="m-auto" />
    )
  } else if (roundedMood >= 4 && roundedMood <= 5) {
    return (
      <FaceIcon
        color="blue"
        variant="neutral"
        value={mood}
        className="m-auto"
      />
    )
  } else if (roundedMood >= 6 && roundedMood <= 7) {
    return (
      <FaceIcon color="green" variant="happy" value={mood} className="m-auto" />
    )
  } else if (roundedMood >= 8 && roundedMood <= 10) {
    return (
      <FaceIcon
        color="purple"
        variant="ecstatic"
        value={mood}
        className="m-auto"
      />
    )
  }
}
