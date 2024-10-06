export default async function Home() {
  const info = [
    {
      title: "Track your mood, mental health, and feelings",
      description: [
        "Have more effective conversations with your doctor",
        "Understand how your mental health affects your life"
      ],
      icon: "🧘‍♂️"
    },
    {
      title: "Track sleep and exercise",
      description: ["Understand how your sleep and exercise affect your mood"],
      icon: "💤"
    },
    {
      title: "Set personal goals",
      description: [
        "Set daily, weekly, and yearly goals and track your progress"
      ],
      icon: "🎯"
    },
    {
      title: "Create journal entries",
      description: ["Reflect on your day", "Process emotions"],
      icon: "📝"
    },
    {
      title: "Track drug use",
      description: [
        "Compare drug use to mood and mental health",
        "Help to get sober or reduce use"
      ],
      icon: "🧪"
    }
  ]

  return (
    <main>
      <div></div>
      <div className="grid md:grid-cols-2 gap-4">
        {info.map((i) => (
          <div
            className="p-4 my-4 container-transparent rounded-lg"
            key={i.title}
          >
            <h1 className="text-2xl font-bold">
              {i.icon} {i.title}
            </h1>
            <ul>
              {i.description.map((d) => (
                <li className="list-disc m-4" key={d}>
                  {d}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </main>
  )
}
