import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs))
}

export function isDatePast(date: Date): boolean {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date < today
}

export function isDateFuture(date: Date): boolean {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date > today
}

export type EventType = 'personal' | 'work' | 'other';

export interface Event {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  description?: string;
  type: EventType;
}

export function exportEvents(events: Event[], format: 'json' | 'csv'): string {
  if (format === 'json') {
    return JSON.stringify(events, null, 2);
  } else {
    const header = 'id,title,date,startTime,endTime,description,type\n';
    const rows = events.map(event => 
      `${event.id},"${event.title}",${event.date},${event.startTime},${event.endTime},"${event.description || ''}",${event.type}`
    ).join('\n');
    return header + rows;
  }
}

