import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  Map, Calendar, Plus, ArrowRight, Compass, Users, Clock,
  Zap, Camera, Globe, AlertCircle
} from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { format } from 'date-fns';
import ResponsiveContainer from '@/components/ResponsiveContainer.jsx';
import ResponsiveGrid from '@/components/ResponsiveGrid.jsx';

const DashboardPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    daysPlanned: 0,
    countriesVisited: 0,
    photosTaken: 0
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];

        // Fetch upcoming trips
        const tripsData = await pb.collection('trips').getList(1, 3, {
          sort: 'start_date',
          filter: `start_date >= "${today}"`,
          $autoCancel: false
        });

        // Fetch all trips for stats
        const allTrips = await pb.collection('trips').getFullList({
          $autoCancel: false
        });

        // Fetch recent notifications
        if (currentUser) {
          const notificationsData = await pb.collection('notifications').getList(1, 3, {
            filter: `user_id="${currentUser.id}"`,
            sort: '-created',
            $autoCancel: false
          });
          setNotifications(notificationsData.items);
        }

        let days = 0;
        const countries = new Set();
        let photos = 0;

        allTrips.forEach(t => {
          const start = new Date(t.start_date);
          const end = new Date(t.end_date);
          days += Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
          if (t.destination) countries.add(t.destination);
          photos += t.photos_count || 0;
        });

        setTrips(tripsData.items);
        setStats({
          total: allTrips.length,
          upcoming: tripsData.totalItems,
          daysPlanned: days || 0,
          countriesVisited: countries.size,
          photosTaken: photos
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [currentUser]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <>
      <Helmet><title>Dashboard - VaykAIo</title></Helmet>
      <ResponsiveContainer className="py-6 md:py-8 space-y-8 md:space-y-10">
        {/* Welcome Header */}
        <motion.div
          initial="hidden" animate="visible" variants={fadeInUp}
          className="bg-gradient-to-r from-sky-500/10 to-orange-500/10 border border-sky-500/20 rounded-2xl p-6 md:p-8 shadow-sm"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-orange-500">{currentUser?.name?.split(' ')[0] || 'Traveler'}</span>!
              </h1>
              <p className="text-muted-foreground text-lg">VaykAIo is monitoring your trips 24/7. Here's what's happening.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Button variant="outline" className="w-full sm:w-auto touch-target" asChild>
                <Link to="/discovery"><Compass className="w-4 h-4 mr-2" /> Discover</Link>
              </Button>
              <Button className="w-full sm:w-auto shadow-lg bg-orange-500 hover:bg-orange-600 text-white border-0 touch-target" asChild>
                <Link to="/create-trip"><Plus className="w-4 h-4 mr-2" /> New Trip</Link>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
        >
          <ResponsiveGrid columns={3}>
            {[
              { label: 'Total Trips', value: stats.total, icon: Map, color: 'from-sky-500 to-sky-600' },
              { label: 'Upcoming', value: stats.upcoming, icon: Calendar, color: 'from-orange-500 to-orange-600' },
              { label: 'Countries', value: stats.countriesVisited, icon: Globe, color: 'from-emerald-500 to-emerald-600' },
              { label: 'Days Traveled', value: stats.daysPlanned, icon: Clock, color: 'from-purple-500 to-purple-600' },
              { label: 'Photos', value: stats.photosTaken, icon: Camera, color: 'from-pink-500 to-pink-600' },
              { label: 'AI Status', value: 'Active', icon: Zap, color: 'from-green-500 to-green-600', isStatus: true }
            ].map((stat, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <Card className="bg-background border-border/50 shadow-sm hover:shadow-md hover:border-primary/30 transition-all h-full">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shrink-0`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                        {stat.label}
                      </p>
                      <h3 className="text-2xl md:text-3xl font-bold">
                        {loading ? <Skeleton className="h-8 w-12" /> : stat.isStatus ? stat.value : stat.value}
                      </h3>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </ResponsiveGrid>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming Trips */}
          <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Upcoming Trips</h2>
              {trips.length > 0 && (
                <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10 touch-target" asChild>
                  <Link to="/trips">View All <ArrowRight className="w-4 h-4 ml-2" /></Link>
                </Button>
              )}
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2].map(i => <Card key={i} className="h-40 animate-pulse bg-muted/50 border-0" />)}
              </div>
            ) : trips.length > 0 ? (
              <div className="space-y-4">
                {trips.map((trip, idx) => (
                  <motion.div
                    key={trip.id}
                    variants={fadeInUp}
                    initial="hidden" animate="visible"
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => navigate(`/trip/${trip.id}`)}
                  >
                    <Card className="group cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all duration-300 overflow-hidden border-border/50">
                      <div className="h-1 bg-gradient-to-r from-sky-500 to-orange-500" />
                      <CardContent className="p-6 flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-xl font-bold">{trip.destination}</h3>
                            <Badge className={`${
                              trip.status === 'planning' ? 'bg-yellow-500/20 text-yellow-700' :
                              trip.status === 'booked' ? 'bg-blue-500/20 text-blue-700' :
                              'bg-green-500/20 text-green-700'
                            } border-0 capitalize`}>
                              {trip.status || 'Planning'}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {format(new Date(trip.start_date), 'MMM d')} - {format(new Date(trip.end_date), 'MMM d')}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {trip.travelers_count || 1} traveler{trip.travelers_count !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                        <div className="text-primary group-hover:translate-x-1 transition-transform">
                          <ArrowRight className="w-5 h-5" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center border-2 border-dashed bg-muted/10">
                <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <Map className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-bold mb-2">No upcoming trips</h3>
                <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                  Your itinerary is empty. Time to plan your next adventure!
                </p>
                <Button size="lg" className="rounded-full shadow-md bg-orange-500 hover:bg-orange-600 text-white border-0" asChild>
                  <Link to="/create-trip"><Plus className="w-5 h-5 mr-2" /> Create First Trip</Link>
                </Button>
              </Card>
            )}
          </motion.div>

          {/* Recent Notifications & AI Status */}
          <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="space-y-6">
            {/* Recent Notifications */}
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-primary" />
                Recent Updates
              </h3>
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => <Card key={i} className="h-20 animate-pulse bg-muted/50 border-0" />)}
                </div>
              ) : notifications.length > 0 ? (
                <div className="space-y-3">
                  {notifications.map(notif => (
                    <Card key={notif.id} className="bg-muted/50 border-border/50 hover:border-primary/30 transition-colors">
                      <CardContent className="p-4">
                        <p className="text-sm font-semibold text-foreground line-clamp-1">
                          {notif.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {notif.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Just now
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                  <Button variant="outline" className="w-full text-sm" asChild>
                    <Link to="/notifications">View All</Link>
                  </Button>
                </div>
              ) : (
                <Card className="bg-muted/50 border-border/50 p-6 text-center">
                  <p className="text-sm text-muted-foreground">All quiet! VaykAIo is watching.</p>
                </Card>
              )}
            </div>

            {/* Featured Destinations */}
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Compass className="w-5 h-5 text-primary" />
                Trending Now
              </h3>
              <div className="space-y-3">
                {['Japan', 'Iceland', 'Portugal'].map((dest, i) => (
                  <Card key={i} className="bg-muted/50 border-border/50 hover:border-primary/30 cursor-pointer transition-all group">
                    <CardContent className="p-4">
                      <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {dest}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {Math.floor(Math.random() * 500) + 100} travelers this month
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </ResponsiveContainer>
    </>
  );
};

export default DashboardPage;
