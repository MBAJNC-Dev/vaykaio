import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Plus, MapPin, Clock, DollarSign, Calendar as CalendarIcon, ChevronLeft, Trash2, GripVertical, AlertCircle } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';
import { format, addDays } from 'date-fns';
import AddActivityModal from '@/components/AddActivityModal.jsx';

const ItineraryBuilderPage = () => {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [days, setDays] = useState([]);
  const [items, setItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDayId, setSelectedDayId] = useState(null);
  const [editingItemId, setEditingItemId] = useState(null);

  useEffect(() => {
    fetchTripAndItinerary();
  }, [tripId]);

  const fetchTripAndItinerary = async () => {
    try {
      const tripRecord = await pb.collection('trips').getOne(tripId, { $autoCancel: false });
      setTrip(tripRecord);

      let daysRecords = await pb.collection('itinerary_days').getFullList({
        filter: `trip_id = "${tripId}"`,
        sort: 'day_number',
        $autoCancel: false
      });

      if (daysRecords.length === 0) {
        const startDate = new Date(tripRecord.start_date);
        const endDate = new Date(tripRecord.end_date);
        const totalDays = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

        const newDays = [];
        for (let i = 0; i < totalDays; i++) {
          const currentDate = addDays(startDate, i);
          const dayRecord = await pb.collection('itinerary_days').create({
            trip_id: tripId,
            day_number: i + 1,
            date: currentDate.toISOString(),
            notes: ''
          }, { $autoCancel: false });
          newDays.push(dayRecord);
        }
        daysRecords = newDays;
      }
      setDays(daysRecords);

      const dayIds = daysRecords.map(d => `"${d.id}"`).join(',');
      if (dayIds) {
        const itemsRecords = await pb.collection('itinerary_items').getFullList({
          filter: `itinerary_day_id ?= [${dayIds}]`,
          sort: 'time,order',
          $autoCancel: false
        });

        const groupedItems = {};
        daysRecords.forEach(d => { groupedItems[d.id] = []; });
        itemsRecords.forEach(item => {
          if (groupedItems[item.itinerary_day_id]) {
            groupedItems[item.itinerary_day_id].push(item);
          }
        });
        setItems(groupedItems);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load itinerary');
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (category) => {
    const colors = {
      breakfast: 'bg-orange-100 text-orange-800 border-orange-200',
      lunch: 'bg-orange-100 text-orange-800 border-orange-200',
      dinner: 'bg-orange-100 text-orange-800 border-orange-200',
      activity: 'bg-blue-100 text-blue-800 border-blue-200',
      transport: 'bg-gray-100 text-gray-800 border-gray-200',
      accommodation: 'bg-purple-100 text-purple-800 border-purple-200',
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const detectConflicts = (dayItems) => {
    const conflicts = new Set();
    if (dayItems.length < 2) return conflicts;

    for (let i = 0; i < dayItems.length - 1; i++) {
      const current = dayItems[i];
      const next = dayItems[i + 1];

      if (current.time && next.time && current.duration) {
        const [currH, currM] = current.time.split(':').map(Number);
        const [nextH, nextM] = next.time.split(':').map(Number);

        const currStart = currH * 60 + currM;
        const currEnd = currStart + (current.duration || 60);
        const nextStart = nextH * 60 + nextM;

        if (nextStart < currEnd) {
          conflicts.add(current.id);
          conflicts.add(next.id);
        }
      }
    }
    return conflicts;
  };

  const handleOpenAddModal = (dayId) => {
    setSelectedDayId(dayId);
    setEditingItemId(null);
    setIsAddModalOpen(true);
  };

  const handleActivityAdded = (newItem) => {
    setItems(prev => ({
      ...prev,
      [newItem.itinerary_day_id]: [...(prev[newItem.itinerary_day_id] || []), newItem].sort((a, b) => (a.time || '24:00').localeCompare(b.time || '24:00'))
    }));
    toast.success('Activity added');
  };

  const handleDeleteActivity = async (itemId, dayId) => {
    if (!window.confirm('Remove this activity?')) return;
    try {
      await pb.collection('itinerary_items').delete(itemId, { $autoCancel: false });
      setItems(prev => ({
        ...prev,
        [dayId]: prev[dayId].filter(item => item.id !== itemId)
      }));
      toast.success('Activity removed');
    } catch (error) {
      toast.error('Failed to remove activity');
    }
  };

  if (loading) {
    return (
      <>
        <Helmet><title>Itinerary Builder - VaykAIo</title></Helmet>
        <div className="p-8 space-y-6">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet><title>Itinerary Builder - VaykAIo</title></Helmet>
      <div className="space-y-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link to={`/trip/${tripId}/itinerary`}><ChevronLeft className="w-5 h-5" /></Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight">Itinerary Builder</h1>
            <p className="text-muted-foreground flex items-center gap-2 mt-1">
              <MapPin className="w-4 h-4" /> {trip?.destination}
            </p>
          </div>
          <Button asChild variant="outline">
            <Link to={`/trip/${tripId}/ai-itinerary`}>AI Generator</Link>
          </Button>
        </div>

        <div className="space-y-8">
          {days.map((day) => {
            const dayItems = items[day.id] || [];
            const conflicts = detectConflicts(dayItems);
            const hasConflicts = conflicts.size > 0;

            return (
              <Card key={day.id} className="overflow-hidden border-t-4 border-t-primary shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="bg-gradient-to-r from-muted/50 to-muted/20 pb-4 flex flex-row items-center justify-between border-b">
                  <div className="flex-1">
                    <CardTitle className="text-2xl flex items-center gap-2">
                      Day {day.day_number}
                      {hasConflicts && (
                        <AlertCircle className="w-5 h-5 text-destructive" />
                      )}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {format(new Date(day.date), 'EEEE, MMMM d, yyyy')}
                    </p>
                  </div>
                  <Button size="sm" onClick={() => handleOpenAddModal(day.id)} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Activity
                  </Button>
                </CardHeader>

                <CardContent className="p-0">
                  {hasConflicts && (
                    <div className="bg-destructive/5 border-b border-destructive/20 p-4 flex gap-3">
                      <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-destructive">
                        Time conflicts detected. Check overlapping activities below.
                      </div>
                    </div>
                  )}

                  {dayItems.length > 0 ? (
                    <div className="divide-y">
                      {dayItems.map((item) => (
                        <div
                          key={item.id}
                          className={`p-4 hover:bg-muted/5 transition-colors flex flex-col sm:flex-row gap-4 group ${
                            conflicts.has(item.id) ? 'bg-destructive/5 border-l-4 border-l-destructive' : ''
                          }`}
                        >
                          <div className="sm:w-28 flex-shrink-0">
                            <div className="text-sm font-medium text-muted-foreground">
                              {item.time ? item.time : 'Anytime'}
                            </div>
                            {item.duration && (
                              <div className="text-xs text-muted-foreground">
                                {item.duration}min
                              </div>
                            )}
                          </div>

                          <div className="flex-1 space-y-2 min-w-0">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="cursor-grab active:cursor-grabbing opacity-40">
                                    <GripVertical className="w-4 h-4" />
                                  </div>
                                  <h4 className="font-semibold text-lg truncate">{item.name}</h4>
                                </div>

                                {item.location && (
                                  <p className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
                                    <MapPin className="w-3 h-3 flex-shrink-0" />
                                    <span className="truncate">{item.location}</span>
                                  </p>
                                )}

                                {item.cost > 0 && (
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                    <DollarSign className="w-3 h-3" />
                                    ${item.cost.toFixed(2)}
                                  </div>
                                )}

                                {item.notes && (
                                  <p className="text-sm bg-muted/30 p-2 rounded mt-2">{item.notes}</p>
                                )}
                              </div>

                              <Badge variant="outline" className={`capitalize flex-shrink-0 ${getTypeColor(item.category)}`}>
                                {item.category}
                              </Badge>
                            </div>
                          </div>

                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 flex-shrink-0">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleDeleteActivity(item.id, day.id)}
                              title="Delete activity"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-muted-foreground">
                      <CalendarIcon className="w-8 h-8 mx-auto mb-3 opacity-20" />
                      <p className="font-medium">No activities planned for this day yet</p>
                      <Button
                        variant="link"
                        onClick={() => handleOpenAddModal(day.id)}
                        className="mt-2"
                      >
                        Add your first activity
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <AddActivityModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        tripId={tripId}
        dayId={selectedDayId}
        onActivityAdded={handleActivityAdded}
      />
    </>
  );
};

export default ItineraryBuilderPage;
