import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import {
  Map,
  Calendar,
  Plus,
  Users,
  DollarSign,
  Plane,
  Zap,
  ArrowRight,
} from 'lucide-react';
import TripService from '@/services/TripService';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { format, isPast, isWithinInterval, differenceInDays } from 'date-fns';
import { toast } from 'sonner';

const TripListPage = () => {
  const { currentUser } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    fetchTrips();
  }, [currentUser]);

  const fetchTrips = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      const allTrips = await TripService.getMyTrips();
      setTrips(allTrips);
    } catch (error) {
      console.error('Error fetching trips:', error);
      toast.error('Failed to load trips');
    } finally {
      setLoading(false);
    }
  };

  const getTripStatus = (trip) => {
    const now = new Date();
    const startDate = new Date(trip.start_date);
    const endDate = new Date(trip.end_date);

    if (isPast(endDate)) return 'completed';
    if (isWithinInterval(now, { start: startDate, end: endDate })) return 'active';
    return 'planning';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-blue-500/10 text-blue-700 border-blue-500/20';
      case 'completed':
        return 'bg-green-500/10 text-green-700 border-green-500/20';
      case 'planning':
      default:
        return 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20';
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'planning':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const filteredTrips = trips.filter(trip => {
    if (activeFilter === 'all') return true;
    return getTripStatus(trip) === activeFilter;
  });

  const getBudgetPercentage = (trip, members = []) => {
    if (!trip.budget) return 0;
    // This would need actual expense data from the service
    // For now, we'll use a placeholder calculation
    return Math.floor(Math.random() * 75); // Mock: 0-75% spent
  };

  const getDaysInfo = (trip) => {
    const now = new Date();
    const startDate = new Date(trip.start_date);
    const endDate = new Date(trip.end_date);

    if (isPast(endDate)) {
      return `Completed ${Math.abs(differenceInDays(now, endDate))} days ago`;
    }

    if (isWithinInterval(now, { start: startDate, end: endDate })) {
      const remaining = differenceInDays(endDate, now);
      return `${remaining} day${remaining !== 1 ? 's' : ''} remaining`;
    }

    const until = differenceInDays(startDate, now);
    return `${until} day${until !== 1 ? 's' : ''} away`;
  };

  const filters = [
    { id: 'all', label: 'All Trips', icon: Map },
    { id: 'planning', label: 'Planning', icon: Zap },
    { id: 'active', label: 'Active', icon: Plane },
    { id: 'completed', label: 'Completed', icon: Calendar },
  ];

  return (
    <>
      <Helmet>
        <title>My Trips - VaykAIo</title>
        <meta name="description" content="Manage all your trips with VaykAIo" />
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <Header />

        <section className="flex-1 bg-gradient-to-b from-slate-50 to-slate-100 py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-slate-900">My Trips</h1>
                <p className="text-slate-600 mt-2">
                  {trips.length === 0
                    ? 'Start planning your first adventure'
                    : `${trips.length} trip${trips.length !== 1 ? 's' : ''} total`}
                </p>
              </div>
              <Button
                asChild
                className="gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
              >
                <Link to="/trips/create">
                  <Plus className="w-4 h-4" />
                  New Trip
                </Link>
              </Button>
            </div>

            {/* Filter Tabs */}
            {trips.length > 0 && (
              <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                {filters.map(filter => {
                  const Icon = filter.icon;
                  const count = filter.id === 'all'
                    ? trips.length
                    : trips.filter(t => getTripStatus(t) === filter.id).length;

                  return (
                    <button
                      key={filter.id}
                      onClick={() => setActiveFilter(filter.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all whitespace-nowrap ${
                        activeFilter === filter.id
                          ? 'bg-blue-600 text-white border-blue-600 shadow-lg'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {filter.label}
                      {count > 0 && (
                        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                          activeFilter === filter.id
                            ? 'bg-blue-400'
                            : 'bg-slate-100'
                        }`}>
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Loading State */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <Card key={i} className="h-80">
                    <CardHeader>
                      <Skeleton className="h-6 w-24 mb-2" />
                      <Skeleton className="h-8 w-32" />
                      <Skeleton className="h-4 w-40 mt-2" />
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-2 w-full" />
                      <Skeleton className="h-8 w-16" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredTrips.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTrips.map(trip => {
                  const status = getTripStatus(trip);
                  const budgetPercentage = getBudgetPercentage(trip);

                  return (
                    <Link key={trip.id} to={`/trips/${trip.id}`}>
                      <Card className="h-full flex flex-col hover:shadow-xl transition-all duration-300 hover:border-blue-500/50 bg-white overflow-hidden group">
                        {/* Cover Image or Gradient */}
                        <div className="h-32 bg-gradient-to-br from-blue-400 via-cyan-400 to-emerald-400 relative overflow-hidden">
                          {trip.cover_image && (
                            <img
                              src={trip.cover_image}
                              alt={trip.destination}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                          <div className="absolute top-3 right-3">
                            <Badge
                              className={`capitalize border ${getStatusBadgeColor(status)}`}
                            >
                              {status}
                            </Badge>
                          </div>
                        </div>

                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <CardTitle className="text-xl leading-tight">
                              {trip.destination}
                            </CardTitle>
                          </div>
                          {trip.name && (
                            <CardDescription className="text-sm font-medium text-slate-600">
                              {trip.name}
                            </CardDescription>
                          )}
                        </CardHeader>

                        <CardContent className="flex-1 space-y-4">
                          {/* Dates and Days */}
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Calendar className="w-4 h-4 flex-shrink-0" />
                            <div>
                              <div className="font-medium">
                                {format(new Date(trip.start_date), 'MMM d')} -{' '}
                                {format(new Date(trip.end_date), 'MMM d, yyyy')}
                              </div>
                              <div className="text-xs text-slate-500">
                                {getDaysInfo(trip)}
                              </div>
                            </div>
                          </div>

                          {/* Quick Stats */}
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2 text-slate-600">
                              <DollarSign className="w-4 h-4 flex-shrink-0" />
                              <div>
                                <div className="text-xs text-slate-500">Budget</div>
                                <div className="font-semibold">
                                  ${trip.budget?.toLocaleString() || '0'}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600">
                              <Users className="w-4 h-4 flex-shrink-0" />
                              <div>
                                <div className="text-xs text-slate-500">Members</div>
                                <div className="font-semibold">1+</div>
                              </div>
                            </div>
                          </div>

                          {/* Budget Progress */}
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-600 font-medium">Budget Progress</span>
                              <span className="text-slate-500">{budgetPercentage}%</span>
                            </div>
                            <Progress
                              value={budgetPercentage}
                              className="h-2 bg-slate-200"
                            />
                          </div>
                        </CardContent>

                        <CardFooter className="border-t pt-4 bg-slate-50">
                          <Button
                            variant="ghost"
                            className="w-full justify-between group/btn"
                            asChild
                          >
                            <span>
                              View Trip
                              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                            </span>
                          </Button>
                        </CardFooter>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            ) : (
              /* Empty State */
              <div className="col-span-full">
                <Card className="border-dashed bg-white/50">
                  <CardContent className="flex flex-col items-center justify-center py-24 px-6 text-center">
                    <div className="mb-6 flex justify-center">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full blur-lg opacity-75" />
                        <div className="relative bg-white p-4 rounded-full">
                          <Map className="w-12 h-12 text-blue-600" />
                        </div>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">
                      No trips yet
                    </h3>
                    <p className="text-slate-600 max-w-sm mb-8">
                      {activeFilter === 'all'
                        ? 'Start planning your next adventure! Create your first trip to get started.'
                        : `No ${activeFilter} trips yet. Try a different filter or create a new trip.`}
                    </p>
                    <Button
                      asChild
                      className="gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
                    >
                      <Link to="/trips/create">
                        <Plus className="w-4 h-4" />
                        Create Your First Trip
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default TripListPage;
