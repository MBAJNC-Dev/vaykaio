import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Utensils, Clock, Plus, Trash2, Copy, Toggle2 } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';

const RoutineTemplateManager = ({ tripId }) => {
  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    time: '',
    duration: 45,
    icon: 'breakfast'
  });

  useEffect(() => {
    fetchRoutines();
  }, [tripId]);

  const fetchRoutines = async () => {
    try {
      const records = await pb.collection('routine_templates').getFullList({
        filter: `trip_id = "${tripId}"`,
        sort: 'created',
        $autoCancel: false
      });
      setRoutines(records);
    } catch (error) {
      console.error('Failed to fetch routines:', error);
      // Initialize with default routines if none exist
      initializeDefaultRoutines();
    } finally {
      setLoading(false);
    }
  };

  const initializeDefaultRoutines = () => {
    setRoutines([
      { id: '1', name: 'Breakfast', time: '08:00', duration: 45, icon: 'breakfast', enabled: true },
      { id: '2', name: 'Lunch', time: '13:00', duration: 60, icon: 'lunch', enabled: true },
      { id: '3', name: 'Dinner', time: '19:30', duration: 90, icon: 'dinner', enabled: true }
    ]);
  };

  const handleAddRoutine = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.time) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const record = await pb.collection('routine_templates').create({
        trip_id: tripId,
        name: formData.name,
        time: formData.time,
        duration: Number(formData.duration),
        icon: formData.icon,
        enabled: true
      }, { $autoCancel: false });

      setRoutines([...routines, record]);
      toast.success('Routine added');
      setIsAddModalOpen(false);
      setFormData({ name: '', time: '', duration: 45, icon: 'breakfast' });
    } catch (error) {
      console.error(error);
      toast.error('Failed to add routine');
    }
  };

  const handleToggleRoutine = async (id, enabled) => {
    try {
      const updated = await pb.collection('routine_templates').update(id, {
        enabled: !enabled
      }, { $autoCancel: false });

      setRoutines(routines.map(r => r.id === id ? updated : r));
      toast.success(enabled ? 'Routine disabled' : 'Routine enabled');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update routine');
    }
  };

  const handleDeleteRoutine = async (id) => {
    if (!window.confirm('Delete this routine template?')) return;

    try {
      await pb.collection('routine_templates').delete(id, { $autoCancel: false });
      setRoutines(routines.filter(r => r.id !== id));
      toast.success('Routine deleted');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete routine');
    }
  };

  const handleApplyToAllDays = async () => {
    try {
      const enabledRoutines = routines.filter(r => r.enabled);
      if (enabledRoutines.length === 0) {
        toast.error('Enable at least one routine first');
        return;
      }

      // Get all days for this trip
      const days = await pb.collection('itinerary_days').getFullList({
        filter: `trip_id = "${tripId}"`,
        $autoCancel: false
      });

      let count = 0;
      for (const routine of enabledRoutines) {
        for (const day of days) {
          await pb.collection('itinerary_items').create({
            itinerary_day_id: day.id,
            name: routine.name,
            time: routine.time,
            category: routine.icon,
            duration: routine.duration,
            cost: 0,
            notes: 'Daily routine',
            order: 0
          }, { $autoCancel: false });
          count++;
        }
      }

      toast.success(`Applied ${count} routine items across all days`);
    } catch (error) {
      console.error(error);
      toast.error('Failed to apply routines');
    }
  };

  const getIcon = (icon) => {
    return <Utensils className="w-5 h-5" />;
  };

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Loading routines...</div>;
  }

  return (
    <Card>
      <CardHeader className="bg-muted/30 border-b">
        <div className="flex items-center justify-between">
          <CardTitle>Daily Routines</CardTitle>
          <Button size="sm" onClick={() => setIsAddModalOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Routine
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-4">
        {routines.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No routines yet. Create one to apply across all days.</p>
            <Button
              variant="link"
              onClick={() => setIsAddModalOpen(true)}
              className="mt-2"
            >
              Add your first routine
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {routines.map((routine) => (
                <div
                  key={routine.id}
                  className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                    routine.enabled
                      ? 'bg-muted/30 border-muted'
                      : 'bg-muted/10 border-muted opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <span className="p-2 bg-white rounded-lg">
                      {getIcon(routine.icon)}
                    </span>
                    <div>
                      <p className="font-semibold">{routine.name}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {routine.time} ({routine.duration} min)
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleToggleRoutine(routine.id, routine.enabled)}
                      title={routine.enabled ? 'Disable' : 'Enable'}
                      className={routine.enabled ? 'text-green-600' : 'text-muted-foreground'}
                    >
                      <Toggle2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteRoutine(routine.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              className="w-full gap-2 mt-4"
              onClick={handleApplyToAllDays}
            >
              <Copy className="w-4 h-4" />
              Apply to All Days
            </Button>
          </>
        )}
      </CardContent>

      {/* Add Routine Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Add Daily Routine</DialogTitle>
            <DialogDescription>Create a routine template to apply across your trip</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddRoutine} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="routine-name">Routine Name *</Label>
              <Input
                id="routine-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Breakfast, Yoga Session"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="routine-time">Time *</Label>
                <Input
                  id="routine-time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="routine-duration">Duration (min) *</Label>
                <Input
                  id="routine-duration"
                  type="number"
                  min="15"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="routine-type">Type</Label>
              <Select value={formData.icon} onValueChange={(v) => setFormData({ ...formData, icon: v })}>
                <SelectTrigger id="routine-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="breakfast">Breakfast</SelectItem>
                  <SelectItem value="lunch">Lunch</SelectItem>
                  <SelectItem value="dinner">Dinner</SelectItem>
                  <SelectItem value="activity">Activity</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Routine</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default RoutineTemplateManager;
