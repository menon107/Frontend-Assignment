"use client"

import { motion } from "framer-motion"
import { cn, Event, EventType } from "@/lib/utils"

interface CalendarGridProps {
  currentDate: Date
  events: Event[]
  onDateClick: (date: Date) => void
}

export function CalendarGrid({ currentDate, events, onDateClick }: CalendarGridProps) {
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const days = []
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    for (let i = firstDay.getDay(); i > 0; i--) {
      days.push(new Date(year, month, -i + 1))
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i))
    }

    const remainingDays = 7 - (days.length % 7)
    if (remainingDays < 7) {
      for (let i = 1; i <= remainingDays; i++) {
        days.push(new Date(year, month + 1, i))
      }
    }

    return days
  }

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear()
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear()
  }

  const getEventForDate = (date: Date) => {
    return events.find(event => event.date === date.toISOString().split('T')[0])
  }

  const getEventColor = (type: EventType) => {
    switch (type) {
      case 'personal':
        return 'bg-blue-500'
      case 'work':
        return 'bg-green-500'
      case 'other':
        return 'bg-purple-500'
      default:
        return 'bg-gray-500'
    }
  }

  const days = getDaysInMonth(currentDate)

  return (
    <div className="grid grid-cols-7 gap-1">
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
        <div key={day} className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2">
          {day}
        </div>
      ))}
      {days.map((date, index) => {
        const event = getEventForDate(date)
        return (
          <motion.button
            key={index}
            onClick={() => onDateClick(date)}
            className={cn(
              "relative p-4 text-center focus:outline-none rounded-full",
              !isCurrentMonth(date) && "text-gray-400 dark:text-gray-600",
              isToday(date) && "bg-blue-100 dark:bg-blue-900"
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">
              {date.getDate()}
            </span>
            {event && (
              <motion.div
                className={cn(
                  "absolute inset-1 rounded-full",
                  getEventColor(event.type)
                )}
                layoutId={`date-${date.toISOString()}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              />
            )}
          </motion.button>
        )
      })}
    </div>
  )
}

