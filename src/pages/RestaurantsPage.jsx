
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Utensils, Plus, Trash2, ExternalLink, Search } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';

const RestaurantsPage = () => {
  const { tripId } = useParams();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [newRestaurant, setNewRestaurant] = useState({ name: '', cuisine: '', cost: '', allergies_accommodated: '' });

  useEffect(() => {
    fetchRestaurants();
  }, [tripId]);

  const fetchRestaurants = async () => {
    try {
      const records = await pb.collection('restaurants').getList(1, 50, {
        filter: `trip_id = "${tripId}"`,
        $autoCancel: false,
      });
      setRestaurants(records.items);
    } catch (error) {
      toast.error('Failed to load restaurants');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const record = await pb.collection('restaurants').create({
        ...newRestaurant,
        trip_id: tripId,
        cost: Number(newRestaurant.cost) || 0
      }, { $autoCancel: false });
      setRestaurants([...restaurants, record]);
      setNewRestaurant({ name: '', cuisine: '', cost: '', allergies_accommodated: '' });
      toast.success('Restaurant added');
    } catch (error) {
      toast.error('Failed to add restaurant');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this restaurant?')) return;
    try {
      await pb.collection('restaurants').delete(id, { $autoCancel: false });
      setRestaurants(restaurants.filter(r => r.id !== id));
      toast.success('Restaurant deleted');
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const filtered = restaurants.filter(r => r.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <Helmet><title>Restaurants - VaykAIo</title></Helmet>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold flex items-center gap-2"><Utensils className="w-8 h-8 text-primary"/> Restaurants</h1>
        </div>

        <Card>
          <CardHeader><CardTitle>Add Restaurant</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="flex gap-4 flex-wrap items-end">
              <div className="space-y-1 flex-1 min-w-[200px]">
                <label className="text-sm font-medium">Name</label>
                <Input required value={newRestaurant.name} onChange={e => setNewRestaurant({...newRestaurant, name: e.target.value})} placeholder="Restaurant name" />
              </div>
              <div className="space-y-1 flex-1 min-w-[150px]">
                <label className="text-sm font-medium">Cuisine</label>
                <Input value={newRestaurant.cuisine} onChange={e => setNewRestaurant({...newRestaurant, cuisine: e.target.value})} placeholder="e.g. Italian" />
              </div>
              <div className="space-y-1 w-24">
                <label className="text-sm font-medium">Cost ($)</label>
                <Input type="number" value={newRestaurant.cost} onChange={e => setNewRestaurant({...newRestaurant, cost: e.target.value})} placeholder="0" />
              </div>
              <Button type="submit"><Plus className="w-4 h-4 mr-2"/> Add</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Saved Restaurants</CardTitle>
            <div className="relative w-64">
              <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
              <Input className="pl-9" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-64 w-full" /> : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Cuisine</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Allergies</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No restaurants found.</TableCell></TableRow>
                  ) : filtered.map(r => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">{r.name}</TableCell>
                      <TableCell>{r.cuisine || '-'}</TableCell>
                      <TableCell>${r.cost || 0}</TableCell>
                      <TableCell>
                        {r.allergies_accommodated ? <Badge variant="secondary">{r.allergies_accommodated}</Badge> : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(r.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default RestaurantsPage;
