"use client";

import React, { useState } from 'react';
import { useCalendar } from '@/context/calendar-context';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EventDialog } from './event-dialog';
import { EventList } from './event-list';

export function Calendar() {
  const { selectedDate, setSelectedDate, getEventsForDate } = useCalendar();
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  // Get the day of the week for the first day of the month (0 = Sunday, 6 = Saturday)
  const startDay = startOfMonth(currentMonth).getDay();
  
  // Create an array of empty cells for days before the first day of the month
  const emptyCells = Array.from({ length: startDay }, (_, i) => i);

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-bold">{format(currentMonth, 'MMMM yyyy')}</h2>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Button onClick={() => setIsEventDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center font-medium py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {emptyCells.map((i) => (
          <div key={`empty-${i}`} className="h-24 p-1 border rounded-md bg-gray-50 dark:bg-gray-800/20"></div>
        ))}
        
        {days.map((day) => {
          const events = getEventsForDate(day);
          const isSelected = isSameDay(day, selectedDate);
          
          return (
            <div
              key={day.toString()}
              className={cn(
                "h-24 p-1 border rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-800/50 overflow-hidden",
                isSelected ? "ring-2 ring-primary" : "",
                !isSameMonth(day, currentMonth) ? "bg-gray-50 text-gray-400" : "",
                isToday(day) ? "bg-blue-50 dark:bg-blue-900/20" : ""
              )}
              onClick={() => setSelectedDate(day)}
            >
              <div className="flex justify-between">
                <span className={cn(
                  "font-medium text-sm",
                  isToday(day) ? "text-blue-600 dark:text-blue-400" : ""
                )}>
                  {format(day, 'd')}
                </span>
                {events.length > 0 && (
                  <span className="text-xs bg-primary text-primary-foreground rounded-full px-1.5">
                    {events.length}
                  </span>
                )}
              </div>
              
              <div className="mt-1 space-y-1">
                {events.slice(0, 2).map((event) => (
                  <div 
                    key={event.id}
                    className="text-xs truncate p-1 rounded-sm bg-primary/10 text-primary"
                    title={event.title}
                  >
                    {event.title}
                  </div>
                ))}
                {events.length > 2 && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    +{events.length - 2} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">
          Events for {format(selectedDate, 'MMMM d, yyyy')}
        </h3>
        <EventList date={selectedDate} />
      </div>

      <EventDialog 
        open={isEventDialogOpen} 
        onOpenChange={setIsEventDialogOpen}
        selectedDate={selectedDate}
      />
    </div>
  );
}