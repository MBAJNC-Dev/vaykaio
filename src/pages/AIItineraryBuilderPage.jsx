
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Sparkles, Loader2, MapPin, Clock, DollarSign, ChevronRight, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import { format } from 'date-fns';
import FeatureGate from '@/components/FeatureGate';

const AIItineraryBuilderContent = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [trip, setTrip] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [generatedItinerary, setGeneratedItinerary] = useState(null);

  const [formData, setFormData] = useState({
    pace: 'moderate',
    interests: [],
    mustVisit: '',
    budget: 'mid-range',
    specialRequirements: ''
  });

  useEffect(() => {
    fetchTripData();
  }, [tripId]);

  const fetchTripData = async () => {
    try {
      const tripRecord = await pb.collection('trips').getOne(tripId, { $autoCancel: false });
      setTrip(tripRecord);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load trip data');
    }
  };

  const interestOptions = [
    { id: 'food', label: 'Food & Dining' },
    { id: 'culture', label: 'Culture & History' },
    { id: 'nature', label: 'Nature & Outdoors' },
    { id: 'nightlife', label: 'Nightlife & Entertainment' },
    { id: 'shopping', label: 'Shopping' },
    { id: 'adventure', label: 'Adventure Sports' },
    { id: 'relaxation', label: 'Relaxation & Wellness' },
    { id: 'family', label: 'Family Activities' }
  ];

  const toggleInterest = (id) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(id)
        ? prev.interests.filter(i => i !== id)
        : [...prev.interests, id]
    }));
  };

  const generateItinerary = async () => {
    if (formData.interests.length === 0) {
      toast.error('Please select at least one interest');
      return;
    }

    setGenerating(true);
    try {
      await new Promise(r => setTimeout(r, 2000));

      const mockItinerary = generateMockItinerary();
      setGeneratedItinerary(mockItinerary);
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate itinerary');
    } finally {
      setGenerating(false);
    }
  };

  const generateMockItinerary = () => {
    const days = trip ? Math.floor((new Date(trip.end_date) - new Date(trip.start_date)) / (1000 * 60 * 60 * 24)) + 1 : 3;
    const itinerary = {};

    for (let d = 1; d <= days; d++) {
      itinerary[d] = [];

      if (formData.interests.includes('food')) {
        itinerary[d].push({
          time: '08:00',
          title: 'Breakfast at Local Cafe',
          type: 'breakfast',
          location: 'Downtown',
          duration: 45,
          cost: 12,
          description: 'Start your day with fresh pastries and local coffee'
        });
      }

      if (formData.interests.includes('culture') || formData.interests.includes('history')) {
        const activities = [
          { title: 'Visit Historic Museum', cost: 18, desc: 'Explore centuries of local history' },
          { title: 'Walking Heritage Tour', cost: 35, desc: 'Guided tour of historic landmarks' },
          { title: 'Artisan Gallery', cost: 0, desc: 'Browse local contemporary art' }
        ];
        const activity = activities[d % activities.length];
        itinerary[d].push({
          time: `10:${d % 60 < 10 ? '0' : ''}${d % 60}`,
          title: activity.title,
          type: 'activity',
          location: 'City Center',
          duration: 120,
          cost: activity.cost,
          description: activity.desc
        });
      }

      if (formData.interests.includes('food')) {
        itinerary[d].push({
          time: '13:00',
          title: 'Lunch at Local Restaurant',
          type: 'lunch',
          location: formData.budget === 'luxury' ? 'Michelin-starred District' : 'Local Market',
          duration: 60,
          cost: formData.budget === 'luxury' ? 65 : 18,
          description: formData.budget === 'luxury' ? 'Fine dining experience' : 'Authentic local cuisine'
        });
      }

      if (formData.interests.includes('adventure')) {
        itinerary[d].push({
          time: '15:00',
          title: 'Outdoor Activity Adventure',
          type: 'activity',
          location: 'Nature Reserve',
          duration: 180,
          cost: 45,
          description: 'Hiking, water sports, or guided nature tour'
        });
      } else if (formData.interests.includes('nature')) {
        itinerary[d].push({
          time: '15:00',
          title: 'Nature Park Exploration',
          type: 'activity',
          location: 'Regional Park',
          duration: 150,
          cost: 12,
          description: 'Peaceful walk through scenic natural areas'
        });
      } else if (formData.interests.includes('shopping')) {
        itinerary[d].push({
          time: '15:30',
          title: 'Shopping District Tour',
          type: 'activity',
          location: 'Market Square',
          duration: 120,
          cost: 0,
          description: 'Browse boutiques and local shops'
        });
      }

      if (formData.interests.includes('relaxation')) {
        itinerary[d].push({
          time: '17:00',
          title: 'Spa & Wellness Session',
          type: 'activity',
          location: 'Wellness Center',
          duration: 90,
          cost: 55,
          description: 'Massage, sauna, or meditation session'
        });
      }

      if (formData.interests.includes('food')) {
        itinerary[d].push({
          time: '19:30',
          title: 'Dinner Experience',
          type: 'dinner',
          location: formData.budget === 'luxury' ? 'Upscale District' : 'Neighborhood Eatery',
          duration: 90,
          cost: formData.budget === 'luxury' ? 85 : 28,
          description: formData.budget === 'luxury' ? 'Gourmet tasting menu' : 'Traditional regional dishes'
        });
      }

      if (formData.interests.includes('nightlife')) {
        itinerary[d].push({
          time: '21:30',
          title: 'Evening Entertainment',
          type: 'activity',
          location: 'Entertainment District',
          duration: 120,
          cost: 25,
          description: 'Live music, theater, or cultural performance'
        });
      }
    }

    return itinerary;
  };

  const saveItinerary = async () => {
    try {
      setGenerating(true);

      for (const [dayNum, activities] of Object.entries(generatedItinerary)) {
        const dayDate = trip ? new Date(trip.start_date) : new Date();
        dayDate.setDate(dayDate.getDate() + parseInt(dayNum) - 1);

        let dayRecord = await pb.collection('itinerary_days').getFirstListItem(
          `trip_id = "${tripId}" && day_number = ${dayNum}`,
          { $autoCancel: false }
        ).catch(() => null);

        if (!dayRecord) {
          dayRecord = await pb.collection('itinerary_days').create({
            trip_id: tripId,
            day_number: parseInt(dayNum),
            date: dayDate.toISOString(),
            notes: ''
          }, { $autoCancel: false });
        }

        for (const activity of activities) {
          await pb.collection('itinerary_items').create({
            itinerary_day_id: dayRecord.id,
            name: activity.title,
            time: activity.time,
            location: activity.location,
            category: activity.type,
            duration: activity.duration,
            cost: activity.cost,
            notes: activity.description,
            order: 0
          }, { $autoCancel: false });
        }
      }

      toast.success('Itinerary saved successfully!');
      navigate(`/trip/${tripId}/itinerary`);
    } catch (error) {
      console.error(error);
      toast.error('Failed to save itinerary');
    } finally {
      setGenerating(false);
    }
  };

  if (!trip) {
    return <div className="text-center py-12">Loading trip data...</div>;
  }

  if (generatedItinerary) {
    return (
      <>
        <Helmet><title>AI Generated Itinerary - VaykAIo</title></Helmet>
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Your Perfect Itinerary</h1>
              <p className="text-muted-foreground mt-1">AI-crafted based on your preferences</p>
            </div>
          </div>

          <div className="space-y-6">
            {Object.entries(generatedItinerary).map(([dayNum, activities]) => (
              <Card key={dayNum} className="border-t-4 border-t-primary overflow-hidden">
                <CardHeader className="bg-muted/30">
                  <CardTitle className="text-xl">Day {dayNum}</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  {activities.map((activity, idx) => (
                    <div key={idx} className="border-l-4 border-l-primary pl-4 py-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-lg">{activity.title}</p>
                          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mt-2">
                            {activity.time && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {activity.time} ({activity.duration}min)
                              </span>
                            )}
                            {activity.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {activity.location}
                              </span>
                            )}
                            {activity.cost > 0 && (
                              <span className="flex items-center gap-1">
                                <DollarSign className="w-3 h-3" />
                                ${activity.cost}
                              </span>
                            )}
                          </div>
                          {activity.description && (
                            <p className="text-sm text-muted-foreground mt-2">{activity.description}</p>
                          )}
                        </div>
                        <Badge variant="outline" className="capitalize flex-shrink-0">
                          {activity.type}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setGeneratedItinerary(null);
                setStep(4);
              }}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Modify Preferences
            </Button>
            <Button
              size="lg"
              onClick={saveItinerary}
              disabled={generating}
              className="gap-2"
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Accept & Save Itinerary
                </>
              )}
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet><title>AI Itinerary Builder - VaykAIo</title></Helmet>
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
            <Sparkles className="w-7 h-7 text-primary" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight">AI Itinerary Builder</h1>
            <p className="text-muted-foreground mt-1">Let's craft your perfect {trip?.destination} experience</p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`flex-1 h-2 rounded-full transition-colors ${
                s <= step ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        {/* Step 1: Pace */}
        {step === 1 && (
          <Card className="shadow-lg border-primary/20">
            <CardHeader className="bg-muted/30 border-b">
              <CardTitle>Travel Pace</CardTitle>
              <CardDescription>How much do you want to see each day?</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-4">
              {[
                { value: 'relaxed', title: 'Relaxed', desc: '1-2 activities per day' },
                { value: 'moderate', title: 'Moderate', desc: '3-4 activities per day' },
                { value: 'active', title: 'Active', desc: '5+ activities per day' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFormData({ ...formData, pace: option.value })}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    formData.pace === option.value
                      ? 'border-primary bg-primary/5'
                      : 'border-muted hover:border-primary/50'
                  }`}
                >
                  <p className="font-semibold">{option.title}</p>
                  <p className="text-sm text-muted-foreground">{option.desc}</p>
                </button>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Step 2: Interests */}
        {step === 2 && (
          <Card className="shadow-lg border-primary/20">
            <CardHeader className="bg-muted/30 border-b">
              <CardTitle>Your Interests</CardTitle>
              <CardDescription>What activities excite you most?</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-2 gap-4">
                {interestOptions.map((interest) => (
                  <button
                    key={interest.id}
                    onClick={() => toggleInterest(interest.id)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      formData.interests.includes(interest.id)
                        ? 'border-primary bg-primary/5'
                        : 'border-muted hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={formData.interests.includes(interest.id)}
                        onCheckedChange={() => toggleInterest(interest.id)}
                        className="pointer-events-none"
                      />
                      <span className="font-medium text-sm">{interest.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Must-Visit Places */}
        {step === 3 && (
          <Card className="shadow-lg border-primary/20">
            <CardHeader className="bg-muted/30 border-b">
              <CardTitle>Must-Visit Places</CardTitle>
              <CardDescription>Any specific locations or restaurants you don't want to miss?</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-4">
              <Textarea
                placeholder="e.g., Eiffel Tower, Le Jules Verne restaurant, Musée d'Orsay..."
                className="resize-none h-32"
                value={formData.mustVisit}
                onChange={(e) => setFormData({ ...formData, mustVisit: e.target.value })}
              />
              <p className="text-sm text-muted-foreground">Leave blank if you prefer our AI to surprise you</p>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Budget & Requirements */}
        {step === 4 && (
          <Card className="shadow-lg border-primary/20">
            <CardHeader className="bg-muted/30 border-b">
              <CardTitle>Budget & Special Needs</CardTitle>
              <CardDescription>Help us tailor the perfect experience</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-3">
                <Label className="text-base font-semibold">Budget Level</Label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'budget', label: 'Budget-friendly' },
                    { value: 'mid-range', label: 'Mid-range' },
                    { value: 'luxury', label: 'Luxury' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setFormData({ ...formData, budget: option.value })}
                      className={`p-3 rounded-lg border-2 text-center transition-all ${
                        formData.budget === option.value
                          ? 'border-primary bg-primary/5'
                          : 'border-muted hover:border-primary/50'
                      }`}
                    >
                      <p className="font-medium text-sm">{option.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Special Requirements</Label>
                <Textarea
                  placeholder="e.g., Dietary restrictions, accessibility needs, traveling with kids, elderly family members..."
                  className="resize-none h-28"
                  value={formData.specialRequirements}
                  onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Review */}
        {step === 5 && (
          <Card className="shadow-lg border-primary/20">
            <CardHeader className="bg-muted/30 border-b">
              <CardTitle>Ready to Generate?</CardTitle>
              <CardDescription>We'll create your perfect {trip?.destination} itinerary</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-4">
              <div className="space-y-3 bg-muted/30 rounded-lg p-4">
                <div>
                  <p className="text-sm font-semibold">Travel Pace</p>
                  <p className="text-sm text-muted-foreground capitalize">{formData.pace}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold">Interests</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {formData.interests.map((i) => {
                      const opt = interestOptions.find(o => o.id === i);
                      return <Badge key={i} variant="secondary">{opt?.label}</Badge>;
                    })}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold">Budget</p>
                  <p className="text-sm text-muted-foreground capitalize">{formData.budget}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex gap-3 justify-between">
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep(step - 1)} className="gap-2">
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>
          )}
          <div className="flex-1" />
          {step < 5 ? (
            <Button onClick={() => setStep(step + 1)} className="gap-2">
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              size="lg"
              onClick={generateItinerary}
              disabled={generating}
              className="gap-2"
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate My Itinerary
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

const AIItineraryBuilderPage = () => {
  return (
    <FeatureGate requiredPlan="pro" featureName="AI Itinerary Builder">
      <AIItineraryBuilderContent />
    </FeatureGate>
  );
};

export default AIItineraryBuilderPage;
