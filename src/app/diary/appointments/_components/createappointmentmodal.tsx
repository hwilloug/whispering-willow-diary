import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "~/components/ui/dialog"
import { date, object, string } from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import { trpc } from "~/utils/trpc"
import { format } from "date-fns"

export default function CreateAppointmentModal({
  onClose,
  defaultDate = new Date()
}: {
  onClose: () => void
  defaultDate?: Date
}) {
  const utils = trpc.useUtils()

  const createAppointment = trpc.appointments.post.useMutation({
    onSuccess: () => {
      utils.appointments.invalidate()
    }
  })

  const schema = object({
    title: string().required("Title is required"),
    description: string(),
    date: date().required("Date is required")
  })

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  })

  const onSubmit = (data: any) => {
    createAppointment.mutate({
      title: data.title,
      date: format(new Date(data.date), "yyyy-MM-dd"),
      description: data.description
    })
    onClose()
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-[--primary]">
        <DialogHeader>
          <DialogTitle>Create Appointment</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input
                  id="title"
                  {...register("title")}
                  placeholder="Title"
                  className="bg-purple-200"
                />
                <p>{errors.title?.message}</p>
              </div>
              <div>
                <Input
                  id="date"
                  defaultValue={format(defaultDate, "yyyy-MM-dd")}
                  {...register("date")}
                  type="date"
                  className="bg-purple-200"
                />
                <p>{errors.date?.message}</p>
              </div>
            </div>
            <div>
              <Input
                id="description"
                {...register("description")}
                placeholder="Description"
                className="bg-purple-200"
              />
              <p>{errors.description?.message}</p>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                className="bg-purple-500 hover:bg-purple-600"
              >
                Create
              </Button>
            </DialogFooter>
          </form>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  )
}
