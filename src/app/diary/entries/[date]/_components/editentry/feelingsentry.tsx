import { useParams } from "next/navigation"
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
      const newFeelings = [
        ...feelings.feelings.filter((f) => f !== value),
        value
      ]
      update(newFeelings)
    } else {
      add([value])
    }
  }

  function FeelingsAccordion({
    feelingsList,
    title
  }: Readonly<{ feelingsList: string[]; title: string }>) {
    return (
      <AccordionItem value={title} className="border-b-0">
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

  const acceptingOpen = [
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

  const alivenessJoy = [
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

  const angryAnnoyed = [
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

  const courageousPowerful = [
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

  const connectedLoving = [
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

  const curious = [
    "Engaged",
    "Exploring",
    "Fascinated",
    "Interested",
    "Intrigued",
    "Involved",
    "Stimulated"
  ]

  const despairSad = [
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

  const disconnectedNumb = [
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

  const embarrassedShame = [
    "Ashamed",
    "Humiliated",
    "Inhibited",
    "Mortified",
    "Self-conscious",
    "Useless",
    "Weak",
    "Worthless"
  ]

  const fear = [
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

  const fragile = ["Helpless", "Sensitive"]

  const grateful = [
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

  const guilt = ["Regret", "Remorseful", "Sorry"]

  const hopeful = ["Encouraged", "Expectant", "Optimistic", "Trusting"]

  const powerless = ["Impotent", "Incapable", "Resigned", "Trapped", "Victim"]

  const tender = [
    "Calm",
    "Caring",
    "Loving",
    "Reflective",
    "Self-loving",
    "Serene",
    "Vulnerable",
    "Warm"
  ]

  const stressedTense = [
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

  const unsettledDoubt = [
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

  return (
    <Accordion type="multiple">
      <FeelingsAccordion title="Accepting/Open" feelingsList={acceptingOpen} />
      <FeelingsAccordion title="Aliveness/Joy" feelingsList={alivenessJoy} />
      <FeelingsAccordion title="Angry/Annoyed" feelingsList={angryAnnoyed} />
      <FeelingsAccordion
        title="Courageous/Powerful"
        feelingsList={courageousPowerful}
      />
      <FeelingsAccordion
        title="Connected/Loving"
        feelingsList={connectedLoving}
      />
      <FeelingsAccordion title="Curious" feelingsList={curious} />
      <FeelingsAccordion title="Despair/Sad" feelingsList={despairSad} />
      <FeelingsAccordion
        title="Disconnected/Numb"
        feelingsList={disconnectedNumb}
      />
      <FeelingsAccordion
        title="Embarrassed/Shame"
        feelingsList={embarrassedShame}
      />
      <FeelingsAccordion title="Fear" feelingsList={fear} />
      <FeelingsAccordion title="Fragile" feelingsList={fragile} />
      <FeelingsAccordion title="Grateful" feelingsList={grateful} />
      <FeelingsAccordion title="Guilt" feelingsList={guilt} />
      <FeelingsAccordion title="Hopeful" feelingsList={hopeful} />
      <FeelingsAccordion title="Powerless" feelingsList={powerless} />
      <FeelingsAccordion title="Tender" feelingsList={tender} />
      <FeelingsAccordion title="Stressed/Tense" feelingsList={stressedTense} />
      <FeelingsAccordion
        title="Unsettled/Doubt"
        feelingsList={unsettledDoubt}
      />
    </Accordion>
  )
}
