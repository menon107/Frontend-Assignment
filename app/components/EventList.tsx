"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { motion } from "framer-motion"

interface Event {
  id: string
  title: string
  time: string
  type: "blue" | "green" | "red"
}

interface EventListProps {
  date: Date
  onClose: () => void
}

export default function EventList({ date, onClose }: EventListProps) {
  const events: Event[] = [
    { id: "1", title: "Culture Fit Assessment", time: "9:00 AM", type: "blue" },
    { id: "2", title: "Session Planned", time: "10:00 AM", type: "green" },
    { id: "3", title: "Final Case Progress Review", time: "3:00 PM", type: "red" },
  ]

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-4">
            {date.toLocaleDateString("default", { month: "long", day: "numeric" })}
          </h3>
          <div className="space-y-4">
            {events.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4"
              >
                <div
                  className={cn(
                    "w-3 h-3 rounded-full",
                    event.type === "blue" && "bg-blue-500",
                    event.type === "green" && "bg-green-500",
                    event.type === "red" && "bg-red-500"
                  )}
                />
                <div>
                  <p className="font-medium">{event.title}</p>
                  <p className="text-sm text-gray-500">{event.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

