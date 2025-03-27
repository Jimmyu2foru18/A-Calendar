"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { addDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameDay } from 'date-fns';

// Define types for our calendar events
export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  allDay?: boolean;
  color?: string;
  location?: string;
  category?: string;
  reminder?: boolean;
  reminderTime?: number; // minutes before event
}

export type CalendarView = 'day' | 'week' | 'month' | 'year';

interface CalendarContextType {
  events: CalendarEvent[];
  selectedDate: Date;
  view: CalendarView;
  addEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  updateEvent: (event: CalendarEvent) => void;
  deleteEvent: (id: string) => void;
  setSelectedDate: (date: Date) => void;
  setView: (view: CalendarView) => void;
  getEventsForDate: (date: Date) => CalendarEvent[];
  getEventsForRange: (start: Date, end: Date) => CalendarEvent[];
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export function CalendarProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [view, setView] = useState<CalendarView>('month');

  // Load events from localStorage on initial render
  useEffect(() => {
    const savedEvents = localStorage.getItem('calendarEvents');
    if (savedEvents) {
      try {
        const parsedEvents = JSON.parse(savedEvents);
        // Convert string dates back to Date objects
        const eventsWithDates = parsedEvents.map((event: any) => ({
          ...event,
          startDate: new Date(event.startDate),
          endDate: event.endDate ? new Date(event.endDate) : undefined,
        }));
        setEvents(eventsWithDates);
      } catch (error) {
        console.error('Failed to parse saved events', error);
      }
    }
  }, []);

  // Save events to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('calendarEvents', JSON.stringify(events));
  }, [events]);

  const addEvent = (eventData: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: crypto.randomUUID(),
    };
    setEvents((prevEvents) => [...prevEvents, newEvent]);
  };

  const updateEvent = (updatedEvent: CalendarEvent) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
  };

  const deleteEvent = (id: string) => {
    setEvents((prevEvents) => prevEvents.filter((event) => event.id !== id));
  };

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => 
      isSameDay(new Date(event.startDate), date)
    );
  };

  const getEventsForRange = (start: Date, end: Date) => {
    return events.filter((event) => {
      const eventStart = new Date(event.startDate);
      return eventStart >= start && eventStart <= end;
    });
  };

  return (
    <CalendarContext.Provider
      value={{
        events,
        selectedDate,
        view,
        addEvent,
        updateEvent,
        deleteEvent,
        setSelectedDate,
        setView,
        getEventsForDate,
        getEventsForRange,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendar() {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
}