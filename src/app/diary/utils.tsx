import FaceIcon from "./_components/icons/faceicon"

export function getMoodIcon(mood: number) {
  switch (Math.round(mood)) {
    case 0:
      return (
        <FaceIcon
          color="red"
          variant="distressed"
          value={mood}
          className="m-auto"
        />
      )
    case 1:
      return (
        <FaceIcon
          color="orange"
          variant="bad"
          value={mood}
          className="m-auto"
        />
      )
    case 2:
      return (
        <FaceIcon
          color="blue"
          variant="neutral"
          value={mood}
          className="m-auto"
        />
      )
    case 3:
      return (
        <FaceIcon
          color="green"
          variant="happy"
          value={mood}
          className="m-auto"
        />
      )
    case 4:
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
