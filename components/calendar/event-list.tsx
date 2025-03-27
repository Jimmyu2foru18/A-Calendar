"use client";

import React, { useState } from 'react';
import { useCalendar, CalendarEvent } from '@/context/calendar-context';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Edit, Trash2, MapPin, Calendar as CalendarIcon } from 'lucide-react';
import { EventDialog } from './event-dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface EventListProps {
  date: Date;
}

export function EventList({ date }: EventListProps) {
  const { getEventsForDate, deleteEvent } = useCalendar();
  const [eventToEdit, setEventToEdit] = useState<CalendarEvent | undefined>(undefined);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  
  const events = getEventsForDate(date);

  const handleEdit = (event: CalendarEvent) => {
    setEventToEdit(event);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setEventToDelete(id);
  };

  const confirmDelete = () => {
    if (eventToDelete) {
      deleteEvent(eventToDelete);
      setEventToDelete(null);
    }
  };

  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No events scheduled for this day
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <Card key={event.id} className="overflow-hidden">
          <div 
            className="h-2" 
            style={{ backgroundColor: event.color || '#3b82f6' }}
          />
          <CardHeader className="pb-2">
            <CardTitle>{event.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {event.description && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {event.description}
              </p>
            )}
            
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <CalendarIcon className="h-4 w-4 mr-2" />
              <span>
                {format(new Date(event.startDate), 'h:mm a')}
                {event.endDate && ` - ${format(new Date(event.endDate), 'h:mm a')}`}
                {event.allDay && ' (All day)'}
              </span>
            </div>
            
            {event.location && (
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{event.location}</span>
              </div>
            )}
            
            {event.category && (
              <div className="mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                  {event.category}
                </span>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end space-x-2 pt-0">
            <Button variant="outline" size="sm" onClick={() => handleEdit(event)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline" size="sm" className="text-red-500" onClick={() => handleDelete(event.id)}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </CardFooter>
        </Card>
      ))}
      
      <EventDialog 
        open={isEditDialogOpen} 
        onOpenChange={setIsEditDialogOpen}
        selectedDate={date}
        eventToEdit={eventToEdit}
      />
      
      <AlertDialog open={!!eventToDelete} onOpenChange={() => setEventToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the event.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}