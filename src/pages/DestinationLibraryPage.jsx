
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Trash2, Plus, Image as ImageIcon, MapPin } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';

const DestinationLibraryPage = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [newDest, setNewDest] = useState({ name: '', description: '', popular_activities: '' });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      const records = await pb.collection('destination_library').getList(1, 50, {
        sort: '-created',
        $autoCancel: false,
      });
      setDestinations(records.items);
    } catch (error) {
      toast.error('Failed to load destinations');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', newDest.name);
      formData.append('description', newDest.description);
      formData.append('popular_activities', newDest.popular_activities);
      if (imageFile) formData.append('image', imageFile);

      const record = await pb.collection('destination_library').create(formData, { $autoCancel: false });
      setDestinations([record, ...destinations]);
      setNewDest({ name: '', description: '', popular_activities: '' });
      setImageFile(null);
      toast.success('Destination added');
    } catch (error) {
      toast.error('Failed to add destination');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this destination?')) return;
    try {
      await pb.collection('destination_library').delete(id, { $autoCancel: false });
      setDestinations(destinations.filter(d => d.id !== id));
      toast.success('Destination deleted');
    } catch (error) {
      toast.error('Failed to delete destination');
    }
  };

  const filtered = destinations.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Helmet><title>Destination Library - Admin - VaykAIo</title></Helmet>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Destination Library</h1>
          <Badge variant="secondary" className="text-sm">Total: {destinations.length}</Badge>
        </div>

        <Card>
          <CardHeader><CardTitle>Add New Destination</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">Name</label>
                <Input required value={newDest.name} onChange={e => setNewDest({...newDest, name: e.target.value})} placeholder="e.g. Tokyo, Japan" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Cover Image</label>
                <Input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea value={newDest.description} onChange={e => setNewDest({...newDest, description: e.target.value})} placeholder="About this destination..." />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-sm font-medium">Popular Activities (comma separated)</label>
                <Input value={newDest.popular_activities} onChange={e => setNewDest({...newDest, popular_activities: e.target.value})} placeholder="Sightseeing, Food Tours, Museums" />
              </div>
              <Button type="submit" className="md:col-span-2"><Plus className="w-4 h-4 mr-2"/> Add Destination</Button>
            </form>
          </CardContent>
        </Card>

        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Library</h2>
          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search destinations..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1,2,3].map(i => <Skeleton key={i} className="h-64 w-full" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.length === 0 ? (
              <div className="col-span-full text-center py-12 text-muted-foreground bg-card rounded-xl border">No destinations found.</div>
            ) : filtered.map(dest => (
              <Card key={dest.id} className="overflow-hidden flex flex-col">
                <div className="h-48 bg-muted relative">
                  {dest.image ? (
                    <img src={pb.files.getUrl(dest, dest.image)} alt={dest.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-8 h-8 text-muted-foreground"/></div>
                  )}
                  <div className="absolute top-2 right-2">
                    <Button variant="destructive" size="icon" className="h-8 w-8 opacity-80 hover:opacity-100" onClick={() => handleDelete(dest.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2"><MapPin className="w-5 h-5 text-primary"/> {dest.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{dest.description}</p>
                  {dest.popular_activities && (
                    <div className="flex flex-wrap gap-1">
                      {dest.popular_activities.split(',').map((act, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">{act.trim()}</Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default DestinationLibraryPage;
