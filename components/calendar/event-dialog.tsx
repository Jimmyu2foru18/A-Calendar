"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { useCalendar, CalendarEvent } from '@/context/calendar-context';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface EventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date;
  eventToEdit?: CalendarEvent;
}

export function EventDialog({ open, onOpenChange, selectedDate, eventToEdit }: EventDialogProps) {
  const { addEvent, updateEvent } = useCalendar();
  const isEditing = !!eventToEdit;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<Omit<CalendarEvent, 'id'>>({
    defaultValues: eventToEdit ? {
      title: eventToEdit.title,
      description: eventToEdit.description,
      startDate: eventToEdit.startDate,
      endDate: eventToEdit.endDate,
      allDay: eventToEdit.allDay,
      location: eventToEdit.location,
      category: eventToEdit.category,
      color: eventToEdit.color,
    } : {
      startDate: selectedDate,
      allDay: false,
    }
  });

  const onSubmit = (data: Omit<CalendarEvent, 'id'>) => {
    if (isEditing && eventToEdit) {
      updateEvent({
        ...data,
        id: eventToEdit.id,
      });
    } else {
      addEvent(data);
    }
    
    onOpenChange(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Event' : 'Add New Event'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Event title"
              {...register('title', { required: true })}
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && <p className="text-red-500 text-xs">Title is required</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Event description"
              {...register('description')}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="datetime-local"
                {...register('startDate', { 
                  required: true,
                  valueAsDate: true,
                })}
                defaultValue={format(selectedDate, "yyyy-MM-dd'T'HH:mm")}
                className={errors.startDate ? 'border-red-500' : ''}
              />
              {errors.startDate && <p className="text-red-500 text-xs">Start date is required</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="datetime-local"
                {...register('endDate', { valueAsDate: true })}
                defaultValue={format(selectedDate, "yyyy-MM-dd'T'HH:mm")}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox id="allDay" {...register('allDay')} />
            <Label htmlFor="allDay">All day event</Label>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="Event location"
              {...register('location')}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              placeholder="Event category"
              {...register('category')}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="color">Color</Label>
            <Input
              id="color"
              type="color"
              {...register('color')}
              defaultValue="#3b82f6"
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{isEditing ? 'Update' : 'Create'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}