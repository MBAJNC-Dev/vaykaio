import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';

const AddActivityModal = ({ isOpen, onClose, tripId, dayId, onActivityAdded }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    time: '',
    endTime: '',
    location: '',
    category: 'activity',
    duration: '',
    cost: '',
    notes: ''
  });

  const categoryOptions = [
    { value: 'breakfast', label: 'Breakfast', color: 'bg-orange-100' },
    { value: 'lunch', label: 'Lunch', color: 'bg-orange-100' },
    { value: 'dinner', label: 'Dinner', color: 'bg-orange-100' },
    { value: 'activity', label: 'Activity', color: 'bg-blue-100' },
    { value: 'transport', label: 'Transport', color: 'bg-gray-100' },
    { value: 'accommodation', label: 'Accommodation', color: 'bg-green-100' },
    { value: 'rest', label: 'Rest/Break', color: 'bg-green-100' }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Activity name is required';
    }

    if (formData.time && formData.endTime) {
      const [startH, startM] = formData.time.split(':').map(Number);
      const [endH, endM] = formData.endTime.split(':').map(Number);
      const startMinutes = startH * 60 + startM;
      const endMinutes = endH * 60 + endM;

      if (endMinutes <= startMinutes) {
        newErrors.endTime = 'End time must be after start time';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSelectChange = (value) => {
    setFormData(prev => ({ ...prev, category: value }));
  };

  const calculateDuration = () => {
    if (formData.time && formData.endTime) {
      const [startH, startM] = formData.time.split(':').map(Number);
      const [endH, endM] = formData.endTime.split(':').map(Number);
      const startMinutes = startH * 60 + startM;
      const endMinutes = endH * 60 + endM;
      return endMinutes - startMinutes;
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const duration = formData.duration ? Number(formData.duration) : calculateDuration();

      const record = await pb.collection('itinerary_items').create({
        itinerary_day_id: dayId,
        name: formData.name.trim(),
        time: formData.time,
        location: formData.location.trim(),
        category: formData.category,
        duration: duration,
        cost: formData.cost ? Number(formData.cost) : 0,
        notes: formData.notes.trim(),
        order: 0
      }, { $autoCancel: false });

      toast.success('Activity added successfully');
      onActivityAdded(record);
      onClose();
      setFormData({
        name: '', time: '', endTime: '', location: '', category: 'activity', duration: '', cost: '', notes: ''
      });
      setErrors({});
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Failed to add activity');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '', time: '', endTime: '', location: '', category: 'activity', duration: '', cost: '', notes: ''
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Activity to Your Itinerary</DialogTitle>
          <DialogDescription>Fill in the details for this activity, meal, or event</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Activity Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="font-semibold">Activity Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Visit Eiffel Tower, Have lunch at a bistro"
              className={errors.name ? 'border-destructive' : ''}
              disabled={loading}
            />
            {errors.name && (
              <div className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="w-4 h-4" />
                {errors.name}
              </div>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category" className="font-semibold">Activity Type</Label>
            <Select value={formData.category} onValueChange={handleSelectChange} disabled={loading}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Time Section */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="time" className="font-semibold">Start Time</Label>
              <Input
                id="time"
                name="time"
                type="time"
                value={formData.time}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime" className="font-semibold">End Time</Label>
              <Input
                id="endTime"
                name="endTime"
                type="time"
                value={formData.endTime}
                onChange={handleChange}
                disabled={loading}
                className={errors.endTime ? 'border-destructive' : ''}
              />
              {errors.endTime && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="w-4 h-4" />
                  {errors.endTime}
                </div>
              )}
            </div>
          </div>

          {/* Duration and Cost */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration" className="font-semibold">Duration (minutes)</Label>
              <Input
                id="duration"
                name="duration"
                type="number"
                min="0"
                value={formData.duration}
                onChange={handleChange}
                placeholder={calculateDuration()?.toString() || '120'}
                disabled={loading}
              />
              {calculateDuration() && !formData.duration && (
                <p className="text-xs text-muted-foreground">Auto: {calculateDuration()} min</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="cost" className="font-semibold">Estimated Cost ($)</Label>
              <Input
                id="cost"
                name="cost"
                type="number"
                min="0"
                step="0.01"
                value={formData.cost}
                onChange={handleChange}
                placeholder="0.00"
                disabled={loading}
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="font-semibold">Location</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Address, venue name, or neighborhood"
              disabled={loading}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="font-semibold">Notes & Details</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Booking confirmations, tips, allergies, special instructions..."
              rows={3}
              disabled={loading}
              className="resize-none"
            />
          </div>

          <DialogFooter className="gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || Object.keys(errors).length > 0}
              className="gap-2"
            >
              {loading ? 'Adding...' : 'Add Activity'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddActivityModal;
