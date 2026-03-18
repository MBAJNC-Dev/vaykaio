
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Map, Calendar, Plus, Users, DollarSign, Search, Filter, MoreVertical, Trash2, Edit, Share2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import pb from '@/lib/pocketbaseClient';
import { format } from 'date-fns';
import { toast } from 'sonner';

const SavedTripsPage = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const records = await pb.collection('trips').getFullList({
        sort: '-start_date',
        $autoCancel: false
      });
      setTrips(records);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load trips');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this trip? This action cannot be undone.')) return;
    
    try {
      await pb.collection('trips').delete(id, { $autoCancel: false });
      setTrips(prev => prev.filter(t => t.id !== id));
      toast.success('Trip deleted successfully');
    } catch (error) {
      toast.error('Failed to delete trip');
    }
  };

  const filteredTrips = trips.filter(trip => 
    trip.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Helmet><title>My Trips - VaykAIo</title></Helmet>
      <div className="space-y-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Trips</h1>
            <p className="text-muted-foreground mt-1 text-lg">Manage all your past and upcoming adventures.</p>
          </div>
          <Button size="lg" className="rounded-full shadow-md" asChild>
            <Link to="/create-trip"><Plus className="w-5 h-5 mr-2" /> New Trip</Link>
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 bg-card p-4 rounded-xl border shadow-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder="Search destinations..." 
              className="pl-10 h-12 bg-muted/50 border-transparent focus-visible:bg-background"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="h-12 px-6">
            <Filter className="w-4 h-4 mr-2" /> Filter
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4].map(i => <Card key={i} className="h-72 animate-pulse bg-muted/50 border-0" />)}
          </div>
        ) : filteredTrips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.map(trip => (
              <Card 
                key={trip.id} 
                className="flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer border-border/50 overflow-hidden group"
                onClick={() => navigate(`/trip/${trip.id}`)}
              >
                <div className="h-3 bg-gradient-to-r from-primary to-accent w-full" />
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      trip.status === 'planning' ? 'bg-yellow-100 text-yellow-800' : 
                      trip.status === 'booked' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {trip.status || 'Planning'}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="-mr-2 h-8 w-8 text-muted-foreground hover:text-foreground">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigate(`/trip/${trip.id}/edit`); }}>
                          <Edit className="w-4 h-4 mr-2" /> Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); /* Share logic */ }}>
                          <Share2 className="w-4 h-4 mr-2" /> Share Trip
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={(e) => handleDelete(trip.id, e)}>
                          <Trash2 className="w-4 h-4 mr-2" /> Delete Trip
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardTitle className="text-2xl line-clamp-1 group-hover:text-primary transition-colors">{trip.destination}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-2 text-base font-medium">
                    <Calendar className="w-4 h-4 text-primary" />
                    {format(new Date(trip.start_date), 'MMM d')} - {format(new Date(trip.end_date), 'MMM d, yyyy')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="flex gap-6 text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-primary" />
                      <span className="font-medium">{trip.travelers_count}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-primary" />
                      <span className="font-medium">${trip.budget?.toLocaleString() || '0'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-card rounded-2xl border border-dashed shadow-sm">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Map className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold mb-2">No trips found</h3>
            <p className="text-muted-foreground mb-8 text-lg max-w-md mx-auto">
              {searchTerm ? "We couldn't find any trips matching your search." : "You haven't planned any trips yet. Let's change that!"}
            </p>
            {searchTerm ? (
              <Button variant="outline" onClick={() => setSearchTerm('')}>Clear Search</Button>
            ) : (
              <Button size="lg" className="rounded-full shadow-md" asChild><Link to="/create-trip"><Plus className="w-5 h-5 mr-2" /> Create Your First Trip</Link></Button>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default SavedTripsPage;
