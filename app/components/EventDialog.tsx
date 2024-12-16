"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Event, EventType } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface EventDialogProps {
  date: Date
  selectedEvent: Event | null
  events: Event[]
  onClose: () => void
  onAdd: (event: Event) => void
  onEdit: (event: Event) => void
  onDelete: (eventId: string) => void
}

export function EventDialog({
  date,
  selectedEvent,
  events,
  onClose,
  onAdd,
  onEdit,
  onDelete
}: EventDialogProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [title, setTitle] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState<EventType>('personal')

  useEffect(() => {
    if (selectedEvent) {
      setEditingEvent(selectedEvent)
      setIsEditing(true)
      setTitle(selectedEvent.title)
      setStartTime(selectedEvent.startTime)
      setEndTime(selectedEvent.endTime)
      setDescription(selectedEvent.description || '')
      setType(selectedEvent.type)
    } else {
      resetForm()
    }
  }, [selectedEvent])

  const resetForm = () => {
    setEditingEvent(null)
    setIsEditing(false)
    setTitle('')
    setStartTime('')
    setEndTime('')
    setDescription('')
    setType('personal')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const eventData: Event = {
      id: editingEvent ? editingEvent.id : Date.now().toString(),
      title,
      date: date.toISOString().split('T')[0],
      startTime,
      endTime,
      description,
      type
    }
    
    if (editingEvent) {
      onEdit(eventData)
    } else {
      onAdd(eventData)
    }
    onClose()
  }

  const handleStartEditing = (event: Event) => {
    setEditingEvent(event)
    setIsEditing(true)
    setTitle(event.title)
    setStartTime(event.startTime)
    setEndTime(event.endTime)
    setDescription(event.description || '')
    setType(event.type)
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-white">
            {isEditing ? (editingEvent ? 'Edit Event' : 'Add New Event') : 'Events'} - {date.toLocaleDateString("default", { month: "long", day: "numeric", year: "numeric" })}
          </DialogTitle>
        </DialogHeader>
        {!isEditing ? (
          <div className="space-y-4">
            <AnimatePresence>
              {events.map(event => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{event.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {event.startTime} - {event.endTime}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Type: {event.type}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStartEditing(event)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(event.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <Button
              className="w-full"
              onClick={() => setIsEditing(true)}
            >
              Add New Event
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Event title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
                className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <Select value={type} onValueChange={(value) => setType(value as EventType)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="work">Work</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <div className="flex gap-2">
              <Button type="submit">
                {editingEvent ? 'Save Changes' : 'Add Event'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetForm()
                  if (editingEvent) {
                    setIsEditing(false)
                  }
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

