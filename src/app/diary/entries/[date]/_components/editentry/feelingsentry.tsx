import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "~/components/ui/accordion"
import { Checkbox } from "~/components/ui/checkbox"
import { EntryState } from "~/store"
import { trpc } from "~/utils/trpc"

export default function FeelingsEntry() {
  const { date } = useParams()
  const utils = trpc.useUtils()

  if (!date || typeof date !== "string") return null

  const { data: feelings, isLoading } = trpc.feelings.one.useQuery({ date })

  const { data: entry, isLoading: entryIsLoading } = trpc.entries.one.useQuery({
    date
  })

  if (!entryIsLoading && (entry === undefined || entry === null))
    throw new Error("Invalid entry")

  const updateMutation = trpc.feelings.put.useMutation({
    onSuccess: async () => {
      await utils.feelings.invalidate()
    }
  })

  const createMutation = trpc.feelings.post.useMutation({
    onSuccess: async () => {
      await utils.feelings.invalidate()
    }
  })

  const update = (value: string[]) => {
    updateMutation.mutate({
      id: feelings!.id,
      content: value
    })
  }

  const add = (value: string[]) => {
    createMutation.mutate({
      date,
      entryId: entry!.id,
      content: value
    })
  }

  const onChange = (value: string) => {
    if (feelings?.id) {
      let newFeelings: string[]
      if (feelings.feelings.includes(value)) {
        // If the feeling is already present, remove it
        newFeelings = feelings.feelings.filter((f) => f !== value)
      } else {
        // If the feeling is not present, add it
        newFeelings = [...feelings.feelings, value]
      }
      update(newFeelings)
    } else {
      add([value])
    }
  }

  function FeelingsAccordion({
    feelingsList,
    title,
    value
  }: Readonly<{ feelingsList: string[]; title: string; value: string }>) {
    return (
      <AccordionItem value={value} className="border-b-0">
        <AccordionTrigger className="flex justify-center gap-4 font-bold">
          {title}
        </AccordionTrigger>
        <AccordionContent className="flex gap-4 flex-wrap justify-center">
          {feelingsList.map((f) => (
            <div key={f} className="flex gap-2 items-center">
              <Checkbox
                checked={feelings?.feelings.includes(f)}
                onClick={() => onChange(f)}
              />
              <span>{f}</span>
            </div>
          ))}
        </AccordionContent>
      </AccordionItem>
    )
  }

  const feelingsCategories = [
    {
      title: "Accepting/Open",
      feelings: [
        "Calm",
        "Centered",
        "Content",
        "Fulfilled",
        "Patient",
        "Peaceful",
        "Present",
        "Relaxed",
        "Serene",
        "Trusting"
      ]
    },
    {
      title: "Aliveness/Joy",
      feelings: [
        "Amazed",
        "Awe",
        "Bliss",
        "Delighted",
        "Eager",
        "Ecstatic",
        "Enchanted",
        "Energized",
        "Engaged",
        "Enthusiastic",
        "Excited",
        "Free",
        "Happy",
        "Inspired",
        "Invigorated",
        "Lively",
        "Passionate",
        "Playful",
        "Radiant",
        "Refreshed",
        "Rejuvenated",
        "Renewed",
        "Satisfied",
        "Thrilled",
        "Vibrant"
      ]
    },
    {
      title: "Angry/Annoyed",
      feelings: [
        "Agitated",
        "Aggravated",
        "Bitter",
        "Contempt",
        "Cynical",
        "Disdain",
        "Disgruntled",
        "Disturbed",
        "Edgy",
        "Exasperated",
        "Frustrated",
        "Furious",
        "Grouchy",
        "Hostile",
        "Impatient",
        "Irritated",
        "Irate",
        "Moody",
        "On edge",
        "Outraged",
        "Pissed",
        "Resentful",
        "Upset",
        "Vindictave"
      ]
    },
    {
      title: "Courageous/Powerful",
      feelings: [
        "Adventurous",
        "Brave",
        "Capable",
        "Confident",
        "Daring",
        "Determined",
        "Free",
        "Grounded",
        "Proud",
        "Strong",
        "Worthy",
        "Valiant"
      ]
    },
    {
      title: "Connected/Loving",
      feelings: [
        "Accepting",
        "Affectionate",
        "Caring",
        "Compassion",
        "Empathy",
        "Fulfilled",
        "Present",
        "Safe",
        "Warm",
        "Worthy"
      ]
    },
    {
      title: "Curious",
      feelings: [
        "Engaged",
        "Exploring",
        "Fascinated",
        "Interested",
        "Intrigued",
        "Involved",
        "Stimulated"
      ]
    },
    {
      title: "Despair/Sad",
      feelings: [
        "Anguish",
        "Depressed",
        "Despondent",
        "Disappointed",
        "Discouraged",
        "Forlorn",
        "Gloomy",
        "Grief",
        "Heartbroken",
        "Hopeless",
        "Lonely",
        "Longing",
        "Melancholy",
        "Sorrow",
        "Teary",
        "Unhappy",
        "Upset",
        "Weary",
        "Yearning"
      ]
    },
    {
      title: "Disconnected/Numb",
      feelings: [
        "Aloof",
        "Bored",
        "Confused",
        "Distant",
        "Empty",
        "Indifferent",
        "Isolated",
        "Lethargic",
        "Listless",
        "Removed",
        "Resistant",
        "Shut Down",
        "Uneasy",
        "Withdrawn"
      ]
    },
    {
      title: "Embarrassed/Shame",
      feelings: [
        "Ashamed",
        "Humiliated",
        "Inhibited",
        "Mortified",
        "Self-conscious",
        "Useless",
        "Weak",
        "Worthless"
      ]
    },
    {
      title: "Fear",
      feelings: [
        "Afraid",
        "Anxious",
        "Apprehensive",
        "Frightened",
        "Hesitant",
        "Nervous",
        "Panic",
        "Paralyzed",
        "Scared",
        "Terrified",
        "Worried"
      ]
    },
    {
      title: "Fragile",
      feelings: ["Helpless", "Sensitive"]
    },
    {
      title: "Grateful",
      feelings: [
        "Appreciative",
        "Blessed",
        "Delighted",
        "Fortunate",
        "Grace",
        "Humbled",
        "Lucky",
        "Moved",
        "Thankful",
        "Touched"
      ]
    },
    {
      title: "Guilt",
      feelings: ["Regret", "Remorseful", "Sorry"]
    },
    {
      title: "Hopeful",
      feelings: ["Encouraged", "Expectant", "Optimistic", "Trusting"]
    },
    {
      title: "Powerless",
      feelings: ["Impotent", "Incapable", "Resigned", "Trapped", "Victim"]
    },
    {
      title: "Tender",
      feelings: [
        "Calm",
        "Caring",
        "Loving",
        "Reflective",
        "Self-loving",
        "Serene",
        "Vulnerable",
        "Warm"
      ]
    },
    {
      title: "Stressed/Tense",
      feelings: [
        "Anxious",
        "Burned out",
        "Cranky",
        "Depleted",
        "Edgy",
        "Exhausted",
        "Frazzled",
        "Overwhelm",
        "Rattled",
        "Rejecting",
        "Restless",
        "Shaken",
        "Tight",
        "Weary",
        "Worn out"
      ]
    },
    {
      title: "Unsettled/Doubt",
      feelings: [
        "Apprehensive",
        "Concerned",
        "Dissatisfied",
        "Disturbed",
        "Grouchy",
        "Hesitant",
        "Inhibited",
        "Perplexed",
        "Questioning",
        "Rejecting",
        "Reluctant",
        "Shocked",
        "Skeptical",
        "Suspicious",
        "Ungrounded",
        "Unsure",
        "Worried"
      ]
    }
  ]

  const [openCategories, setOpenCategories] = useState<string[]>([])

  useEffect(() => {
    if (feelings?.feelings) {
      const initialOpenCategories = feelingsCategories
        .filter((category) =>
          category.feelings.some((f) => feelings.feelings.includes(f))
        )
        .map((category) => category.title)

      setOpenCategories((prevOpenCategories) => {
        const newOpenCategories = [
          ...new Set([...prevOpenCategories, ...initialOpenCategories])
        ]
        return newOpenCategories
      })
    }
  }, [feelings?.feelings])

  const handleValueChange = (value: string[]) => {
    setOpenCategories(value)
  }

  const expandAll = () => {
    setOpenCategories(feelingsCategories.map((category) => category.title))
  }

  const collapseAll = () => {
    setOpenCategories([])
  }

  return (
    <div>
      <div className="flex justify-center gap-4 mb-4">
        <button
          className="styled-button"
          onClick={() =>
            openCategories.length === feelingsCategories.length
              ? collapseAll()
              : expandAll()
          }
        >
          {openCategories.length === feelingsCategories.length
            ? "Collapse All"
            : "Expand All"}
        </button>
      </div>
      <Accordion
        type="multiple"
        value={openCategories}
        onValueChange={handleValueChange}
        className="grid md:grid-cols-2 gap-4 lg:grid-cols-3"
      >
        {feelingsCategories.map((category) => (
          <FeelingsAccordion
            key={category.title}
            title={category.title}
            feelingsList={category.feelings}
            value={category.title}
          />
        ))}
      </Accordion>
    </div>
  )
}
