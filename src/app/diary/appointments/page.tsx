"use client"

import { useCallback, useEffect, useState } from "react"
import { Calendar } from "~/components/ui/calendar"
import { trpc } from "~/utils/trpc"
import PlusIcon from "../_components/icons/plusicon"
import CreateAppointmentModal from "./_components/createappointmentmodal"
import { format, parse } from "date-fns"
import { Button } from "~/components/ui/button"
import { debounce } from "lodash"
import TrashIcon from "../_components/icons/trashicon"

export default function AppointmentsPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [isCreateAppointmentModalOpen, setIsCreateAppointmentModalOpen] =
    useState(false)
  const [noteStates, setNoteStates] = useState<Record<number, string>>({})

  const { data: appointments } = trpc.appointments.all.useQuery()

  const utils = trpc.useUtils()

  const createNoteMutation = trpc.notes.post.useMutation({
    onSuccess: () => {
      utils.appointments.invalidate()
    }
  })
  const updateNoteMutation = trpc.notes.put.useMutation()
  const deleteNoteMutation = trpc.notes.delete.useMutation({
    onSuccess: () => {
      utils.appointments.invalidate()
    }
  })
  const deleteAppointmentMutation = trpc.appointments.delete.useMutation({
    onSuccess: () => {
      utils.appointments.invalidate()
    }
  })

  useEffect(() => {
    if (appointments) {
      const initialNoteStates: Record<number, string> = {}
      appointments.forEach((appointment) => {
        appointment.notes.forEach((note) => {
          initialNoteStates[note.id] = note.note
        })
      })
      setNoteStates(initialNoteStates)
    }
  }, [appointments])

  const handleCreateNote = (appointmentId: number) => {
    createNoteMutation.mutate({ appointmentId })
  }

  const handleUpdateNote = useCallback(
    debounce(
      (id: number, note: string) => {
        updateNoteMutation.mutate({ id, note })
      },
      1000,
      { trailing: true }
    ),
    []
  )

  const handleNoteChange = (id: number, note: string) => {
    setNoteStates((prev) => ({ ...prev, [id]: note }))
    handleUpdateNote(id, note)
  }

  const handleDeleteNote = (id: number) => {
    if (confirm("Are you sure you want to delete this note?")) {
      deleteNoteMutation.mutate({ id })
    }
  }

  const handleDeleteAppointment = (id: number) => {
    if (confirm("Are you sure you want to delete this appointment?")) {
      deleteAppointmentMutation.mutate({ id })
    }
  }

  return (
    <div className="w-full">
      <div className="text-outline-bold text-6xl text-center py-6">
        Appointments
      </div>
      <div className="max-w-3xl mx-auto">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => setSelectedDate(date ?? new Date())}
          dotValues={appointments?.map((appointment) => appointment.date) ?? []}
          showOutsideDays
          defaultMonth={selectedDate}
          className="rounded-md border bg-[--primary] w-fit mx-auto shadow-xl"
        />
        <div
          className="my-4 mx-auto flex gap-2 items-center bg-[--primary-dark] rounded-md p-4 cursor-pointer w-fit hover:bg-purple-600 transition-all duration-300"
          onClick={() => setIsCreateAppointmentModalOpen(true)}
        >
          <PlusIcon className="cursor-pointer mx-auto" color="#e0f0bb" />
          <h3 className="text-center text-sm text-[--primary]">
            Add Appointment
          </h3>
        </div>
      </div>
      {appointments?.find(
        (appointment) => appointment.date === format(selectedDate, "yyyy-MM-dd")
      ) && (
        <div className="max-w-3xl mx-auto">
          <div className="text-outline-bold text-3xl text-center py-6">
            Appointments for {format(selectedDate, "EEEE, MMMM do")}
          </div>
          <div className="mb-4">
            {appointments
              ?.filter(
                (appointment) =>
                  appointment.date === format(selectedDate, "yyyy-MM-dd")
              )
              .map((appointment) => (
                <div
                  key={appointment.id}
                  className="bg-[--primary] rounded-md p-4 grid grid-cols-[1fr,2fr] gap-4"
                >
                  <div className="flex flex-col items-center justify-center">
                    <div className="text-2xl text-center w-full">
                      {appointment.title}
                    </div>
                    <div className="text-sm">{appointment.description}</div>
                    <div>
                      <TrashIcon
                        className="cursor-pointer"
                        color="var(--primary-dark)"
                        onClick={() => handleDeleteAppointment(appointment.id)}
                      />
                    </div>
                  </div>
                  <div className="w-full text-center">
                    <div>
                      {appointment.notes.map((note) => (
                        <div className="flex justify-between items-center gap-2">
                          <div className="w-3 h-3 bg-[--primary-dark] rounded-full" />
                          <textarea
                            key={note.id}
                            value={noteStates[note.id] || ""}
                            onChange={(e) =>
                              handleNoteChange(note.id, e.target.value)
                            }
                            className="mb-2 w-full p-2 bg-purple-50 rounded-lg"
                            rows={3}
                            placeholder="Add a note..."
                          />
                          <TrashIcon
                            className="cursor-pointer"
                            color="var(--primary-dark)"
                            onClick={() => handleDeleteNote(note.id)}
                          />
                        </div>
                      ))}
                    </div>
                    <div>
                      <Button
                        className="styled-button-dark hover:bg-green-950 hover:text-white"
                        onClick={() => handleCreateNote(appointment.id)}
                      >
                        Add Note
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
      {isCreateAppointmentModalOpen && (
        <CreateAppointmentModal
          defaultDate={selectedDate}
          onClose={() => setIsCreateAppointmentModalOpen(false)}
        />
      )}
    </div>
  )
}
