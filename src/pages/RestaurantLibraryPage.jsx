
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Trash2, Plus, Image as ImageIcon } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';

const RestaurantLibraryPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [newRestaurant, setNewRestaurant] = useState({ name: '', destination: '', cuisine: '', cost: '', allergies_accommodated: '', description: '' });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const records = await pb.collection('restaurant_library').getList(1, 100, {
        sort: '-created',
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
      const formData = new FormData();
      formData.append('name', newRestaurant.name);
      formData.append('destination', newRestaurant.destination);
      formData.append('cuisine', newRestaurant.cuisine);
      formData.append('cost', Number(newRestaurant.cost) || 0);
      formData.append('allergies_accommodated', newRestaurant.allergies_accommodated);
      formData.append('description', newRestaurant.description);
      if (imageFile) formData.append('image', imageFile);

      const record = await pb.collection('restaurant_library').create(formData, { $autoCancel: false });
      setRestaurants([record, ...restaurants]);
      setNewRestaurant({ name: '', destination: '', cuisine: '', cost: '', allergies_accommodated: '', description: '' });
      setImageFile(null);
      toast.success('Restaurant added to library');
    } catch (error) {
      toast.error('Failed to add restaurant');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this restaurant from the library?')) return;
    try {
      await pb.collection('restaurant_library').delete(id, { $autoCancel: false });
      setRestaurants(restaurants.filter(r => r.id !== id));
      toast.success('Restaurant deleted');
    } catch (error) {
      toast.error('Failed to delete restaurant');
    }
  };

  const filtered = restaurants.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase()) || 
    r.destination.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Helmet><title>Restaurant Library - Admin - VaykAIo</title></Helmet>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Restaurant Library</h1>
          <Badge variant="secondary" className="text-sm">Total: {restaurants.length}</Badge>
        </div>

        <Card>
          <CardHeader><CardTitle>Add New Restaurant</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 items-end">
              <div className="space-y-1 lg:col-span-2">
                <label className="text-sm font-medium">Name</label>
                <Input required value={newRestaurant.name} onChange={e => setNewRestaurant({...newRestaurant, name: e.target.value})} placeholder="Restaurant name" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Destination</label>
                <Input required value={newRestaurant.destination} onChange={e => setNewRestaurant({...newRestaurant, destination: e.target.value})} placeholder="City/Country" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Cuisine</label>
                <Input value={newRestaurant.cuisine} onChange={e => setNewRestaurant({...newRestaurant, cuisine: e.target.value})} placeholder="e.g. Italian" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Cost ($)</label>
                <Input type="number" value={newRestaurant.cost} onChange={e => setNewRestaurant({...newRestaurant, cost: e.target.value})} placeholder="0" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Image</label>
                <Input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} />
              </div>
              <div className="space-y-1 lg:col-span-2">
                <label className="text-sm font-medium">Allergies Accommodated</label>
                <Input value={newRestaurant.allergies_accommodated} onChange={e => setNewRestaurant({...newRestaurant, allergies_accommodated: e.target.value})} placeholder="Vegan, Gluten-free" />
              </div>
              <div className="space-y-1 lg:col-span-3">
                <label className="text-sm font-medium">Description</label>
                <Input value={newRestaurant.description} onChange={e => setNewRestaurant({...newRestaurant, description: e.target.value})} placeholder="Short description" />
              </div>
              <Button type="submit"><Plus className="w-4 h-4 mr-2"/> Add</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Library</CardTitle>
            <div className="relative w-72">
              <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
              <Input className="pl-9" placeholder="Search restaurants..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-96 w-full" /> : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">Image</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Destination</TableHead>
                      <TableHead>Cuisine</TableHead>
                      <TableHead>Allergies</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.length === 0 ? (
                      <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No restaurants found.</TableCell></TableRow>
                    ) : filtered.map(restaurant => (
                      <TableRow key={restaurant.id}>
                        <TableCell>
                          {restaurant.image ? (
                            <img src={pb.files.getUrl(restaurant, restaurant.image)} alt={restaurant.name} className="w-10 h-10 rounded object-cover" />
                          ) : (
                            <div className="w-10 h-10 rounded bg-muted flex items-center justify-center"><ImageIcon className="w-4 h-4 text-muted-foreground"/></div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">
                          <div>{restaurant.name}</div>
                          <div className="text-xs text-muted-foreground truncate max-w-[200px]">{restaurant.description}</div>
                        </TableCell>
                        <TableCell>{restaurant.destination}</TableCell>
                        <TableCell>{restaurant.cuisine || '-'}</TableCell>
                        <TableCell>
                          {restaurant.allergies_accommodated ? <Badge variant="secondary">{restaurant.allergies_accommodated}</Badge> : '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(restaurant.id)}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default RestaurantLibraryPage;
