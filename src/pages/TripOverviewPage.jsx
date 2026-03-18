import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import {
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Camera,
  BookOpen,
  Compass,
  Clock,
  AlertCircle,
  Zap,
  ChevronRight,
} from 'lucide-react';
import TripService from '@/services/TripService';
import { toast } from 'sonner';
import { format, differenceInDays, isPast } from 'date-fns';

const TripOverviewPage = () => {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    membersCount: 0,
    activitiesCount: 0,
    photosCount: 0,
    journalEntriesCount: 0,
    budgetSpent: 0,
  });
  const [nextActivity, setNextActivity] = useState(null);
  const [activityFeed, setActivityFeed] = useState([]);

  useEffect(() => {
    fetchTripData();
  }, [tripId]);

  const fetchTripData = async () => {
    try {
      setLoading(true);

      // Fetch trip details
      const tripData = await TripService.getTrip(tripId);
      setTrip(tripData);

      // Fetch all stats in parallel
      const [
        members,
        activitiesCount,
        photosCount,
        journalCount,
        budgetSummary,
        activities,
        feed,
      ] = await Promise.all([
        TripService.getTripMembers(tripId).catch(() => []),
        TripService.getActivitiesCount(tripId),
        TripService.getPhotosCount(tripId),
        TripService.getJournalEntriesCount(tripId),
        TripService.getBudgetSummary(tripId),
        TripService.getUpcomingActivities(tripId, 1),
        TripService.getActivityFeed(tripId, 5),
      ]);

      setStats({
        membersCount: members.length + 1, // +1 for creator
        activitiesCount,
        photosCount,
        journalEntriesCount: journalCount,
        budgetSpent: budgetSummary.totalSpent,
      });

      if (activities.length > 0) {
        setNextActivity(activities[0]);
      }

      setActivityFeed(feed);
    } catch (error) {
      console.error('Error fetching trip data:', error);
      toast.error('Failed to load trip data');
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    planning: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
    active: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
    completed: 'bg-green-500/10 text-green-700 border-green-500/20',
  };

  const getTripStatus = () => {
    if (!trip) return 'planning';
    const now = new Date();
    const startDate = new Date(trip.start_date);
    const endDate = new Date(trip.end_date);

    if (isPast(endDate)) return 'completed';
    if (now >= startDate && now <= endDate) return 'active';
    return 'planning';
  };

  const getDaysInfo = () => {
    if (!trip) return { text: '', daysUntil: 0 };

    const now = new Date();
    const startDate = new Date(trip.start_date);
    const endDate = new Date(trip.end_date);
    const totalDays = differenceInDays(endDate, startDate);
    const daysUntil = differenceInDays(startDate, now);
    const daysPassed = differenceInDays(now, startDate);

    if (isPast(endDate)) {
      return { text: `Completed ${Math.abs(differenceInDays(now, endDate))} days ago`, daysUntil: 0 };
    }

    if (now >= startDate && now <= endDate) {
      return { text: `Day ${daysPassed + 1} of ${totalDays + 1}`, daysUntil: differenceInDays(endDate, now) };
    }

    return { text: `${daysUntil} days until trip`, daysUntil };
  };

  const getBudgetPercentage = () => {
    if (!trip || !trip.budget) return 0;
    return Math.min((stats.budgetSpent / trip.budget) * 100, 100);
  };

  const navigationCards = [
    {
      title: 'Itinerary',
      icon: Calendar,
      description: `${stats.activitiesCount} activities planned`,
      link: `/trips/${tripId}/itinerary`,
      color: 'bg-blue-500/10 text-blue-700',
    },
    {
      title: 'Budget & Expenses',
      icon: DollarSign,
      description: `$${stats.budgetSpent.toLocaleString()} of $${(trip?.budget || 0).toLocaleString()} spent`,
      link: `/trips/${tripId}/budget`,
      color: 'bg-green-500/10 text-green-700',
    },
    {
      title: 'Photos & Memories',
      icon: Camera,
      description: `${stats.photosCount} photos`,
      link: `/trips/${tripId}/photos`,
      color: 'bg-pink-500/10 text-pink-700',
    },
    {
      title: 'Travel Journal',
      icon: BookOpen,
      description: `${stats.journalEntriesCount} entries`,
      link: `/trips/${tripId}/journal`,
      color: 'bg-purple-500/10 text-purple-700',
    },
    {
      title: 'Group & Members',
      icon: Users,
      description: `${stats.membersCount} members`,
      link: `/trips/${tripId}/group`,
      color: 'bg-orange-500/10 text-orange-700',
    },
    {
      title: 'Discovery',
      icon: Compass,
      description: 'Explore nearby',
      link: `/trips/${tripId}/discovery`,
      color: 'bg-teal-500/10 text-teal-700',
    },
  ];

  const daysInfo = getDaysInfo();
  const currentStatus = getTripStatus();

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Loading Trip - VaykAIo</title>
        </Helmet>
        <div className="min-h-screen flex flex-col">
          <Header />
          <section className="py-12 flex-1">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <Skeleton className="h-64 w-full mb-8 rounded-lg" />
              <Skeleton className="h-12 w-64 mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-40" />
                ))}
              </div>
            </div>
          </section>
          <Footer />
        </div>
      </>
    );
  }

  if (!trip) {
    return (
      <>
        <Helmet>
          <title>Trip Not Found - VaykAIo</title>
        </Helmet>
        <div className="min-h-screen flex flex-col">
          <Header />
          <section className="py-12 flex-1">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-2xl font-bold mb-4">Trip not found</h1>
              <Button asChild>
                <Link to="/trips">Back to trips</Link>
              </Button>
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
        <title>{`${trip.destination} - VaykAIo`}</title>
        <meta name="description" content={`Trip overview for ${trip.destination}`} />
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <Header />

        <section className="flex-1 bg-gradient-to-b from-slate-900 via-slate-800 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* AI Status Ribbon */}
            <div className="mb-8 flex items-center gap-2 px-4 py-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-600 animate-pulse" />
                <span className="text-sm font-medium text-emerald-700">
                  VaykAIo is monitoring your trip. All systems green.
                </span>
              </div>
            </div>

            {/* Trip Header */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <h1 className="text-4xl md:text-5xl font-bold text-white">
                      {trip.destination}
                    </h1>
                    <Badge
                      className={`capitalize ${statusColors[currentStatus] || statusColors.planning}`}
                    >
                      {currentStatus}
                    </Badge>
                  </div>
                  <p className="text-slate-400 text-lg">
                    {format(new Date(trip.start_date), 'MMM d, yyyy')} -{' '}
                    {format(new Date(trip.end_date), 'MMM d, yyyy')}
                  </p>
                </div>
                <Button asChild variant="outline" className="md:self-start">
                  <Link to={`/trips/${tripId}/edit`}>Edit Trip</Link>
                </Button>
              </div>

              {/* Quick Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="pt-6">
                    <div className="text-sm text-slate-400 mb-1">Days Until/Until End</div>
                    <div className="text-2xl font-bold text-white">{daysInfo.text}</div>
                  </CardContent>
                </Card>
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="pt-6">
                    <div className="text-sm text-slate-400 mb-1">Members</div>
                    <div className="text-2xl font-bold text-white">{stats.membersCount}</div>
                  </CardContent>
                </Card>
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="pt-6">
                    <div className="text-sm text-slate-400 mb-1">Budget Status</div>
                    <div className="text-2xl font-bold text-white">
                      {Math.round(getBudgetPercentage())}%
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="pt-6">
                    <div className="text-sm text-slate-400 mb-1">Activities</div>
                    <div className="text-2xl font-bold text-white">{stats.activitiesCount}</div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Navigation Cards Grid */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">Trip Hub</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {navigationCards.map((card, index) => (
                  <Link
                    key={index}
                    to={card.link}
                    className="group"
                  >
                    <Card className="h-full hover:shadow-lg transition-all duration-200 hover:border-primary/50 bg-slate-800/30 border-slate-700 hover:bg-slate-800/50">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className={`w-12 h-12 rounded-lg ${card.color} flex items-center justify-center`}>
                            <card.icon className="w-6 h-6" />
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-1">{card.title}</h3>
                        <p className="text-sm text-slate-400">{card.description}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>

            {/* Next Up Card */}
            {nextActivity && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-6">Next Up</h2>
                <Card className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/30">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-white mb-1">
                          {nextActivity.name || nextActivity.title || 'Activity'}
                        </h3>
                        <p className="text-sm text-slate-400 mb-2">
                          {format(new Date(nextActivity.start_time), 'MMM d, h:mm a')}
                        </p>
                        {nextActivity.location && (
                          <div className="flex items-center gap-1 text-sm text-slate-400">
                            <MapPin className="w-4 h-4" />
                            {nextActivity.location}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Weather Widget */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">Weather</h2>
              <Card className="bg-slate-800/30 border-slate-700">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-slate-400 text-sm mb-4">
                      Current weather for {trip.destination}
                    </p>
                    <div className="inline-block px-6 py-3 rounded-lg bg-slate-700/50 border border-slate-600">
                      <div className="text-sm text-slate-400">Partly Cloudy</div>
                      <div className="text-3xl font-bold text-white">72°F</div>
                    </div>
                    <p className="text-xs text-slate-500 mt-4">
                      Weather data will sync when connected to weather API
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity Feed */}
            {activityFeed.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
                <Card className="bg-slate-800/30 border-slate-700">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {activityFeed.map((activity, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 pb-4 border-b border-slate-700 last:border-0"
                        >
                          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white">{activity.description || activity.action}</p>
                            <p className="text-xs text-slate-500 mt-1">
                              {format(new Date(activity.created), 'MMM d, h:mm a')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* AI Suggestions Card */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">VaykAIo Suggestions</h2>
              <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Zap className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-white font-medium">
                          Add activities to your itinerary
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          You have {stats.activitiesCount} activities planned. Add more to maximize your trip!
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-white font-medium">
                          Track your spending
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          You've spent {Math.round(getBudgetPercentage())}% of your budget.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-white font-medium">
                          Invite travel companions
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          Currently {stats.membersCount} members on this trip.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default TripOverviewPage;
