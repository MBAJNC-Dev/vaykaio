
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { ExternalLink, MapPin } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';

const ActivitiesMatrixPage = () => {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    fetchData();
  }, [tripId]);

  useEffect(() => {
    filterActivities();
  }, [activities, categoryFilter]);

  const fetchData = async () => {
    try {
      const tripRecord = await pb.collection('trips').getOne(tripId, { $autoCancel: false });
      setTrip(tripRecord);

      const activityRecords = await pb.collection('activities').getList(1, 100, {
        filter: `trip_id = "${tripId}"`,
        sort: 'created',
        $autoCancel: false,
      });
      setActivities(activityRecords.items);
    } catch (error) {
      toast.error('Failed to load activities');
    } finally {
      setLoading(false);
    }
  };

  const filterActivities = () => {
    if (categoryFilter === 'all') {
      setFilteredActivities(activities);
    } else {
      setFilteredActivities(activities.filter(a => a.category === categoryFilter));
    }
  };

  const totalCost = filteredActivities.reduce((sum, activity) => sum + (activity.cost || 0), 0);

  const categoryColors = {
    adventure: 'bg-orange-500/10 text-orange-700 border-orange-500/20',
    culture: 'bg-purple-500/10 text-purple-700 border-purple-500/20',
    food: 'bg-red-500/10 text-red-700 border-red-500/20',
    relaxation: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
    nightlife: 'bg-pink-500/10 text-pink-700 border-pink-500/20',
    shopping: 'bg-green-500/10 text-green-700 border-green-500/20',
    nature: 'bg-teal-500/10 text-teal-700 border-teal-500/20',
    history: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
    art: 'bg-indigo-500/10 text-indigo-700 border-indigo-500/20',
    'family-friendly': 'bg-cyan-500/10 text-cyan-700 border-cyan-500/20',
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Loading Activities - VaykAIo</title>
        </Helmet>
        <div className="min-h-screen flex flex-col">
          <Header />
          <section className="py-12 flex-1">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <Skeleton className="h-12 w-64 mb-8" />
              <Skeleton className="h-96" />
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
        <title>{`Activities - ${trip?.destination || 'Trip'} - VaykAIo`}</title>
        <meta name="description" content={`All activities for ${trip?.destination}`} />
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <section className="py-12 bg-gradient-to-b from-primary/5 to-background flex-1">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-8">{trip?.destination} activities</h1>

            <div className="mb-6">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-64">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  <SelectItem value="adventure">Adventure</SelectItem>
                  <SelectItem value="culture">Culture</SelectItem>
                  <SelectItem value="food">Food</SelectItem>
                  <SelectItem value="relaxation">Relaxation</SelectItem>
                  <SelectItem value="nightlife">Nightlife</SelectItem>
                  <SelectItem value="shopping">Shopping</SelectItem>
                  <SelectItem value="nature">Nature</SelectItem>
                  <SelectItem value="history">History</SelectItem>
                  <SelectItem value="art">Art</SelectItem>
                  <SelectItem value="family-friendly">Family-friendly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {filteredActivities.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No activities yet</h3>
                  <p className="text-muted-foreground">
                    {categoryFilter !== 'all' ? 'No activities in this category' : 'Your activities will appear here'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Activities matrix</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead className="text-right">Cost</TableHead>
                          <TableHead>Links</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredActivities.map((activity) => (
                          <TableRow key={activity.id}>
                            <TableCell className="font-medium">
                              <div>{activity.name}</div>
                              {activity.description && (
                                <div className="text-sm text-muted-foreground mt-1">{activity.description}</div>
                              )}
                            </TableCell>
                            <TableCell>
                              {activity.category && (
                                <Badge className={categoryColors[activity.category] || ''}>
                                  {activity.category}
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>{activity.time || '-'}</TableCell>
                            <TableCell className="text-right">
                              {activity.cost ? `$${activity.cost}` : '-'}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                {activity.booking_link && (
                                  <Button size="sm" variant="outline" asChild>
                                    <a href={activity.booking_link} target="_blank" rel="noopener noreferrer">
                                      <ExternalLink className="w-3 h-3 mr-1" />
                                      Book
                                    </a>
                                  </Button>
                                )}
                                {activity.review_link && (
                                  <Button size="sm" variant="outline" asChild>
                                    <a href={activity.review_link} target="_blank" rel="noopener noreferrer">
                                      <ExternalLink className="w-3 h-3 mr-1" />
                                      Reviews
                                    </a>
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="font-semibold bg-muted/30">
                          <TableCell colSpan={3}>Total</TableCell>
                          <TableCell className="text-right">${totalCost.toLocaleString()}</TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default ActivitiesMatrixPage;
