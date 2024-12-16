"use client"

import { useState, useEffect } from "react"
import { BackgroundLines } from "./components/BackgroundLines"
import { CalendarGrid } from "./components/CalendarGrid"
import { EventDialog } from "./components/EventDialog"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Moon, Sun, Download } from 'lucide-react'
import { cn, Event, EventType, exportEvents } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const formatDate = (dateString: string) => {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [showEventDialog, setShowEventDialog] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [searchQuery, setSearchQuery] = useState('')
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const storedEvents = localStorage.getItem('events')
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events))
  }, [events])

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  const checkOverlap = (newEvent: Event, existingEvents: Event[]) => {
    return existingEvents.some(event => 
      event.date === newEvent.date &&
      ((newEvent.startTime >= event.startTime && newEvent.startTime < event.endTime) ||
       (newEvent.endTime > event.startTime && newEvent.endTime <= event.endTime) ||
       (newEvent.startTime <= event.startTime && newEvent.endTime >= event.endTime))
    )
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    setSelectedEvent(null)
    setShowEventDialog(true)
  }

  const handleAddEvent = (newEvent: Event) => {
    if (checkOverlap(newEvent, events)) {
      alert("This event overlaps with an existing event. Please choose a different time.")
      return
    }
    setEvents([...events, newEvent])
    setShowEventDialog(false)
  }

  const handleEditEvent = (updatedEvent: Event) => {
    const otherEvents = events.filter(event => event.id !== updatedEvent.id)
    if (checkOverlap(updatedEvent, otherEvents)) {
      alert("This event overlaps with an existing event. Please choose a different time.")
      return
    }
    setEvents(events.map(event =>
      event.id === updatedEvent.id ? updatedEvent : event
    ))
    setShowEventDialog(false)
    setSelectedEvent(null)
  }

  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter(event => event.id !== eventId))
    setShowEventDialog(false)
    setSelectedEvent(null)
  }

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleExport = (format: 'json' | 'csv') => {
    const exportData = exportEvents(events, format)
    const blob = new Blob([exportData], { type: format === 'json' ? 'application/json' : 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `calendar_events.${format}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <BackgroundLines>
      <div className="container mx-auto p-4">
        <Card className="w-full max-w-md mx-auto bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-semibold dark:text-white">Calendar</h1>
              <div className="flex items-center gap-2">
                <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                  <ChevronLeft className="w-4 h-4 dark:text-white" />
                </button>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {new Date(currentYear, currentMonth).toLocaleString("default", { month: "long", year: "numeric" })}
                </span>
                <button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                  <ChevronRight className="w-4 h-4 dark:text-white" />
                </button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </div>
            </div>
            <CalendarGrid
              currentDate={new Date(currentYear, currentMonth)}
              events={events}
              onDateClick={handleDateClick}
            />
          </CardContent>
        </Card>
        <Card className="w-full max-w-md mx-auto mt-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <Input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-2/3 dark:bg-gray-700 dark:text-white"
              />
              <Select onValueChange={(value) => handleExport(value as 'json' | 'csv')}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Export" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="json">Export as JSON</SelectItem>
                  <SelectItem value="csv">Export as CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <h2 className="text-lg font-semibold mb-2 dark:text-white">Upcoming Events</h2>
            <ul className="space-y-2">
              {filteredEvents.map(event => (
                <li key={event.id} className="flex justify-between items-center dark:text-white">
                  <span>{event.title}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{formatDate(event.date)}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        {showEventDialog && selectedDate && (
          <EventDialog
            date={selectedDate}
            selectedEvent={selectedEvent}
            events={events.filter(event =>
              event.date === selectedDate.toISOString().split('T')[0]
            )}
            onClose={() => {
              setShowEventDialog(false)
              setSelectedEvent(null)
            }}
            onAdd={handleAddEvent}
            onEdit={handleEditEvent}
            onDelete={handleDeleteEvent}
          />
        )}
      </div>
    </BackgroundLines>
  )
}

