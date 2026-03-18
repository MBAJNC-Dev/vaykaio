import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin, Cloud, Utensils, Activity, Plane, Clock, DollarSign, Plus, GripVertical, Zap, AlertCircle } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';
import { format, addDays } from 'date-fns';
import AddActivityModal from '@/components/AddActivityModal.jsx';

const ItineraryPage = () => {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [days, setDays] = useState([]);
  const [items, setItems] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDayId, setSelectedDayId] = useState(null);

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
      if (daysRecords.length > 0) {
        setSelectedDay(daysRecords[0].id);
      }

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

  const getTypeIcon = (category) => {
    switch (category) {
      case 'breakfast':
      case 'lunch':
      case 'dinner':
        return <Utensils className="w-5 h-5" />;
      case 'activity':
        return <Activity className="w-5 h-5" />;
      case 'transport':
        return <Plane className="w-5 h-5" />;
      case 'accommodation':
        return <MapPin className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const getTypeColor = (category) => {
    const colors = {
      breakfast: 'bg-orange-100 text-orange-700 border-orange-200',
      lunch: 'bg-orange-100 text-orange-700 border-orange-200',
      dinner: 'bg-orange-100 text-orange-700 border-orange-200',
      activity: 'bg-blue-100 text-blue-700 border-blue-200',
      transport: 'bg-gray-100 text-gray-700 border-gray-200',
      accommodation: 'bg-green-100 text-green-700 border-green-200'
    };
    return colors[category] || 'bg-muted text-muted-foreground border-muted';
  };

  const handleOpenAddModal = (dayId) => {
    setSelectedDayId(dayId);
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

  const calculateBuffers = (dayItems) => {
    const buffers = [];
    if (dayItems.length < 2) return buffers;

    for (let i = 0; i < dayItems.length - 1; i++) {
      const current = dayItems[i];
      const next = dayItems[i + 1];

      if (current.time && next.time && current.duration) {
        const [currH, currM] = current.time.split(':').map(Number);
        const [nextH, nextM] = next.time.split(':').map(Number);

        const currStart = currH * 60 + currM;
        const currEnd = currStart + (current.duration || 60);
        const nextStart = nextH * 60 + nextM;

        const bufferTime = nextStart - currEnd;
        if (bufferTime < 0) {
          buffers.push({ index: i, conflict: true });
        } else if (bufferTime > 0 && bufferTime < 30) {
          buffers.push({ index: i, warning: true, minutes: bufferTime });
        }
      }
    }
    return buffers;
  };

  const currentDayData = selectedDay ? days.find(d => d.id === selectedDay) : null;
  const currentDayItems = selectedDay ? (items[selectedDay] || []) : [];
  const buffers = calculateBuffers(currentDayItems);

  if (loading) {
    return (
      <>
        <Helmet><title>Loading Itinerary - VaykAIo</title></Helmet>
        <div className="min-h-screen flex flex-col">
          <Header />
          <section className="py-8 px-4 md:px-6 flex-1">
            <Skeleton className="h-12 w-64 mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="space-y-3">
                {[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full" />)}
              </div>
              <div className="lg:col-span-3 space-y-4">
                {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24" />)}
              </div>
            </div>
          </section>
          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`Itinerary - ${trip?.destination || 'Trip'} - VaykAIo`}</title>
        <meta name="description" content={`Day-by-day itinerary for ${trip?.destination}`} />
      </Helmet>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
        <Header />

        <section className="py-8 px-4 md:px-6 flex-1">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold tracking-tight mb-2">{trip?.destination}</h1>
              <p className="text-muted-foreground text-lg">
                {trip && format(new Date(trip.start_date), 'MMM d')} - {trip && format(new Date(trip.end_date), 'MMM d, yyyy')} ({days.length} days)
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Day Tabs Sidebar */}
              <div className="lg:col-span-1 space-y-2">
                <div className="bg-card border rounded-lg p-4 shadow-sm">
                  <h2 className="font-semibold text-sm mb-4 px-2">Days</h2>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {days.map((day, idx) => (
                      <button
                        key={day.id}
                        onClick={() => setSelectedDay(day.id)}
                        className={`w-full text-left p-3 rounded-lg transition-all border ${
                          selectedDay === day.id
                            ? 'bg-primary text-primary-foreground border-primary shadow-md'
                            : 'bg-muted/30 text-foreground border-transparent hover:bg-muted/50'
                        }`}
                      >
                        <div className="font-medium text-sm">Day {day.day_number}</div>
                        <div className={`text-xs ${selectedDay === day.id ? 'opacity-80' : 'text-muted-foreground'}`}>
                          {format(new Date(day.date), 'MMM d')}
                        </div>
                        <div className={`text-xs mt-1 ${selectedDay === day.id ? 'opacity-70' : 'text-muted-foreground'}`}>
                          {items[day.id]?.length || 0} items
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <Button asChild variant="outline" className="w-full">
                  <Link to={`/trip/${tripId}/itinerary-builder`} className="gap-2">
                    <Zap className="w-4 h-4" />
                    <span className="hidden sm:inline">Manual Edit</span>
                    <span className="sm:hidden">Edit</span>
                  </Link>
                </Button>

                <Button asChild variant="outline" className="w-full">
                  <Link to={`/trip/${tripId}/ai-itinerary`} className="gap-2">
                    <Zap className="w-4 h-4" />
                    <span className="hidden sm:inline">AI Builder</span>
                    <span className="sm:hidden">AI</span>
                  </Link>
                </Button>
              </div>

              {/* Main Day View */}
              <div className="lg:col-span-3">
                {currentDayData && (
                  <Card className="shadow-lg border-t-4 border-t-primary overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b pb-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-2xl">Day {currentDayData.day_number}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            {format(new Date(currentDayData.date), 'EEEE, MMMM d, yyyy')}
                          </p>
                        </div>
                        <Cloud className="w-6 h-6 text-muted-foreground opacity-50" />
                      </div>
                    </CardHeader>

                    <CardContent className="p-6 space-y-6">
                      {buffers.length > 0 && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
                          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                          <div className="text-sm text-amber-800">
                            {buffers.some(b => b.conflict) ? (
                              <p>There are time conflicts in your schedule. Check overlapping activities.</p>
                            ) : (
                              <p>Some activities have tight timing - plan transitions carefully.</p>
                            )}
                          </div>
                        </div>
                      )}

                      {currentDayItems.length === 0 ? (
                        <div className="py-12 text-center space-y-4">
                          <MapPin className="w-16 h-16 text-muted-foreground/30 mx-auto" />
                          <div>
                            <p className="text-muted-foreground font-medium">No activities yet</p>
                            <p className="text-sm text-muted-foreground mt-1">Add one or let AI plan your day</p>
                          </div>
                          <div className="flex gap-2 justify-center pt-4">
                            <Button onClick={() => handleOpenAddModal(selectedDay)} size="sm" className="gap-2">
                              <Plus className="w-4 h-4" />
                              Add Activity
                            </Button>
                            <Button asChild variant="outline" size="sm">
                              <Link to={`/trip/${tripId}/ai-itinerary`} className="gap-2">
                                <Zap className="w-4 h-4" />
                                AI Plan
                              </Link>
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {currentDayItems.map((item, idx) => {
                            const buffer = buffers.find(b => b.index === idx);
                            return (
                              <div key={item.id}>
                                {buffer?.warning && (
                                  <div className="text-xs text-amber-600 px-4 py-2 bg-amber-50 rounded mb-2">
                                    {buffer.minutes} min buffer until next activity
                                  </div>
                                )}
                                <div className={`border-l-4 rounded-lg p-4 transition-all hover:shadow-md ${getTypeColor(item.category)} border-l-current`}>
                                  <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 mt-1 cursor-grab active:cursor-grabbing">
                                      <GripVertical className="w-5 h-5 opacity-40" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2 mb-2">
                                            <span className="inline-flex p-2 bg-white/50 rounded-lg">
                                              {getTypeIcon(item.category)}
                                            </span>
                                            <h3 className="font-semibold text-lg">{item.name}</h3>
                                          </div>

                                          {item.location && (
                                            <p className="text-sm opacity-85 flex items-center gap-1 mb-2">
                                              <MapPin className="w-3 h-3" />
                                              {item.location}
                                            </p>
                                          )}

                                          <div className="flex flex-wrap gap-4 text-sm opacity-80 mb-2">
                                            {item.time && (
                                              <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {item.time}
                                                {item.duration && ` (${item.duration}min)`}
                                              </span>
                                            )}
                                            {item.cost > 0 && (
                                              <span className="flex items-center gap-1">
                                                <DollarSign className="w-3 h-3" />
                                                ${item.cost}
                                              </span>
                                            )}
                                          </div>

                                          {item.notes && (
                                            <p className="text-sm opacity-90 bg-white/30 rounded p-2 mt-2">{item.notes}</p>
                                          )}
                                        </div>

                                        <div className="flex gap-2 flex-shrink-0">
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="w-8 h-8 text-destructive opacity-60 hover:opacity-100"
                                            onClick={() => handleDeleteActivity(item.id, selectedDay)}
                                          >
                                            ×
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}

                          <Button
                            onClick={() => handleOpenAddModal(selectedDay)}
                            variant="outline"
                            className="w-full gap-2 mt-4"
                          >
                            <Plus className="w-4 h-4" />
                            Add Activity to Day {currentDayData.day_number}
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </section>

        <Footer />
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

export default ItineraryPage;
